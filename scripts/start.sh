#!/bin/bash

# VidhiSetu Startup Script
# Works on macOS, Linux, and Windows Git Bash
# 
# Usage: bash scripts/start.sh

set -e  # Exit on any error

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  VidhiSetu - AI Legal Assistant"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    echo ""
fi

# Check if RAG venv exists
if [ ! -d "rag-service/.venv" ]; then
    echo "🐍 Setting up RAG Python environment..."
    npm run setup:rag
    echo ""
fi

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo ""
    echo "❌ ERROR: Ollama is not installed or not in PATH"
    echo ""
    echo "📥 To install Ollama, visit: https://ollama.ai"
    echo "📥 Then download and install the latest version for your OS"
    echo ""
    exit 1
fi

# Check if llama3.2:3b model is available
echo "🔍 Checking for llama3.2:3b model..."
if ! ollama list 2>/dev/null | grep -q "llama3.2:3b"; then
    echo "📥 Downloading llama3.2:3b model (this may take a few minutes)..."
    ollama pull llama3.2:3b
    echo ""
fi

echo "✅ Prerequisites ready!"
echo ""
echo "🚀 Starting VidhiSetu..."
echo ""
echo "   Web App:    http://localhost:3000"
echo "   RAG API:    http://127.0.0.1:8002"
echo "   Health:     http://127.0.0.1:8002/health"
echo ""
echo "⏱️  First RAG query takes ~50 seconds (embeddings initialization)"
echo "⏱️  Subsequent queries are ~5-15 seconds"
echo ""
echo "Press Ctrl+C to stop"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start with local Qdrant mode (no Docker needed)
export QDRANT_URL=
npm run dev
