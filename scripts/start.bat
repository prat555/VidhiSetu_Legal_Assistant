@echo off
REM VidhiSetu Startup Script for Windows
REM Usage: scripts\start.bat

setlocal enabledelayedexpansion
cd /d "%~dp0\.."

echo.
echo ===============================================================
echo   VidhiSetu - AI Legal Assistant
echo ===============================================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    call npm install
    echo.
)

REM Check if RAG venv exists
if not exist "rag-service\.venv" (
    echo 🐍 Setting up RAG Python environment...
    call npm run setup:rag
    echo.
)

REM Check if Ollama is installed
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Ollama is not installed or not in PATH
    echo.
    echo 📥 To install Ollama, visit: https://ollama.ai
    echo 📥 Then download and install the latest version for Windows
    echo.
    pause
    exit /b 1
)

REM Check if llama3.2:3b model is available
echo 🔍 Checking for llama3.2:3b model...
ollama list 2>nul | find "llama3.2:3b" >nul
if %errorlevel% neq 0 (
    echo 📥 Downloading llama3.2:3b model (this may take a few minutes)...
    call ollama pull llama3.2:3b
    echo.
)

echo ✅ Prerequisites ready!
echo.
echo 🚀 Starting VidhiSetu...
echo.
echo    Web App:    http://localhost:3000
echo    RAG API:    http://127.0.0.1:8002
echo    Health:     http://127.0.0.1:8002/health
echo.
echo ⏱️  First RAG query takes ~50 seconds [embeddings initialization]
echo ⏱️  Subsequent queries are ~5-15 seconds
echo.
echo Press Ctrl+C to stop
echo.
echo ===============================================================
echo.

REM Start with local Qdrant mode (no Docker needed)
set QDRANT_URL=
call npm run dev
