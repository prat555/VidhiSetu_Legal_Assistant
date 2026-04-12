"""
Focused ingestion for criminal law documents only.
Ingests: criminal/, crpc/, and ipc/ folders.
Useful for testing anticipatory bail queries and other criminal procedure questions.
"""

from __future__ import annotations

import hashlib
import os
import uuid
from pathlib import Path
from typing import Iterable

import fitz  # PyMuPDF
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import FastEmbedEmbeddings, HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_community.vectorstores import Qdrant
from qdrant_client import QdrantClient
from qdrant_client.http import models as qdrant_models

# Load settings such as CHROMA_DIR from .env if present.
load_dotenv()

RAW_DOCS_DIR = Path("data/raw_docs")
CRIMINAL_FOLDERS = {"criminal", "crpc", "ipc"}  # Only these folders
CHROMA_DIR = os.getenv("CHROMA_DIR", "./vectorstore")
VECTOR_BACKEND = os.getenv("VECTOR_BACKEND", "chroma").strip().lower()
QDRANT_URL = os.getenv("QDRANT_URL", "").strip()
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "").strip() or None
QDRANT_PREFER_GRPC = os.getenv("QDRANT_PREFER_GRPC", "false").strip().lower() == "true"
QDRANT_PATH = os.getenv("QDRANT_PATH", "./qdrant_store")
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "legal_rag")
QDRANT_HNSW_M = int(os.getenv("QDRANT_HNSW_M", "16"))
QDRANT_HNSW_EF_CONSTRUCT = int(os.getenv("QDRANT_HNSW_EF_CONSTRUCT", "100"))
QDRANT_ENABLE_BINARY_QUANTIZATION = os.getenv("QDRANT_ENABLE_BINARY_QUANTIZATION", "true").strip().lower() == "true"
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "intfloat/multilingual-e5-large")
EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER", "hf").strip().lower()
FASTEMBED_MODEL = os.getenv("FASTEMBED_MODEL", "BAAI/bge-small-en-v1.5")
INSERT_BATCH_SIZE = 32

CATEGORY_MAP = {
    "criminal": "criminal",
    "crpc": "criminal",
    "ipc": "criminal",
}


def discover_criminal_files(base_dir: Path) -> Iterable[Path]:
    """Yield criminal law documents only."""
    for folder in CRIMINAL_FOLDERS:
        folder_path = base_dir / folder
        if folder_path.exists():
            for path in folder_path.rglob("*"):
                if path.is_file() and path.suffix.lower() in {".pdf", ".txt"}:
                    yield path


def read_pdf(path: Path) -> str:
    """Extract text from PDF pages in order using PyMuPDF."""
    text_parts: list[str] = []
    with fitz.open(path) as doc:
        for page in doc:
            text_parts.append(page.get_text("text"))
    return "\n".join(text_parts)


def read_text(path: Path) -> str:
    """Read plain text files with UTF-8 fallback handling."""
    return path.read_text(encoding="utf-8", errors="ignore")


def infer_category(folder_name: str) -> str:
    """Map folder names to high-level legal categories."""
    return CATEGORY_MAP.get(folder_name.lower(), "criminal")


def compute_chunk_id(chunk_text: str) -> str:
    """Create deterministic IDs to deduplicate across re-ingestion runs."""
    return hashlib.sha256(chunk_text.strip().encode("utf-8")).hexdigest()


def backend_point_id(raw_id: str) -> str:
    """Map deterministic IDs to backend-compatible point IDs."""
    if VECTOR_BACKEND == "qdrant":
        # Local Qdrant requires UUID/int point IDs; use deterministic UUID from hash prefix.
        return str(uuid.UUID(hex=raw_id[:32]))
    return raw_id


def add_texts_in_batches(
    vectorstore: Chroma | Qdrant,
    texts: list[str],
    metadatas: list[dict[str, str]],
    ids: list[str],
    batch_size: int = INSERT_BATCH_SIZE,
) -> int:
    """Insert chunks in smaller batches to keep long ingestions resumable."""
    total_added = 0
    for start_index in range(0, len(texts), batch_size):
        end_index = start_index + batch_size
        vectorstore.add_texts(
            texts=texts[start_index:end_index],
            metadatas=metadatas[start_index:end_index],
            ids=ids[start_index:end_index],
        )
        total_added += len(texts[start_index:end_index])
    return total_added


def build_embeddings() -> HuggingFaceEmbeddings | FastEmbedEmbeddings:
    """Create embeddings with optional fast local backend."""
    if EMBEDDING_PROVIDER == "fastembed":
        return FastEmbedEmbeddings(model_name=FASTEMBED_MODEL)
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)


