@echo off
REM Study Buddy AI - Development Startup Script for Windows

echo 🎓 Starting Study Buddy AI...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.10+
    pause
    exit /b 1
)

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pnpm is not installed. Installing...
    npm install -g pnpm
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call pnpm install
)

REM Check Python dependencies
if not exist "python-backend\.venv" (
    echo 🐍 Setting up Python virtual environment...
    cd python-backend
    python -m venv .venv
    call .venv\Scripts\activate.bat
    pip install -r requirements.txt
    cd ..
)

REM Check environment variables
if not exist ".env.local" (
    echo ⚠️  Warning: .env.local not found. Copying from .env.example...
    copy .env.example .env.local
    echo Please update .env.local with your Convex URL
)

if not exist "python-backend\.env" (
    echo ⚠️  Warning: python-backend\.env not found. Copying from .env.example...
    cd python-backend
    copy .env.example .env
    cd ..
    echo Please update python-backend\.env with your OpenRouter API key
    echo Get a free key at: https://openrouter.ai/
)

echo.
echo 🚀 Starting all services...
echo.
echo This will start:
echo   1. Python Backend (http://localhost:8000)
echo   2. Frontend Dev Server (http://localhost:5173)
echo   3. Convex Dev Server
echo.
echo Close this window to stop all services.
echo.

REM Start Python backend
start "Python Backend" cmd /k "cd python-backend && .venv\Scripts\activate.bat && python main.py"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Convex
start "Convex Dev" cmd /k "npx convex dev"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start frontend (keeps this window open)
echo Starting frontend...
call pnpm dev
