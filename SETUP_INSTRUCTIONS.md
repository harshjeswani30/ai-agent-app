# StudyBuddy AI - Setup Instructions

Welcome! This guide will help you set up and run the StudyBuddy AI application locally.

## 📋 What You'll Need

1. **OpenRouter API Key** (Free)
   - Visit: https://openrouter.ai
   - Sign up for a free account
   - Navigate to "Keys" section
   - Create a new API key
   - Copy it - you'll need it soon!

2. **Convex Account** (Free)
   - Visit: https://convex.dev
   - Sign up for a free account
   - You'll set up a project in Step 3

3. **Node.js & Python**
   - Node.js 18+ (Download from https://nodejs.org)
   - Python 3.10+ (Download from https://python.org)
   - pnpm (Install with: `npm install -g pnpm`)

## 🚀 Quick Start (3 Steps)

### Step 1: Start the Python Backend

Open your terminal and navigate to the `python-backend` directory:

```bash
cd python-backend
```

Create a Python virtual environment:
```bash
python -m venv venv
```

Activate it:
- **Mac/Linux**: `source venv/bin/activate`
- **Windows**: `venv\Scripts\activate`

Install dependencies:
```bash
pip install -r requirements.txt
```

Create your `.env` file:
```bash
cp .env.example .env
```

Open `.env` and add your OpenRouter API key:
```env
OPENROUTER_API_KEY=your_key_here
PORT=8000
```

Start the backend:
```bash
python main.py
```

✅ You should see: "Application startup complete" and the server running on http://localhost:8000

### Step 2: Set Up Convex

Open a **new terminal** in the project root directory.

Install frontend dependencies:
```bash
pnpm install
```

Initialize Convex:
```bash
npx convex dev
```

Follow the prompts:
- Create a new project or link to existing one
- Choose a project name (e.g., "studybuddy-ai")
- Convex will generate your `VITE_CONVEX_URL`

✅ Leave this terminal running - it keeps Convex synced

### Step 3: Start the Frontend

Open a **third terminal** in the project root.

Create `.env.local`:
```bash
cp .env.example .env.local
```

The file should already have the correct values from Convex CLI, but verify:
```env
VITE_CONVEX_URL=https://your-convex-url.convex.cloud
VITE_PYTHON_API_URL=http://localhost:8000
```

Start the dev server:
```bash
pnpm dev
```

✅ Your app will open at http://localhost:5173

## 🎉 You're Done!

You should now have:
1. Python backend running on port 8000
2. Convex dev server syncing
3. React frontend on port 5173

Visit http://localhost:5173 and try:
- ✨ Get AI explanations of any topic
- 📚 Generate study flashcards
- 🎯 Take interactive quizzes
- 📅 Create study schedules

## 🐛 Troubleshooting

### "Backend not responding"
- Check Python backend is running (terminal 1)
- Visit http://localhost:8000 - should see: `{"status":"online"}`
- Make sure your OpenRouter API key is set correctly

### "Convex connection error"
- Check Convex dev is running (terminal 2)
- Run: `npx convex dev` to restart if needed
- Verify `VITE_CONVEX_URL` in `.env.local`

### "Module not found"
- Frontend: Run `pnpm install`
- Backend: Make sure venv is activated, run `pip install -r requirements.txt`

### Type errors when starting
- Run: `npx tsc -b --noEmit` to check for errors
- Most common: Make sure Convex is running first

## 📁 Project Structure

```
studybuddy-ai/
├── python-backend/          # Pydantic AI backend
│   ├── agents/             # AI agents (study, quiz, flashcard, schedule)
│   ├── main.py             # FastAPI server
│   └── .env                # Your API keys (create this)
├── src/                    # React frontend
│   ├── pages/              # Landing, Dashboard
│   ├── components/tabs/    # Feature tabs
│   └── lib/api.ts          # Backend API client
├── convex/                 # Convex backend functions
│   ├── schema.ts           # Database schema
│   ├── studySessions.ts    # Session tracking
│   ├── savedContent.ts     # Saved items
│   └── quizResults.ts      # Quiz scores
└── .env.local              # Frontend config (create this)
```

## 🎓 Next Steps

1. **Try the Features**: Test all 4 tools (Explain, Flashcards, Quiz, Schedule)
2. **Check the Dashboard**: View your study stats
3. **Save Content**: Use the bookmark icons to save items
4. **Deploy**: See DEPLOYMENT_GUIDE.md for production deployment

## 📚 Documentation

- **Main README**: PROJECT_README.md - Full project overview
- **Deployment Guide**: DEPLOYMENT_GUIDE.md - Deploy to production
- **This File**: Quick setup for local development

## 💡 Tips

- Keep all 3 terminals running while developing
- Backend changes: Just save, Python reloads automatically
- Frontend changes: Save and Vite hot-reloads instantly
- Convex changes: Automatically synced by `npx convex dev`

## 🆘 Need Help?

- Check backend logs in terminal 1
- Check Convex logs in terminal 2
- Check browser console (F12) for frontend errors
- Verify all environment variables are set correctly

---

Happy studying! 🎓✨
