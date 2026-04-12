from __future__ import annotations

import asyncio
import json
import os
import re
import string
from collections.abc import AsyncIterator
from functools import partial
from typing import Any

import requests
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_community.embeddings import FastEmbedEmbeddings, HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_community.vectorstores import Qdrant
from langchain_ollama import ChatOllama
from qdrant_client import QdrantClient
from qdrant_client.http import models as qdrant_models

# Load .env values once for model/vectorstore settings.
load_dotenv()

# Singleton objects avoid reloading heavy models per request.
_EMBEDDINGS: HuggingFaceEmbeddings | FastEmbedEmbeddings | None = None
_CHAIN_INSTANCE: "LegalRAGChain" | None = None
_CHAIN_LOCK = asyncio.Lock()

_STOPWORDS = {
    "a", "an", "the", "is", "are", "was", "were", "to", "of", "for", "in", "on", "and", "or",
    "with", "by", "at", "from", "under", "about", "what", "when", "how", "can", "i", "my",
}


_SECTION_REF_PATTERN = re.compile(r"\b(?:section|sec\.?|s\.)\s*([0-9]{1,4}(?:\s*[-]?\s*[a-z])?)\b", re.IGNORECASE)


def _normalize_legal_text(text: str) -> str:
    """Normalize legal text so section variants like 265B / 265-B / 265 B are comparable."""
    lowered = text.lower()
    alnum_spaced = re.sub(r"[^0-9a-z]+", " ", lowered)
    return re.sub(r"\s+", " ", alnum_spaced).strip()


def _extract_section_query_terms(question: str) -> list[str]:
    """Extract section reference variants to improve matching across punctuation styles."""
    terms: set[str] = set()
    for raw in _SECTION_REF_PATTERN.findall(question):
        compact = re.sub(r"[^0-9a-z]", "", raw.lower())
        if not compact:
            continue

        terms.add(compact)
        suffix_match = re.match(r"^(\d+)([a-z])$", compact)
        if suffix_match:
            num, suffix = suffix_match.groups()
            terms.add(num)
            terms.add(f"{num}-{suffix}")
            terms.add(f"{num} {suffix}")

    return list(terms)


def _build_embeddings() -> HuggingFaceEmbeddings | FastEmbedEmbeddings:
    """Build embeddings from env so we can switch to faster local options."""
    provider = os.getenv("EMBEDDING_PROVIDER", "hf").strip().lower()
    if provider == "fastembed":
        model_name = os.getenv("FASTEMBED_MODEL", "BAAI/bge-small-en-v1.5")
        return FastEmbedEmbeddings(model_name=model_name)

    model_name = os.getenv("EMBEDDING_MODEL", "intfloat/multilingual-e5-large")
    return HuggingFaceEmbeddings(model_name=model_name)


def _ensure_qdrant_search_compat(client: QdrantClient) -> None:
    """Shim qdrant-client query API for LangChain community Qdrant wrapper."""
    if hasattr(client, "search"):
        return

    def _search(
        collection_name: str,
        query_vector: list[float],
        query_filter: qdrant_models.Filter | None = None,
        search_params: qdrant_models.SearchParams | None = None,
        limit: int = 10,
        offset: int = 0,
        with_payload: bool | list[str] = True,
        with_vectors: bool | list[str] = False,
        score_threshold: float | None = None,
        **kwargs: Any,
    ) -> list[Any]:
        effective_filter = query_filter
        if isinstance(query_filter, dict):
            must_conditions = [
                qdrant_models.FieldCondition(
                    key=f"metadata.{key}",
                    match=qdrant_models.MatchValue(value=value),
                )
                for key, value in query_filter.items()
            ]
            effective_filter = qdrant_models.Filter(must=must_conditions)

        response = client.query_points(
            collection_name=collection_name,
            query=query_vector,
            query_filter=effective_filter,
            search_params=search_params,
            limit=limit,
            offset=offset,
            with_payload=with_payload,
            with_vectors=with_vectors,
            score_threshold=score_threshold,
            **kwargs,
        )
        return response.points

    setattr(client, "search", _search)