def build_vectorstore(embeddings: HuggingFaceEmbeddings | FastEmbedEmbeddings) -> tuple[Chroma | Qdrant, QdrantClient | None]:
    """Build configured vector backend for ingestion."""
    if VECTOR_BACKEND == "qdrant":
        if QDRANT_URL:
            client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, prefer_grpc=QDRANT_PREFER_GRPC)
        else:
            client = QdrantClient(path=QDRANT_PATH)
        if not client.collection_exists(QDRANT_COLLECTION):
            probe_vector = embeddings.embed_query("query: legal retrieval setup")
            vector_size = len(probe_vector)

            quantization_config = None
            if QDRANT_ENABLE_BINARY_QUANTIZATION:
                quantization_config = qdrant_models.BinaryQuantization(
                    binary=qdrant_models.BinaryQuantizationConfig(always_ram=True)
                )

            client.create_collection(
                collection_name=QDRANT_COLLECTION,
                vectors_config=qdrant_models.VectorParams(
                    size=vector_size,
                    distance=qdrant_models.Distance.COSINE,
                ),
                hnsw_config=qdrant_models.HnswConfigDiff(
                    m=QDRANT_HNSW_M,
                    ef_construct=QDRANT_HNSW_EF_CONSTRUCT,
                ),
                quantization_config=quantization_config,
            )

        vectorstore = Qdrant(
            client=client,
            collection_name=QDRANT_COLLECTION,
            embeddings=embeddings,
        )
        return vectorstore, client

    return Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings), None


def get_existing_ids(
    vectorstore: Chroma | Qdrant,
    unique_ids: list[str],
    qdrant_client: QdrantClient | None,
) -> set[str]:
    """Get set of IDs already present in backend collection."""
    if not unique_ids:
        return set()

    if VECTOR_BACKEND == "qdrant" and qdrant_client is not None:
        existing_ids: set[str] = set()
        batch_size = 256
        for start in range(0, len(unique_ids), batch_size):
            ids_batch = unique_ids[start : start + batch_size]
            points = qdrant_client.retrieve(
                collection_name=QDRANT_COLLECTION,
                ids=ids_batch,
                with_payload=False,
                with_vectors=False,
            )
            for point in points:
                existing_ids.add(str(point.id))
        return existing_ids

    existing = vectorstore._collection.get(ids=unique_ids, include=[])
    return set(existing.get("ids", []))


def ingest_criminal() -> None:
    """Read criminal law docs, chunk, embed, and persist unique chunks into vectorstore."""
    if not RAW_DOCS_DIR.exists():
        raise FileNotFoundError(f"Raw documents directory not found: {RAW_DOCS_DIR}")

    embeddings = build_embeddings()
    vectorstore, qdrant_client = build_vectorstore(embeddings)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", ".", " "],
    )

    total_files = 0
    total_chunks_added = 0

    print(f"📋 Ingesting criminal law documents from: {CRIMINAL_FOLDERS}")
    print()

    for file_path in discover_criminal_files(RAW_DOCS_DIR):
        total_files += 1
        parent_folder = file_path.parent.name.lower()
        category = infer_category(parent_folder)

        if file_path.suffix.lower() == ".pdf":
            raw_text = read_pdf(file_path)
        else:
            raw_text = read_text(file_path)

        if not raw_text.strip():
            print(f"[skip] Empty text: {file_path}")
            continue

        chunks = splitter.split_text(raw_text)
        if not chunks:
            print(f"[skip] No chunks created: {file_path}")
            continue

        chunk_ids = [backend_point_id(compute_chunk_id(chunk)) for chunk in chunks]

        # Deduplicate within this file first (identical sections in large judgments).
        seen_in_file: set[str] = set()
        unique_texts: list[str] = []
        unique_ids: list[str] = []
        for chunk, chunk_id in zip(chunks, chunk_ids):
            if chunk_id not in seen_in_file:
                seen_in_file.add(chunk_id)
                unique_texts.append(chunk)
                unique_ids.append(chunk_id)

        # Ask vectorstore which of the unique IDs already exist in the store.
        existing_ids = get_existing_ids(vectorstore, unique_ids, qdrant_client)

        new_texts: list[str] = []
        new_metadatas: list[dict[str, str]] = []
        new_ids: list[str] = []

        for chunk, chunk_id in zip(unique_texts, unique_ids):
            if chunk_id in existing_ids:
                continue
            new_texts.append(chunk)
            new_ids.append(chunk_id)
            new_metadatas.append(
                {
                    "source": file_path.name,
                    "act": parent_folder,
                    "category": category,
                }
            )

        if new_texts:
            total_chunks_added += add_texts_in_batches(
                vectorstore,
                texts=new_texts,
                metadatas=new_metadatas,
                ids=new_ids,
            )

        print(
            f"[file] {file_path.name} | chunks={len(chunks)} | unique={len(unique_texts)} | added={len(new_texts)} | skipped={len(unique_texts) - len(new_texts)}"
        )

    if VECTOR_BACKEND != "qdrant":
        vectorstore.persist()
    
    print("\n✅ Criminal law ingestion complete")
    print(f"📊 Total files processed: {total_files}")
    print(f"📊 Total chunks added: {total_chunks_added}")


if __name__ == "__main__":
    ingest_criminal()
