# VidhiSetu - Quick Start Guide 🚀

Welcome to VidhiSetu, the AI-powered legal assistant for Indian law!

## 30-Second Setup

### For Windows Users (Git Bash or CMD):
```bash
# Git Bash
./scripts/start.sh

# Or Windows CMD
scripts\start.bat
```

### For Mac/Linux Users:
```bash
bash scripts/start.sh
```

That's it! The script will:
- ✅ Install all dependencies
- ✅ Set up the RAG Python environment
- ✅ Download the AI model (if needed)
- ✅ Start both the web app and RAG backend

## What Happens Next?

1. **Web App loads at:** `http://localhost:3000`
   - Full legal assistant interface
   - Document analyzer
   - Legal forms generator
   - Case law search
   - Know your rights guides

2. **RAG Backend runs at:** `http://127.0.0.1:8002`
   - Powers the chat feature
   - Retrieves from 57,000+ legal documents
   - First query: ~50 seconds (normal, one-time setup)
   - Subsequent queries: 5-15 seconds

3. **Press `Ctrl+C`** to stop when done

## Prerequisites

Make sure you have installed:
- **Node.js 18+** → [Download](https://nodejs.org)
- **Python 3.10+** → [Download](https://python.org)
- **Ollama** → [Download](https://ollama.ai) (includes AI model)
- **Git** → [Download](https://git-scm.com)

## Troubleshooting

### Still can't connect to port 3000?
- Wait 30 seconds—Next.js needs time to compile
- Check if another app is using port 3000
- Try: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)

### RAG taking too long?
- This is normal for first query (50s)
- Ollama needs time to load the model
- Subsequent queries are much faster (5-15s)

### "Ollama not found"?
- Install Ollama from https://ollama.ai
- Make sure it's in your PATH: `ollama --version`

### Out of memory?
- Increase available RAM or reduce Ollama model context size
- Edit `rag-service/.env`: `OLLAMA_NUM_CTX=1024` (reduce from 2048)

## Next Steps

👉 **First time?**
- Open http://localhost:3000
- Try the "Chat" feature
- Ask something like "What is bail?"
- Explore other features

👉 **Want to use Docker for speed?**
- See "Advanced Setup" in [README.md](../README.md#advanced-setup-with-docker-optional---faster)

👉 **Want to customize?**
- Edit configuration in `rag-service/.env`
- See [README.md](../README.md#environment-variables)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Your Browser                          │
│              (http://localhost:3000)                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Next.js Frontend (TypeScript)                   │
│         - Chat Interface                                │
│         - Document Analyzer                             │
│         - Legal Forms Generator                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Calls /api/legal-chat
                     │
┌────────────────────▼────────────────────────────────────┐
│    FastAPI RAG Backend (http://127.0.0.1:8002)           │
│    - Retrieves from 57k+ legal documents                │
│    - Sends to Ollama for generation                     │
│    - Caches with Redis (optional)                       │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐   ┌─────────▼──────────┐
│ Qdrant           │   │ Ollama (Local LLM) │
│ (Vector Store)   │   │ llama3.2:3b        │
│ 57k+ embeddings  │   │                    │
└──────────────────┘   └────────────────────┘
```

## Learn More

- 📖 **Full Documentation:** See [README.md](../README.md)
- 🏗️ **Architecture Details:** See README → Integrated RAG Setup
- 🐛 **Troubleshooting:** See [README.md](../README.md#troubleshooting)
- 🔧 **Environment Config:** See [README.md](../README.md#environment-variables)

---

**Questions?** Check the README or open an issue on GitHub.

**Happy exploring!** 🎓⚖️