def _matches_model_name(candidate: str, available_name: str) -> bool:
    """Treat model aliases like llama3 and llama3:latest as equivalent."""
    c = candidate.strip().lower()
    a = available_name.strip().lower()
    return c == a or c == a.removesuffix(":latest") or c.removesuffix(":latest") == a


def _resolve_ollama_model(base_url: str, requested_model: str) -> str:
    """Resolve best available local model, prioritizing higher-quality free models first."""
    tags_url = f"{base_url.rstrip('/')}/api/tags"

    try:
        resp = requests.get(tags_url, timeout=3)
        resp.raise_for_status()
        payload = resp.json()
    except (requests.RequestException, json.JSONDecodeError):
        return requested_model

    available = [str(item.get("name", "")).strip() for item in payload.get("models", []) if item.get("name")]
    if not available:
        return requested_model

    preferred_primary = os.getenv("OLLAMA_PREFERRED_MODEL", "").strip()
    fallbacks = [
        requested_model,
        preferred_primary,
        "qwen2.5:3b",
        "llama3.2:3b",
        "phi3:mini",
        "qwen2.5:7b-instruct",
        "qwen2.5:7b",
        "llama3.1:8b",
        "mistral:7b-instruct",
        "llama3.2:1b",
        "llama3:latest",
        "llama3",
    ]

    for candidate in fallbacks:
        if not candidate:
            continue
        for available_name in available:
            if _matches_model_name(candidate, available_name):
                return available_name

    return requested_model

PROMPT_TEMPLATE = """You are an expert in Indian law. Use ONLY the legal context provided below to answer the question.
If the answer is not in the context, say \"I could not find this in my legal database.\"
Do not use external or general knowledge. If context is insufficient, return only: "I could not find this in my legal database."
Always cite the relevant Act name and Section number if available.
Never invent an Act, section, article, case name, or court.
If a judgment is referenced, mention the case name and court.
Give answers in simple, clear language that a common person can understand.
Structure your answer with these headings:
1) Direct Answer
2) Relevant Law and Section(s)
3) What This Means in Practice
4) Important Conditions or Exceptions
Use bullet points where helpful, and explain legal terms in plain language.
For criminal-law questions, mention equivalent old/new law mapping if present in context (for example CrPC and BNSS).
Keep the answer practical and detailed (around 180-280 words unless a shorter answer is clearly enough).

Legal Context:
{context}

Question: {question}

Answer:"""

NO_CONTEXT_ANSWER = "I could not find this in my legal database."


