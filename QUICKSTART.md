# Quick Start Guide - Study Buddy AI

Get up and running in 5 minutes!

## ⚡ Prerequisites

Make sure you have:
- Node.js 18+ installed
- Python 3.10+ installed
- pnpm installed (`npm install -g pnpm`)

## 🚀 Setup Steps

### 1. Install Dependencies (2 minutes)

```bash
# Install frontend dependencies
pnpm install

# Install Python dependencies
cd python-backend
pip install -r requirements.txt
cd ..
```

### 2. Get API Keys (1 minute)

**OpenRouter API Key** (FREE):
1. Go to https://openrouter.ai/
2. Sign up (free)
3. Go to Keys tab
4. Create new key
5. Copy the key

**Convex Project**:
1. Run `npx convex dev`
2. Follow prompts to create account/project
3. Note your Convex URL

### 3. Configure Environment (30 seconds)

Create `.env.local` in root:
```bash
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_PYTHON_API_URL=http://localhost:8000
```

Create `python-backend/.env`:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
PORT=8000
```

### 4. Start Everything (30 seconds)

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

**Manual (3 terminals):**
```bash
# Terminal 1
cd python-backend && python main.py

# Terminal 2
npx convex dev

# Terminal 3
pnpm dev
```

### 5. Open App (10 seconds)

Navigate to: http://localhost:5173

## ✅ Test It Works

1. Click "Get Started" on landing page
2. Go to "Explain" tab
3. Enter topic: "Photosynthesis"
4. Click "Explain Topic"
5. See AI-generated explanation

If it works, you're all set! 🎉

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 8000
lsof -i :8000
kill -9 <PID>

# Or use different port
# Edit python-backend/.env: PORT=8001
```

### Python Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.10+

# Reinstall dependencies
cd python-backend
pip install --upgrade -r requirements.txt
```

### Convex Won't Connect
```bash
# Login again
npx convex dev

# Clear and restart
npx convex dev --once
```

### API Key Invalid
- Double check your OpenRouter key
- Make sure it's in `python-backend/.env`
- No spaces around the `=` sign
- Key should start with `sk-or-v1-`

## 📚 Next Steps

Once everything works:

1. **Try All Features**
   - AI Explanations
   - Flashcards
   - Quizzes
   - Study Schedules
   - Save content

2. **Read Documentation**
   - README.md - Overview
   - PROJECT_README.md - Technical details
   - DEPLOYMENT.md - Deploy to production

3. **Deploy**
   - Follow DEPLOYMENT.md
   - Test deployed version
   - Record Loom video

## 🆘 Still Having Issues?

1. Check TESTING_CHECKLIST.md
2. Ensure all environment variables are set
3. Check browser console for errors
4. Check terminal logs for errors
5. Verify all services are running

## 📹 Video Demo

Watch how it all works: [Your Loom URL]

---

**That's it! You're ready to go.** 🚀

For detailed information, see README.md
