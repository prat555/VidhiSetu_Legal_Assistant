from __future__ import annotations

import hashlib
import json
import logging
import math
import os
from typing import Any

from dotenv import load_dotenv
from redis.asyncio import Redis
from redis.exceptions import RedisError

# Load environment variables once at module import.
load_dotenv()

logger = logging.getLogger(__name__)

# Redis cache entries stay valid for 24 hours.
CACHE_TTL_SECONDS = 60 * 60 * 24
SEMANTIC_CACHE_MAX_ITEMS = int(os.getenv("SEMANTIC_CACHE_MAX_ITEMS", "300"))
SEMANTIC_CACHE_THRESHOLD = float(os.getenv("SEMANTIC_CACHE_THRESHOLD", "0.93"))
SEMANTIC_CACHE_INDEX_KEY = "legal-rag:semantic:index"
NO_CONTEXT_ANSWER = "i could not find this in my legal database"

# Module-level client is reused across requests.
_redis_client: Redis | None = None
_redis_available = False


def _is_fallback_answer(answer: str) -> bool:
    """Detect standardized no-context responses so they are not cached/reused."""
    normalized = answer.strip().lower().rstrip(".")
    return normalized == NO_CONTEXT_ANSWER


def _cache_key(query: str) -> str:
    """Create a stable SHA256 key for a normalized user query."""
    normalized = query.strip().lower()
    digest = hashlib.sha256(normalized.encode("utf-8")).hexdigest()
    return f"legal-rag:{digest}"


def _semantic_cache_key(query: str) -> str:
    """Create per-query entry keys used by semantic cache index."""
    normalized = query.strip().lower()
    digest = hashlib.sha256(normalized.encode("utf-8")).hexdigest()
    return f"legal-rag:semantic:{digest}"


def _cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """Compute cosine similarity with safe handling for zero vectors."""
    if len(vec_a) != len(vec_b) or not vec_a:
        return 0.0

    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot / (norm_a * norm_b)


async def init_redis() -> None:
    """Initialize one shared Redis connection without crashing on failure."""
    global _redis_client, _redis_available

    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    try:
        _redis_client = Redis.from_url(redis_url, decode_responses=True)
        await _redis_client.ping()
        _redis_available = True
        logger.info("Redis connected at %s", redis_url)
    except RedisError as exc:
        _redis_client = None
        _redis_available = False
        logger.warning("Redis unavailable, cache disabled: %s", exc)


async def get_cached(query: str) -> dict[str, Any] | None:
    """Return cached answer payload for a query, or None on miss/error."""
    if not _redis_client or not _redis_available:
        logger.info("Cache miss (redis unavailable)")
        return None

    key = _cache_key(query)
    try:
        cached = await _redis_client.get(key)
        if not cached:
            logger.info("Cache miss")
            return None
        payload = json.loads(cached)
        if _is_fallback_answer(str(payload.get("answer", ""))):
            logger.info("Cache bypassed (fallback answer)")
            return None
        logger.info("Cache hit")
        return payload
    except (RedisError, json.JSONDecodeError) as exc:
        logger.warning("Cache read failed, skipping cache: %s", exc)
        return None


async def get_semantic_cached(query_embedding: list[float]) -> dict[str, Any] | None:
    """Return nearest semantic cache hit if similarity crosses configured threshold."""
    if not _redis_client or not _redis_available:
        return None

    try:
        keys = await _redis_client.lrange(SEMANTIC_CACHE_INDEX_KEY, 0, SEMANTIC_CACHE_MAX_ITEMS - 1)
        if not keys:
            return None

        entries = await _redis_client.mget(keys)
    except RedisError as exc:
        logger.warning("Semantic cache read failed: %s", exc)
        return None

    best_payload: dict[str, Any] | None = None
    best_score = -1.0

    for raw in entries:
        if not raw:
            continue
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            continue

        if _is_fallback_answer(str(payload.get("answer", ""))):
            continue

        cached_vector = payload.get("query_embedding")
        if not isinstance(cached_vector, list):
            continue

        try:
            vector = [float(value) for value in cached_vector]
        except (TypeError, ValueError):
            continue

        score = _cosine_similarity(query_embedding, vector)
        if score > best_score:
            best_score = score
            best_payload = payload

    if best_payload and best_score >= SEMANTIC_CACHE_THRESHOLD:
        logger.info("Semantic cache hit (score=%.4f)", best_score)
        return {
            "answer": best_payload.get("answer", ""),
            "sources": best_payload.get("sources", []),
            "similarity": best_score,
        }

    return None


async def set_cache(
    query: str,
    answer: str,
    sources: list[str],
    query_embedding: list[float] | None = None,
) -> None:
    """Store exact and semantic cache entries while tolerating Redis failures."""
    if not _redis_client or not _redis_available:
        return

    if _is_fallback_answer(answer):
        logger.info("Skipping cache write for fallback answer")
        return

    key = _cache_key(query)
    payload = {"answer": answer, "sources": sources}
    try:
        await _redis_client.setex(key, CACHE_TTL_SECONDS, json.dumps(payload))

        if query_embedding is not None:
            semantic_key = _semantic_cache_key(query)
            semantic_payload = {
                "answer": answer,
                "sources": sources,
                "query_embedding": query_embedding,
            }
            await _redis_client.setex(semantic_key, CACHE_TTL_SECONDS, json.dumps(semantic_payload))
            await _redis_client.lrem(SEMANTIC_CACHE_INDEX_KEY, 0, semantic_key)
            await _redis_client.lpush(SEMANTIC_CACHE_INDEX_KEY, semantic_key)
            await _redis_client.ltrim(SEMANTIC_CACHE_INDEX_KEY, 0, SEMANTIC_CACHE_MAX_ITEMS - 1)
    except RedisError as exc:
        logger.warning("Cache write failed, continuing without cache: %s", exc)


async def redis_status() -> str:
    """Health-check helper for API status endpoint."""
    if not _redis_client or not _redis_available:
        return "unavailable"

    try:
        await _redis_client.ping()
        return "connected"
    except RedisError:
        return "unavailable"


async def clear_cache(all: bool = False) -> int:
    """Clear cache entries.

    If `all` is True, flush the entire Redis database. Otherwise delete
    keys that start with the service prefix (`legal-rag:`) and the
    semantic index key. Returns the number of keys removed, or -1 when
    a full `FLUSHDB` was executed.
    """
    if not _redis_client or not _redis_available:
        logger.info("Redis unavailable, nothing to clear")
        return 0

    try:
        if all:
            await _redis_client.flushdb()
            logger.info("Flushed entire Redis database")
            return -1

        # Collect keys matching our prefix and delete them in batches.
        cursor = 0
        removed = 0
        batch: list[str] = []
        while True:
            cursor, keys = await _redis_client.scan(cursor=cursor, match="legal-rag:*", count=1000)
            if keys:
                batch.extend(keys)
            if cursor == 0:
                break

        if batch:
            # Redis delete can accept multiple keys.
            removed = await _redis_client.delete(*batch)

        # Remove the semantic index list if present.
        try:
            removed_index = await _redis_client.delete(SEMANTIC_CACHE_INDEX_KEY)
            removed = (removed or 0) + (removed_index or 0)
        except RedisError:
            pass

        logger.info("Cleared %d cache keys", removed)
        return int(removed or 0)
    except RedisError as exc:
        logger.warning("Cache clear failed: %s", exc)
        return 0