class LegalRAGChain:
    """Shared RAG pipeline with single embedding/vectorstore/LLM instances."""

    def __init__(
        self,
        vectorstore: Chroma,
        embeddings: HuggingFaceEmbeddings | FastEmbedEmbeddings,
        llm: ChatOllama,
        default_k: int = 4,
        backend: str = "chroma",
        qdrant_client: QdrantClient | None = None,
        qdrant_collection_name: str | None = None,
        qdrant_search_params: qdrant_models.SearchParams | None = None,
    ) -> None:
        self.vectorstore = vectorstore
        self.embeddings = embeddings
        self.llm = llm
        self.default_k = max(1, default_k)
        self.backend = backend
        self.qdrant_client = qdrant_client
        self.qdrant_collection_name = qdrant_collection_name
        self.qdrant_search_params = qdrant_search_params

        # LCEL chain keeps prompting and output parsing explicit.
        prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)
        self.prompt = prompt
        self.answer_chain = prompt | self.llm | StrOutputParser()

    def _build_context(self, docs: list[Document]) -> str:
        """Render retriever output into a compact, citation-friendly context block."""
        parts: list[str] = []
        for idx, doc in enumerate(docs, start=1):
            source = doc.metadata.get("source", "unknown_source")
            act = doc.metadata.get("act", "unknown_act")
            parts.append(f"[{idx}] Source: {source} | Act: {act}\n{doc.page_content}")
        return "\n\n".join(parts)

    def _collect_sources(self, docs: list[Document]) -> list[str]:
        """Keep source list unique and readable for API clients."""
        seen: set[str] = set()
        source_documents: list[str] = []
        for doc in docs:
            source = doc.metadata.get("source", "unknown_source")
            act = doc.metadata.get("act", "unknown_act")
            label = f"{act}/{source}"
            if label not in seen:
                seen.add(label)
                source_documents.append(label)
        return source_documents

    def _infer_query_intent(self, question: str) -> dict[str, Any]:
        """Infer retrieval intent: likely acts, source hints, and statute-vs-judgment preference."""
        normalized = question.strip().lower()

        act_hints = {
            # Constitutional
            "constitutional": [
                "constitution", "fundamental right", "article 14", "article 19", "article 21",
                "citizenship act", "representation of the people", "nhrc", "human rights commission",
            ],
            # Criminal
            "criminal": [
                "ipc", "indian penal code", "bns", "bharatiya nyaya sanhita",
                "crpc", "bnss", "code of criminal procedure", "bharatiya nagarik suraksha",
                "fir", "cognizable", "section 154", "section 173",
                "evidence act", "bsa", "bharatiya sakshya",
                "ndps", "narcotics", "psychotropic",
                "prevention of corruption", "uapa", "unlawful activities", "nia act",
                "murder", "theft", "robbery", "fraud", "cheating", "bail", "arrest",
            ],
            # Civil & Property
            "civil_property": [
                "civil procedure", "cpc", "contract act", "specific relief",
                "transfer of property", "registration act", "easement",
                "limitation act", "partition act", "benami",
            ],
            # Family
            "family": [
                "hindu marriage act", "hindu succession", "hindu adoption",
                "special marriage act", "guardians and wards", "muslim women",
                "family court", "divorce", "maintenance", "alimony", "custody",
                "domestic violence", "triple talaq", "talaq",
            ],
            # Women Protection
            "women_protection": [
                "domestic violence act", "dowry", "posh", "sexual harassment at workplace",
                "immoral traffic", "indecent representation",
            ],
            # Child Protection
            "child_protection": [
                "juvenile justice", "pocso", "child sexual offence",
                "child marriage", "right to education", "rte",
            ],
            # Labour
            "labour": [
                "factories act", "minimum wages", "payment of wages", "payment of bonus",
                "gratuity", "industrial disputes", "trade unions", "provident fund", "epf",
                "esi", "employees state insurance", "maternity benefit",
                "labour law", "labor law", "workmen", "retrenchment",
            ],
            # Labour Codes
            "labour_codes": [
                "code on wages", "industrial relations code", "occupational safety",
                "social security code", "osh code",
            ],
            # Consumer Rights
            "consumer_rights": [
                "consumer protection act", "consumer complaint", "consumer forum",
                "rti", "right to information", "legal services", "public liability",
            ],
            # Cyber & Tech
            "cyber_tech": [
                "it act", "information technology act", "cyber crime", "cybercrime",
                "hacking", "data protection", "dpdp", "digital personal data",
                "aadhaar", "trai", "cyberstalking", "section 66",
            ],
            # Business & Commercial
            "business_commercial": [
                "companies act", "llp", "limited liability partnership",
                "competition act", "insolvency", "ibc", "bankruptcy",
                "sale of goods", "partnership act",
            ],
            # Financial & Banking
            "financial_banking": [
                "rbi act", "banking regulation", "negotiable instruments", "cheque bounce",
                "sebi", "securities", "scra", "stock market",
            ],
            # Property & Real Estate
            "property_realestate": [
                "rera", "real estate", "land acquisition", "stamp act", "stamp duty",
            ],
            # Motor & Transport
            "motor_transport": [
                "motor vehicles act", "mvact", "accident compensation", "carriage by air",
                "railways act", "driving licence",
            ],
            # Environment
            "environment": [
                "environment protection", "pollution", "air act", "water act",
                "forest conservation", "wildlife protection", "ngt", "green tribunal",
            ],
            # Taxation
            "taxation": [
                "income tax", "gst", "goods and services tax", "customs act",
                "itr", "income tax return", "tds",
            ],
            # Arbitration
            "arbitration": [
                "arbitration", "conciliation", "mediation act", "arbitration award",
                "arbitral tribunal",
            ],
            # Media
            "media_information": [
                "press council", "cinematograph", "film certification", "media law",
            ],
            # Corrections & FAQs always surface as supplementary
            "corrections": ["correction", "overruled", "struck down", "unconstitutional", "replaced by"],
            "faqs": ["how to", "what is", "can i", "my rights", "what are my rights"],
        }

        primary_acts: list[str] = []
        for act_name, hints in act_hints.items():
            if any(hint in normalized for hint in hints):
                primary_acts.append(act_name)

        # Source-level hints help pick the right statute inside broad folders (e.g., criminal).
        source_hints_map = {
            "crpc": ["crpc", "code_of_criminal_procedure", "bnss", "bharatiya_nagarik_suraksha_sanhita"],
            "fir": ["crpc", "bnss", "code_of_criminal_procedure", "bharatiya_nagarik_suraksha_sanhita"],
            "cognizable": ["crpc", "bnss", "code_of_criminal_procedure", "bharatiya_nagarik_suraksha_sanhita"],
            "arrest": ["crpc", "bnss", "code_of_criminal_procedure", "bharatiya_nagarik_suraksha_sanhita"],
            "bail": ["crpc", "bnss", "code_of_criminal_procedure", "bharatiya_nagarik_suraksha_sanhita"],
            "evidence": ["evidence", "bharatiya_sakshya", "indian_evidence_act"],
            "ipc": ["ipc", "indian_penal_code", "bns", "bharatiya_nyaya_sanhita"],
            "bns": ["bns", "bharatiya_nyaya_sanhita", "ipc", "indian_penal_code"],
            "constitution": ["constitution_of_india"],
            "article 32": ["constitution_of_india"],
            "article 226": ["constitution_of_india"],
            "sexual harassment": ["sexual_harassment_of_women_at_workplace"],
            "posh": ["sexual_harassment_of_women_at_workplace"],
            "domestic violence": ["protection_of_women_from_domestic_violence"],
            "dowry": ["dowry_prohibition"],
            "gst": ["central_goods_and_services_tax"],
            "income tax": ["income_tax_act"],
            "motor vehicles": ["motor_vehicles_act"],
        }

        source_keywords: list[str] = []
        for cue, hints in source_hints_map.items():
            if cue in normalized:
                source_keywords.extend(hints)

        # Prefer statutes for general legal guidance unless the user asks for case law.
        asks_for_case_law = any(
            token in normalized
            for token in ["judgment", "judgement", "case law", "precedent", "supreme court", "high court", "latest case"]
        )

        return {
            "primary_acts": list(dict.fromkeys(primary_acts)),
            "source_keywords": list(dict.fromkeys(source_keywords)),
            "prefer_statutes": not asks_for_case_law,
            "asks_for_case_law": asks_for_case_law,
            "normalized_question": normalized,
        }

    def _is_judgment_doc(self, doc: Document) -> bool:
        """Heuristic check for judgment corpus documents."""
        act = str(doc.metadata.get("act", "")).lower()
        source = str(doc.metadata.get("source", "")).lower()
        return act == "judgments" or source.endswith("_search.txt")

    def _score_doc(self, doc: Document, intent: dict[str, Any]) -> int:
        """Score documents so the final top-k is better aligned with user intent."""
        score = 0
        act = str(doc.metadata.get("act", "")).lower()
        source = str(doc.metadata.get("source", "")).lower()
        content = doc.page_content.lower()
        normalized_source = _normalize_legal_text(source)
        normalized_content = _normalize_legal_text(content)

        primary_acts: list[str] = intent.get("primary_acts", [])
        source_keywords: list[str] = intent.get("source_keywords", [])
        query_terms: list[str] = intent.get("query_terms", [])

        if act in primary_acts:
            score += 8

        if source_keywords:
            source_hits = sum(1 for kw in source_keywords if kw in source)
            content_hits = sum(1 for kw in source_keywords if kw in content)
            score += source_hits * 6
            score += content_hits * 2

        # Hybrid signal: keyword overlap (BM25-lite) on top of vector retrieval candidates.
        if query_terms:
            source_term_hits = sum(1 for term in query_terms if term in source or term in normalized_source)
            content_term_hits = sum(1 for term in query_terms if term in content or term in normalized_content)
            score += source_term_hits * 3
            score += min(content_term_hits, 6)

        # Reward explicit section/article mentions in source text for legal precision.
        if re.search(r"\b(section|sec\.|article|art\.)\s*\d+", content):
            score += 1

        is_judgment = self._is_judgment_doc(doc)
        if intent.get("prefer_statutes", True) and is_judgment:
            score -= 6
        if intent.get("asks_for_case_law", False) and is_judgment:
            score += 4

        return score

    def _has_sufficient_context(self, question: str, docs: list[Document]) -> bool:
        """Return True only when retrieved docs have enough lexical overlap with the query."""
        if not docs:
            return False

        normalized = _normalize_legal_text(question)
        query_terms = [term for term in normalized.split() if len(term) > 2 and term not in _STOPWORDS]
        query_terms.extend(_extract_section_query_terms(question))
        query_terms = list(dict.fromkeys(query_terms))
        if not query_terms:
            return True

        required_hits = 1 if len(query_terms) <= 2 else 2
        max_hits = 0

        for doc in docs:
            haystack = " ".join([
                str(doc.metadata.get("source", "")).lower(),
                str(doc.metadata.get("act", "")).lower(),
                doc.page_content.lower(),
            ])
            normalized_haystack = _normalize_legal_text(haystack)
            hits = sum(1 for term in set(query_terms) if term in haystack or term in normalized_haystack)
            if hits > max_hits:
                max_hits = hits
            if hits >= 1:  # Reduced required_hits in practice: accept any keyword match
                return True

        # If we have ANY keyword match in at least one document, trust the retrieval
        return max_hits >= 1

    async def _search_by_vector(
        self,
        query_vector: list[float],
        k: int,
        fetch_k: int,
        metadata_filter: dict[str, str] | None = None,
    ) -> list[Document]:
        """Run one MMR vector search with an optional metadata filter."""
        kwargs: dict[str, Any] = {
            "k": k,
            "fetch_k": fetch_k,
            "filter": metadata_filter,
        }
        if self.backend == "qdrant" and self.qdrant_search_params is not None:
            kwargs["search_params"] = self.qdrant_search_params

        search = partial(
            self.vectorstore.max_marginal_relevance_search_by_vector,
            query_vector,
            **kwargs,
        )
        return await asyncio.to_thread(search)

    def _merge_docs(self, primary_docs: list[Document], secondary_docs: list[Document], k: int) -> list[Document]:
        """Merge retrieval results without duplicating source/chunk pairs."""
        merged: list[Document] = []
        seen: set[tuple[str, str]] = set()

        for doc in [*primary_docs, *secondary_docs]:
            key = (
                str(doc.metadata.get("source", "unknown_source")),
                doc.page_content,
            )
            if key in seen:
                continue
            seen.add(key)
            merged.append(doc)
            if len(merged) >= k:
                break

        return merged

    async def retrieve(self, question: str, k: int = 5, query_vector: list[float] | None = None) -> list[Document]:
        """Embed once, gather broad candidates, then rerank with legal-intent signals."""
        if query_vector is None:
            query_vector = await self.embed_query(question)
        intent = self._infer_query_intent(question)

        # Add lexical terms used for hybrid keyword scoring.
        normalized = question.lower().translate(str.maketrans("", "", string.punctuation))
        query_terms = [term for term in normalized.split() if len(term) > 2 and term not in _STOPWORDS]
        query_terms.extend(_extract_section_query_terms(question))
        query_terms = list(dict.fromkeys(query_terms))
        intent["query_terms"] = query_terms

        candidate_docs: list[Document] = []
        filtered_k = int(os.getenv("RAG_FILTERED_K", str(max(k, 6))))
        filtered_fetch_k = int(os.getenv("RAG_FILTERED_FETCH_K", "24"))
        fallback_k = int(os.getenv("RAG_FALLBACK_K", "16"))
        fallback_fetch_k = int(os.getenv("RAG_FALLBACK_FETCH_K", "36"))
        max_candidates = int(os.getenv("RAG_MAX_CANDIDATES", "48"))
        act_names = intent.get("primary_acts", [])
        if act_names:
            tasks = [
                self._search_by_vector(
                    query_vector,
                    k=filtered_k,
                    fetch_k=filtered_fetch_k,
                    metadata_filter={"act": act_name},
                )
                for act_name in act_names
            ]
            filtered_batches = await asyncio.gather(*tasks)
            for filtered_docs in filtered_batches:
                candidate_docs = self._merge_docs(candidate_docs, filtered_docs, k=max_candidates)

        fallback_docs = await self._search_by_vector(query_vector, k=fallback_k, fetch_k=fallback_fetch_k)
        candidate_docs = self._merge_docs(candidate_docs, fallback_docs, k=max_candidates)

        ranked = sorted(candidate_docs, key=lambda d: self._score_doc(d, intent), reverse=True)
        return ranked[:k]

    async def embed_query(self, question: str) -> list[float]:
        """Expose query embedding for semantic cache and pipeline reuse."""
        return await asyncio.to_thread(self.embeddings.embed_query, f"query: {question}")

    async def ask(self, question: str, query_vector: list[float] | None = None) -> dict[str, Any]:
        """Run retrieval + grounded generation and return answer with sources."""
        docs = await self.retrieve(question, k=self.default_k, query_vector=query_vector)
        if not self._has_sufficient_context(question, docs):
            return {
                "answer": NO_CONTEXT_ANSWER,
                "source_documents": [],
            }

        context = self._build_context(docs)

        answer = await self.answer_chain.ainvoke({
            "context": context,
            "question": question,
        })
        source_documents = self._collect_sources(docs)

        return {
            "answer": answer,
            "source_documents": source_documents,
        }

    async def ask_stream(self, question: str, query_vector: list[float] | None = None) -> tuple[AsyncIterator[str], list[str]]:
        """Return a token stream and source list for low-latency UI rendering."""
        docs = await self.retrieve(question, k=self.default_k, query_vector=query_vector)
        if not self._has_sufficient_context(question, docs):
            async def _fallback_stream() -> AsyncIterator[str]:
                yield NO_CONTEXT_ANSWER

            return _fallback_stream(), []

        context = self._build_context(docs)
        source_documents = self._collect_sources(docs)
        rendered_prompt = self.prompt.format(context=context, question=question)

        async def _token_stream() -> AsyncIterator[str]:
            async for chunk in self.llm.astream(rendered_prompt):
                text = getattr(chunk, "content", "")
                if isinstance(text, str) and text:
                    yield text

        return _token_stream(), source_documents

    async def chunks_loaded(self) -> int:
        """Return Chroma collection size for operational health checks."""
        if self.backend == "qdrant" and self.qdrant_client and self.qdrant_collection_name:
            count_result = await asyncio.to_thread(self.qdrant_client.count, self.qdrant_collection_name)
            return int(count_result.count)

        return await asyncio.to_thread(self.vectorstore._collection.count)


