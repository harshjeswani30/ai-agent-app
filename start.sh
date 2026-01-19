#!/bin/bash

# Study Buddy AI - Development Startup Script

echo "🎓 Starting Study Buddy AI..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10+"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing..."
    npm install -g pnpm
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    pnpm install
fi

# Check Python dependencies
if [ ! -d "python-backend/.venv" ]; then
    echo "🐍 Setting up Python virtual environment..."
    cd python-backend
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Check environment variables
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Copying from .env.example..."
    cp .env.example .env.local
    echo "Please update .env.local with your Convex URL"
fi

if [ ! -f "python-backend/.env" ]; then
    echo "⚠️  Warning: python-backend/.env not found. Copying from .env.example..."
    cd python-backend
    cp .env.example .env
    cd ..
    echo "Please update python-backend/.env with your OpenRouter API key"
    echo "Get a free key at: https://openrouter.ai/"
fi

echo ""
echo "🚀 Starting all services..."
echo ""
echo "This will start:"
echo "  1. Python Backend (http://localhost:8000)"
echo "  2. Frontend Dev Server (http://localhost:5173)"
echo "  3. Convex Dev Server"
echo ""

# Start Python backend in background
echo "Starting Python backend..."
cd python-backend
source .venv/bin/activate 2>/dev/null || true
python main.py &
PYTHON_PID=$!
cd ..

# Give Python a moment to start
sleep 2

# Start Convex in background
echo "Starting Convex..."
npx convex dev &
CONVEX_PID=$!

# Give Convex a moment to start
sleep 3

# Start frontend (foreground)
echo "Starting frontend..."
pnpm dev

# Cleanup on exit
trap "kill $PYTHON_PID $CONVEX_PID 2>/dev/null" EXIT

wait
