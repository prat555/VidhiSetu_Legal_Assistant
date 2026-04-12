from __future__ import annotations

import asyncio
import json
import logging
import re
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from api.cache import (
    get_cached,
    get_semantic_cached,
    init_redis,
    redis_status,
    set_cache,
    clear_cache,
)

# Basic logging helps monitor cache behavior and startup readiness.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _normalize_user_question(message: str) -> str:
    """Normalize known legal-term typos for more reliable retrieval and caching."""
    normalized = message.strip()
    normalized = re.sub(r"\banticipatory\s+bill\b", "anticipatory bail", normalized, flags=re.IGNORECASE)
    return normalized


class LegalChatRequest(BaseModel):
    """Request model for legal chat endpoint."""

    message: str = Field(..., min_length=1)
    session_id: str | None = None


class LegalChatResponse(BaseModel):
    """Response model returned to API consumers."""

    answer: str
    sources: list[str]
    cached: bool


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Warm up shared services once at startup and keep app lifecycle explicit."""
    try:
        await init_redis()
        logger.info("Redis initialized")
    except Exception as e:
        logger.warning("Redis initialization failed (non-critical): %s", e)

    # Keep startup lightweight and stable on Windows by avoiding eager model preload.
    # The RAG chain is initialized lazily on the first request.
    yield


app = FastAPI(title="Legal RAG Service", version="1.0.0", lifespan=lifespan)

# Keep CORS open for local frontend integration, including localhost:3000.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/legal-chat", response_model=LegalChatResponse)
async def legal_chat(payload: LegalChatRequest) -> LegalChatResponse:
    """Serve grounded legal answers with cache-first behavior."""
    from api.rag_chain import get_rag_chain
    
    question = _normalize_user_question(payload.message)
    if not question:
        raise HTTPException(status_code=400, detail="message cannot be empty")

    cached_payload = await get_cached(question)
    if cached_payload:
        return LegalChatResponse(
            answer=cached_payload.get("answer", ""),
            sources=cached_payload.get("sources", []),
            cached=True,
        )

    try:
        chain = await asyncio.wait_for(get_rag_chain(), timeout=90)
        query_embedding = await asyncio.wait_for(chain.embed_query(question), timeout=60)

        semantic_cached_payload = await get_semantic_cached(query_embedding)
        if semantic_cached_payload:
            return LegalChatResponse(
                answer=semantic_cached_payload.get("answer", ""),
                sources=semantic_cached_payload.get("sources", []),
                cached=True,
            )

        result = await asyncio.wait_for(chain.ask(question, query_vector=query_embedding), timeout=120)
        answer = result["answer"]
        sources = result["source_documents"]

        await set_cache(question, answer, sources, query_embedding=query_embedding)

        return LegalChatResponse(answer=answer, sources=sources, cached=False)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logger.exception("RAG execution failed")
        raise HTTPException(status_code=500, detail=f"Internal server error: {exc}") from exc


def _sse(event: str, data: dict[str, object]) -> str:
    """Format one server-sent-event frame."""
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=True)}\n\n"


@app.post("/api/legal-chat/stream")
async def legal_chat_stream(payload: LegalChatRequest) -> StreamingResponse:
    """Stream answer tokens to clients while generation continues in the background."""
    from api.rag_chain import get_rag_chain
    
    question = _normalize_user_question(payload.message)
    if not question:
        raise HTTPException(status_code=400, detail="message cannot be empty")

    cached_payload = await get_cached(question)
    if cached_payload:
        answer = str(cached_payload.get("answer", ""))
        sources = cached_payload.get("sources", [])

        async def _cached_stream() -> AsyncIterator[str]:
            yield _sse("token", {"delta": answer})
            yield _sse("done", {"answer": answer, "sources": sources, "cached": True})

        return StreamingResponse(
            _cached_stream(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )

    try:
        chain = await asyncio.wait_for(get_rag_chain(), timeout=90)
        query_embedding = await asyncio.wait_for(chain.embed_query(question), timeout=60)

        semantic_cached_payload = await get_semantic_cached(query_embedding)
        if semantic_cached_payload:
            answer = str(semantic_cached_payload.get("answer", ""))
            sources = semantic_cached_payload.get("sources", [])

            async def _semantic_cached_stream() -> AsyncIterator[str]:
                yield _sse("token", {"delta": answer})
                yield _sse("done", {"answer": answer, "sources": sources, "cached": True})

            return StreamingResponse(
                _semantic_cached_stream(),
                media_type="text/event-stream",
                headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
            )

        token_stream, sources = await asyncio.wait_for(
            chain.ask_stream(question, query_vector=query_embedding),
            timeout=120,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("RAG streaming setup failed")
        raise HTTPException(status_code=500, detail=f"Internal server error: {exc}") from exc

    async def _stream() -> AsyncIterator[str]:
        parts: list[str] = []
        next_token_task: asyncio.Task[str] | None = None
        try:
            yield _sse("meta", {"stage": "started", "message": "Retrieval complete. Generating answer..."})

            stream_iter = token_stream.__aiter__()
            next_token_task = asyncio.create_task(stream_iter.__anext__())
            while True:
                done, _ = await asyncio.wait({next_token_task}, timeout=3.0)
                if not done:
                    yield _sse("meta", {"stage": "generating", "message": "still_generating"})
                    continue

                try:
                    token = next_token_task.result()
                except StopAsyncIteration:
                    break

                parts.append(token)
                yield _sse("token", {"delta": token})
                next_token_task = asyncio.create_task(stream_iter.__anext__())

            answer = "".join(parts).strip()
            await set_cache(question, answer, sources, query_embedding=query_embedding)
            yield _sse("done", {"answer": answer, "sources": sources, "cached": False})
        except Exception as exc:  # noqa: BLE001
            logger.exception("RAG token streaming failed")
            yield _sse("error", {"detail": f"streaming failed: {exc}"})
        finally:
            if next_token_task and not next_token_task.done():
                next_token_task.cancel()

    return StreamingResponse(
        _stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.get("/health")
async def health() -> dict[str, object]:
    """Expose service readiness details for monitoring."""
    return {
        "status": "ok",
        "chunks_loaded": None,
        "redis": await redis_status(),
    }


@app.post("/api/cache/clear")
async def api_clear_cache(all: bool = False) -> dict[str, object]:
    """Clear the RAG service cache.

    Query parameter `all=true` will flush the entire Redis database.
    Otherwise only keys managed by this service are removed.
    Returns JSON with number of cleared keys (or -1 for full flush).
    """
    try:
        removed = await clear_cache(all=all)
        return {"status": "ok", "cleared": removed}
    except Exception as exc:  # noqa: BLE001
        logger.exception("Cache clear failed")
        raise HTTPException(status_code=500, detail=f"cache clear failed: {exc}") from exc
