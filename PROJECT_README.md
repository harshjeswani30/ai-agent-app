# Study Buddy AI - Full Stack AI Agent Application

> An intelligent study companion powered by Pydantic AI and Convex

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org/)
[![Pydantic AI](https://img.shields.io/badge/Pydantic_AI-0.0.14-green.svg)](https://ai.pydantic.dev/)
[![Convex](https://img.shields.io/badge/Convex-1.30-orange.svg)](https://www.convex.dev/)

## 📖 Overview

Study Buddy AI is a comprehensive full-stack application that uses advanced AI agents to enhance the learning experience. Built with Pydantic AI, it provides intelligent, personalized study tools for students.

### ✨ Features

- 🧠 **AI Explanations** - Get detailed, adaptive explanations of any topic with examples and key points
- 📚 **Smart Flashcards** - Generate personalized flashcards that test understanding
- 🎯 **Interactive Quizzes** - Take AI-generated quizzes with detailed feedback
- 📅 **Study Schedules** - Create optimized study plans tailored to your goals
- 📊 **Progress Tracking** - Monitor sessions, study time, and quiz scores
- ⭐ **Save & Favorite** - Bookmark important content for later review

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **Animations**: Framer Motion
- **Routing**: React Router
- **State Management**: Convex real-time queries

### Backend (Convex + Python)
- **Database & API**: Convex (real-time, serverless)
- **AI Engine**: Pydantic AI (Python)
- **Web Framework**: FastAPI
- **AI Provider**: OpenRouter (free Gemini 2.0 Flash model)

### Pydantic AI Agents

The application uses 4 specialized Pydantic AI agents:

1. **StudyAgent** - Generates comprehensive topic explanations
2. **FlashcardAgent** - Creates study flashcards with Q&A pairs
3. **QuizAgent** - Generates multiple-choice quizzes with explanations
4. **ScheduleAgent** - Creates personalized study schedules

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.10+
- Convex account (free)
- OpenRouter API key (free tier available)

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
```

4. **Set up Convex**
```bash
npx convex dev
```
Follow the prompts to create a Convex project.

5. **Configure environment variables**

Frontend (.env.local):
```bash
VITE_CONVEX_URL=<your-convex-url>
VITE_PYTHON_API_URL=http://localhost:8000
```

Python backend (python-backend/.env):
```bash
OPENROUTER_API_KEY=<your-openrouter-key>
PORT=8000
```

Get a free OpenRouter API key at: https://openrouter.ai/

### Running the Application

1. **Start the Python backend**
```bash
cd python-backend
python main.py
```

2. **Start the frontend** (in a new terminal)
```bash
pnpm dev
```

3. **Start Convex dev server** (in a new terminal)
```bash
npx convex dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
study-buddy-ai/
├── src/                        # React frontend
│   ├── components/
│   │   ├── tabs/              # Feature tabs (Explain, Quiz, etc.)
│   │   └── ui/                # Shadcn UI components
│   ├── lib/
│   │   └── api.ts             # Python backend API client
│   ├── pages/
│   │   ├── Landing.tsx        # Landing page
│   │   └── Dashboard.tsx      # Main dashboard
│   └── index.css              # Modern blue theme
├── convex/                    # Convex backend
│   ├── schema.ts              # Database schema
│   ├── studySessions.ts       # Session tracking
│   ├── savedContent.ts        # Content management
│   └── quizResults.ts         # Quiz scoring
├── python-backend/            # Python AI backend
│   ├── agents/                # Pydantic AI agents
│   │   ├── study_agent.py
│   │   ├── flashcard_agent.py
│   │   ├── quiz_agent.py
│   │   └── schedule_agent.py
│   ├── main.py               # FastAPI application
│   └── requirements.txt
└── README.md
```

## 🎨 Design

The application features a modern, clean design with:
- Sophisticated blue color palette
- Smooth animations and transitions
- Responsive layout (mobile & desktop)
- Loading states and error handling
- Glassmorphism effects

## 🔒 Security

- Environment variables for sensitive keys
- API key validation
- Rate limiting ready (Convex rate-limiter component)
- Input sanitization

## 📊 Features in Detail

### AI Explanations
- Adaptive depth levels (basic, intermediate, advanced)
- Structured output with key points and examples
- Save explanations for later review

### Smart Flashcards
- Configurable quantity (1-20 cards)
- Interactive flip animation
- Navigation between cards
- Save entire decks

### Interactive Quizzes
- Multiple difficulty levels
- Progress tracking
- Instant feedback with explanations
- Score history and averages

### Study Schedules
- Multi-topic planning
- Flexible duration and day count
- Personalized study tips
- Day-by-day breakdown

## 🌐 Deployment

### Frontend (Vercel)
```bash
pnpm build
vercel deploy
```

### Python Backend (Railway/Render)
```bash
cd python-backend
# Deploy using Railway CLI or Render dashboard
```

### Convex
Convex automatically deploys with `npx convex deploy`

## 🧪 Testing

Run type checks:
```bash
npx tsc -b --noEmit
```

Check Convex functions:
```bash
npx convex dev --once
```

## 📝 License

MIT License - feel free to use this project for learning and development

## 👨‍💻 Built By

[Your Name] - [Your Email]

## 🙏 Acknowledgments

- Pydantic AI for the excellent agent framework
- Convex for the real-time backend
- OpenRouter for free AI model access
- Shadcn UI for beautiful components

---

**Live Demo**: [Your deployment URL]
**Video Demo**: [Your Loom video URL]
**GitHub**: [Your repo URL]