async def _build_chain() -> LegalRAGChain:
    """Create the singleton chain objects exactly once."""
    global _EMBEDDINGS

    vector_backend = os.getenv("VECTOR_BACKEND", "chroma").strip().lower()
    chroma_dir = os.getenv("CHROMA_DIR", "./vectorstore")
    qdrant_url = os.getenv("QDRANT_URL", "").strip()
    qdrant_api_key = os.getenv("QDRANT_API_KEY", "").strip() or None
    qdrant_prefer_grpc = os.getenv("QDRANT_PREFER_GRPC", "false").strip().lower() == "true"
    qdrant_path = os.getenv("QDRANT_PATH", "./qdrant_store")
    qdrant_collection_name = os.getenv("QDRANT_COLLECTION", "legal_rag")
    qdrant_hnsw_m = int(os.getenv("QDRANT_HNSW_M", "16"))
    qdrant_hnsw_ef_construct = int(os.getenv("QDRANT_HNSW_EF_CONSTRUCT", "100"))
    qdrant_hnsw_ef_runtime = int(os.getenv("QDRANT_HNSW_EF_RUNTIME", "96"))
    qdrant_binary_quant = os.getenv("QDRANT_ENABLE_BINARY_QUANTIZATION", "true").strip().lower() == "true"
    ollama_model = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")
    ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_max_tokens = int(os.getenv("OLLAMA_MAX_TOKENS", "256"))
    ollama_num_ctx = int(os.getenv("OLLAMA_NUM_CTX", "1536"))
    ollama_timeout_seconds = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "45"))
    rag_top_k = int(os.getenv("RAG_TOP_K", "5"))
    ollama_keep_alive = os.getenv("OLLAMA_KEEP_ALIVE", "30m")

    if _EMBEDDINGS is None:
        _EMBEDDINGS = _build_embeddings()

    qdrant_client: QdrantClient | None = None
    qdrant_search_params: qdrant_models.SearchParams | None = None
    if vector_backend == "qdrant":
        if qdrant_url:
            qdrant_client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key, prefer_grpc=qdrant_prefer_grpc)
        else:
            qdrant_client = QdrantClient(path=qdrant_path)
        _ensure_qdrant_search_compat(qdrant_client)

        exists = await asyncio.to_thread(qdrant_client.collection_exists, qdrant_collection_name)
        if not exists:
            probe_vector = await asyncio.to_thread(_EMBEDDINGS.embed_query, "query: legal retrieval setup")
            vector_size = len(probe_vector)

            quantization_config = None
            if qdrant_binary_quant:
                quantization_config = qdrant_models.BinaryQuantization(
                    binary=qdrant_models.BinaryQuantizationConfig(always_ram=True)
                )

            await asyncio.to_thread(
                qdrant_client.create_collection,
                collection_name=qdrant_collection_name,
                vectors_config=qdrant_models.VectorParams(
                    size=vector_size,
                    distance=qdrant_models.Distance.COSINE,
                ),
                hnsw_config=qdrant_models.HnswConfigDiff(
                    m=qdrant_hnsw_m,
                    ef_construct=qdrant_hnsw_ef_construct,
                ),
                quantization_config=quantization_config,
            )

        vectorstore = Qdrant(
            client=qdrant_client,
            collection_name=qdrant_collection_name,
            embeddings=_EMBEDDINGS,
        )
        qdrant_search_params = qdrant_models.SearchParams(hnsw_ef=qdrant_hnsw_ef_runtime)
    else:
        vectorstore = Chroma(
            embedding_function=_EMBEDDINGS,
            persist_directory=chroma_dir,
        )

    resolved_model = await asyncio.to_thread(_resolve_ollama_model, ollama_base_url, ollama_model)

    llm = ChatOllama(
        model=resolved_model,
        base_url=ollama_base_url,
        temperature=0.1,
        num_predict=ollama_max_tokens,
        num_ctx=ollama_num_ctx,
        keep_alive=ollama_keep_alive,
        timeout=ollama_timeout_seconds,
    )

    return LegalRAGChain(
        vectorstore=vectorstore,
        embeddings=_EMBEDDINGS,
        llm=llm,
        default_k=rag_top_k,
        backend=vector_backend,
        qdrant_client=qdrant_client,
        qdrant_collection_name=qdrant_collection_name if vector_backend == "qdrant" else None,
        qdrant_search_params=qdrant_search_params,
    )


async def get_rag_chain() -> LegalRAGChain:
    """Public accessor that ensures one shared, preloaded chain instance."""
    global _CHAIN_INSTANCE

    if _CHAIN_INSTANCE is not None:
        return _CHAIN_INSTANCE

    async with _CHAIN_LOCK:
        if _CHAIN_INSTANCE is None:
            _CHAIN_INSTANCE = await _build_chain()

    return _CHAIN_INSTANCE
