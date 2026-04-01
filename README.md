# VidhiSetu ⚖️

VidhiSetu is a comprehensive legal assistance platform that leverages artificial intelligence to make Indian legal services accessible and understandable for everyone. The platform serves as a one-stop solution for individuals seeking legal guidance, document analysis, and information about their rights under Indian law. It combines modern web technologies with AI capabilities to provide instant legal assistance, helping users navigate complex legal procedures without requiring prior legal knowledge.

> **👉 New User?** See [QUICKSTART.md](QUICKSTART.md) for a 30-second setup guide!

## Features

**AI Legal Assistant**

An intelligent conversational chatbot that answers questions about Indian law, legal procedures, and constitutional rights. Users can engage in natural conversations to understand complex legal concepts, get guidance on legal matters, and receive information about various aspects of Indian legislation.

**Document Analyzer**

Upload legal documents in multiple formats including PDF, DOCX, and TXT for comprehensive AI-powered analysis. The analyzer provides document classification, detailed summaries, extraction of key clauses and terms, assessment of potential legal risks, actionable recommendations, and relevant references to Indian laws and statutes.

**Legal Forms Generator**

Create professional legal documents through an intuitive step-by-step wizard. Generate business contracts such as NDAs and partnership agreements, personal documents including affidavits and power of attorney, and employment-related forms like offer letters and employment contracts. Documents can be exported as formatted PDFs or text files with proper legal formatting.

**Case Law Search**

Search through an extensive database of Supreme Court and High Court judgments. Access verified landmark cases and explore comprehensive case law from Indian Kanoon to research legal precedents and understand judicial interpretations of various laws.

**Know Your Rights**

An educational module featuring interactive scenarios that guide users through real-life legal situations such as police encounters, cyber fraud, and workplace disputes. Includes comprehensive legal guides with step-by-step procedures, emergency helpline numbers for immediate assistance, and explanations of key legal provisions in simple language.

**Case Tracker**

A feature to track ongoing legal cases and court proceedings, currently in development.

## Tech Stack

- Next.js 16 with TypeScript
- Tailwind CSS 4
- Google Gemini API for AI-powered features
- Ollama for local LLM support (optional)
- Firebase Authentication and Firestore
- Lucide React Icons
- jsPDF with html2canvas for PDF generation

## Integrated RAG Setup (Single Folder)

The Legal RAG backend is now integrated inside this project at `rag-service/`, so you do not need a separate workspace folder. The RAG system comes fully configured with 57,000+ legal document chunks ready for retrieval-augmented generation.

### Quick Start for New Users (Recommended)

**1. Clone and install dependencies:**
```bash
git clone https://github.com/prat555/VidhiSetu_AI_Legal_Assistant.git -b integrated-rag
cd vidhisetu
npm install
npm run setup:rag
```

**2. Start the project:**

**Option A: Windows (Git Bash or CMD)**
```bash
# Git Bash
./scripts/start.sh

# Or Windows CMD
scripts\start.bat
```

**Option B: Mac/Linux**
```bash
bash scripts/start.sh
```

This will automatically:
- ✅ Start Next.js on `http://localhost:3000`
- ✅ Start FastAPI RAG service on `http://127.0.0.1:8002`
- ✅ Use local Qdrant indexing (no Docker needed)
- ⚠️ First chat query takes ~50 seconds (subsequent queries are faster)

### Manual Startup

If you prefer to run commands manually:
```bash
cd /path/to/vidhisetu
QDRANT_URL= npm run dev
```

The environment variable `QDRANT_URL=` forces local file-based Qdrant mode, which works without external Qdrant server.

### Advanced Setup with Docker (Optional - Faster)

For production or if you have 10+ concurrent users, use external Qdrant and Redis:

**1. Start Docker containers:**
```bash
docker run -d --name vidhisetu-qdrant -p 6333:6333 -v qdrant_storage:/qdrant/storage qdrant/qdrant
docker run -d --name vidhisetu-redis -p 6379:6379 redis:7-alpine
```

**2. Ensure Ollama is running:**
```bash
ollama serve
ollama pull llama3.2:3b
```

**3. Start the project (normal mode):**
```bash
npm run dev
```

**Stop containers:**
```bash
docker stop vidhisetu-qdrant vidhisetu-redis
docker rm vidhisetu-qdrant vidhisetu-redis
```

### Architecture

- **Frontend:** Next.js 16 (TypeScript, Tailwind CSS) on port 3000
- **RAG Backend:** FastAPI with LangChain on port 8002
- **Vector Store:** Qdrant (local file-based by default, or external http://127.0.0.1:6333)
- **LLM Runtime:** Ollama with llama3.2:3b (must be installed)
- **Embeddings:** HuggingFace multilingual-e5-large
- **Caching:** Redis (optional, falls back gracefully if unavailable)

### System Requirements

- **Node.js:** 18+
- **Python:** 3.10+
- **Ollama:** Latest version with `llama3.2:3b` model installed
- **RAM:** 8GB minimum (12GB+ recommended for smooth RAG)
- **Disk:** 5GB for embeddings cache + vector database

### Troubleshooting

**"Connection refused" on port 8002?**
- RAG is still initializing embeddings (takes ~30-60 seconds on first run)
- Check logs for "Application startup complete"

**Chat queries timeout?**
- Normal for first query (~50 seconds with local Qdrant)
- Subsequent queries are 5-15 seconds
- Use external Qdrant (Docker) for faster responses at scale

**Ollama not found?**
```bash
ollama --version  # Should print version, not "command not found"
ollama list       # Should show llama3.2:3b
```

**Qdrant local-mode warning about 57k+ chunks?**
- This is a performance warning only—it works fine for development
- Use Docker Qdrant in production for better performance

### Environment Variables

The RAG service respects these `.env` settings (in `rag-service/.env`):

```
VECTOR_BACKEND=qdrant           # Use Qdrant for vector storage
QDRANT_URL=                      # Leave empty for local mode, set to http://127.0.0.1:6333 for Docker
QDRANT_PATH=./qdrant_store      # Local storage directory
QDRANT_COLLECTION=legal_rag     # Collection name
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
REDIS_URL=redis://localhost:6379  # Optional caching (falls back if unavailable)
EMBEDDING_MODEL=intfloat/multilingual-e5-large
```