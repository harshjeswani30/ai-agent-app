# Study Buddy AI 🎓

> An intelligent, full-stack AI study companion powered by Pydantic AI and Convex

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![Pydantic AI](https://img.shields.io/badge/Pydantic_AI-0.0.14-green.svg)
![Convex](https://img.shields.io/badge/Convex-1.30-orange.svg)

**Live Demo**: [Your deployment URL]  
**Video Demo**: [Your Loom video URL]  
**GitHub**: [Your GitHub repo URL]

---

## 📖 Overview

**Study Buddy AI** is a comprehensive full-stack generative AI agent application that transforms how students learn. Built with **Pydantic AI**, it leverages specialized AI agents to provide personalized study assistance.

### The Problem

Students struggle with:
- Getting instant, clear explanations for complex topics
- Creating effective study materials (flashcards, quizzes)
- Managing study time efficiently
- Tracking their learning progress

### The Solution

Study Buddy AI provides:
- 🧠 **AI Explanations** - Adaptive explanations with key points and examples
- 📚 **Smart Flashcards** - Auto-generated flashcards for any topic
- 🎯 **Interactive Quizzes** - AI-generated quizzes with instant feedback
- 📅 **Study Schedules** - Personalized study plans optimized for your goals
- 📊 **Progress Tracking** - Monitor sessions, study time, and quiz performance

---

## ✨ Features

### 1. AI-Powered Explanations
- Enter any topic and get comprehensive explanations
- Choose depth: Basic, Intermediate, or Advanced
- Receive structured responses with:
  - Detailed explanation
  - Key takeaway points
  - Real-world examples
- Save explanations for later review

### 2. Smart Flashcard Generation
- Generate 1-20 flashcards on any topic
- Interactive flip animation
- Navigate between cards easily
- Save entire flashcard decks

### 3. Interactive Quizzes
- Choose difficulty level (Easy, Medium, Hard)
- Multiple-choice questions with 4 options
- Instant feedback with detailed explanations
- Track your scores over time

### 4. Study Schedule Planner
- Plan for multiple topics simultaneously
- Set hours per day and total days
- Get day-by-day breakdown with focus areas
- Receive personalized study tips

### 5. Save & Track Progress
- Save your favorite content
- Track total study sessions
- Monitor hours studied
- View average quiz scores

---

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** + **Shadcn UI** for modern design
- **Framer Motion** for smooth animations
- **React Router** for navigation

### Backend
- **Pydantic AI** (Python) - AI agent framework
- **FastAPI** - High-performance Python web framework
- **Convex** - Real-time serverless database
- **OpenRouter** - AI model gateway (free Gemini 2.0 Flash)

### Deployment
- Frontend: Vercel / Netlify
- Python Backend: Railway / Render
- Database: Convex (automatic deployment)

---

## 🤖 Pydantic AI Agent Architecture

The application uses **4 specialized Pydantic AI agents**:

### 1. StudyAgent (`study_agent.py`)
Generates comprehensive topic explanations with adaptive depth levels. Returns structured output with explanation, key points, and examples.

### 2. FlashcardAgent (`flashcard_agent.py`)
Creates Q&A flashcards that test understanding over memorization. Validates JSON output for consistency.

### 3. QuizAgent (`quiz_agent.py`)
Generates multiple-choice quizzes with 4 options each. Includes explanations for correct answers and supports multiple difficulty levels.

### 4. ScheduleAgent (`schedule_agent.py`)
Creates personalized study schedules optimized for available time and topics. Provides study tips and distributes workload evenly.

Each agent:
- Uses OpenAI-compatible API via OpenRouter
- Implements structured output validation
- Has error handling and fallbacks
- Provides consistent, reliable responses

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and pnpm
- **Python** 3.10+
- **Convex** account (free at convex.dev)
- **OpenRouter** API key (free at openrouter.ai)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd study-buddy-ai
```

2. **Install frontend dependencies**
```bash
pnpm install
```

3. **Install Python dependencies**
```bash
cd python-backend
pip install -r requirements.txt
cd ..
```

4. **Set up Convex**
```bash
npx convex dev
```
Follow the prompts to create/connect a Convex project.

5. **Configure environment variables**

Create `.env.local` in the root:
```bash
VITE_CONVEX_URL=<your-convex-deployment-url>
VITE_PYTHON_API_URL=http://localhost:8000
```

Create `python-backend/.env`:
```bash
OPENROUTER_API_KEY=<your-openrouter-api-key>
PORT=8000
```

Get a free OpenRouter API key at: https://openrouter.ai/keys

---

## 🏃 Running the Application

### Quick Start (Recommended)

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
start.bat
```

### Manual Start

**Terminal 1 - Python Backend:**
```bash
cd python-backend
python main.py
```

**Terminal 2 - Convex Dev Server:**
```bash
npx convex dev
```

**Terminal 3 - Frontend:**
```bash
pnpm dev
```

Open http://localhost:5173 in your browser.

---

## 📁 Project Structure

```
study-buddy-ai/
├── src/                          # React frontend
│   ├── components/
│   │   ├── tabs/                 # Feature tabs (Explain, Quiz, etc.)
│   │   └── ui/                   # Shadcn UI components
│   ├── lib/
│   │   └── api.ts               # Python backend API client
│   ├── pages/
│   │   ├── Landing.tsx          # Landing page
│   │   └── Dashboard.tsx        # Main dashboard
│   └── index.css                # Modern blue theme
│
├── convex/                       # Convex backend
│   ├── schema.ts                # Database schema
│   ├── studySessions.ts         # Session tracking
│   ├── savedContent.ts          # Content management
│   ├── quizzes.ts              # Quiz functions
│   └── http.ts                  # Auth routes
│
├── python-backend/               # Python AI backend
│   ├── agents/                   # Pydantic AI agents
│   │   ├── study_agent.py       # Explanation generation
│   │   ├── flashcard_agent.py   # Flashcard creation
│   │   ├── quiz_agent.py        # Quiz generation
│   │   └── schedule_agent.py    # Schedule planning
│   ├── main.py                  # FastAPI application
│   └── requirements.txt
│
├── PROJECT_README.md             # Detailed documentation
├── DEPLOYMENT.md                 # Deployment guide
├── SUBMISSION.md                 # Submission checklist
├── TESTING_CHECKLIST.md          # Testing guide
├── start.sh / start.bat          # Startup scripts
└── README.md                     # This file
```

---

## 🎨 Design

The application features a **modern blue theme** with:
- Professional color palette (oklch color space)
- Smooth animations via Framer Motion
- Glassmorphism effects (backdrop blur)
- Fully responsive (mobile & desktop)
- Proper loading states and error handling
- Intuitive navigation and user flows

---

## 🌐 Deployment

### Deploy Frontend (Vercel)
```bash
vercel deploy
```

### Deploy Python Backend (Railway)
1. Connect GitHub repository
2. Set root directory to `python-backend`
3. Add environment variables
4. Deploy

### Deploy Convex
```bash
npx convex deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 🧪 Testing

Run type checks:
```bash
npx tsc -b --noEmit
```

Test Convex functions:
```bash
npx convex dev --once
```

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for comprehensive testing guide.

---

## 📝 Documentation

- [PROJECT_README.md](./PROJECT_README.md) - Comprehensive project documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Step-by-step deployment guide
- [SUBMISSION.md](./SUBMISSION.md) - Submission requirements checklist
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - Complete testing guide

---

## 🔑 API Keys

### Required
- **OpenRouter API Key**: Free tier available at https://openrouter.ai/
- **Convex Project**: Free at https://www.convex.dev/

### Optional
- Convex Auth for user authentication (already configured)

---

## 🤝 Contributing

This is a student project. Feel free to fork and adapt for your own use.

---

## 📜 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**[Your Name]**
- Email: [your-email]
- LinkedIn: [your-linkedin]
- Portfolio: [your-portfolio]

---

## 🙏 Acknowledgments

- **Pydantic AI** for the excellent agent framework
- **Convex** for the real-time database platform
- **OpenRouter** for free AI model access
- **Shadcn UI** for beautiful component library
- **Vercel** for frontend hosting

---

## 📺 Video Demo

Watch the 1-minute demo: [Loom Video Link]

The video covers:
- Live feature demonstrations
- Technical architecture explanation
- Pydantic AI agent design
- Full-stack integration

---

## 🐛 Troubleshooting

### Python Backend Won't Start
- Ensure Python 3.10+ is installed
- Check all dependencies are installed
- Verify OpenRouter API key is set
- Ensure port 8000 is available

### Frontend Build Errors
- Delete `node_modules` and reinstall
- Clear Vite cache
- Check TypeScript errors

### Convex Connection Issues
- Run `npx convex dev` to ensure logged in
- Check environment variable is set correctly
- Verify Convex dashboard shows deployment

For more help, see [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md).

---

**Built with ❤️ using Pydantic AI, React, and Convex**

