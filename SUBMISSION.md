# Study Buddy AI - Submission Documentation

## 📝 Project Information

**Project Name**: Study Buddy AI
**Description**: A full-stack generative AI agent application that provides intelligent study assistance using Pydantic AI

**Live Deployment**: [Your deployment URL here]
**GitHub Repository**: [Your GitHub URL here]
**Loom Video**: [Your Loom video URL here]

## 🎯 Problem Solved

Students often struggle with:
- Finding clear explanations for complex topics
- Creating effective study materials (flashcards, quizzes)
- Managing their study time efficiently
- Tracking their learning progress

**Study Buddy AI** solves these problems by providing:
- AI-powered explanations at adaptive difficulty levels
- Automated flashcard generation for any topic
- Interactive quizzes with detailed feedback
- Personalized study schedules
- Progress tracking across all features

## 🏗️ Technical Implementation

### Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn UI (modern design system)
- Framer Motion (animations)
- React Router (navigation)

**Backend:**
- **Pydantic AI** - Core AI agent framework (Python)
- FastAPI - Python web framework for REST API
- Convex - Real-time database and serverless backend
- OpenRouter - AI model gateway (using free Gemini 2.0 Flash)

**Deployment:**
- Frontend: Vercel/Netlify
- Python Backend: Railway/Render
- Convex: Automatic deployment

### Pydantic AI Agent Architecture

The application uses **4 specialized Pydantic AI agents**, each with specific responsibilities:

1. **StudyAgent** (`study_agent.py`)
   - Generates comprehensive topic explanations
   - Adapts depth based on user level (basic/intermediate/advanced)
   - Structures responses with key points and examples

2. **FlashcardAgent** (`flashcard_agent.py`)
   - Creates Q&A flashcards for memorization
   - Focuses on understanding over rote memorization
   - Returns structured JSON output

3. **QuizAgent** (`quiz_agent.py`)
   - Generates multiple-choice questions
   - Provides explanations for correct answers
   - Supports difficulty levels (easy/medium/hard)

4. **ScheduleAgent** (`schedule_agent.py`)
   - Creates optimized study schedules
   - Distributes topics across available time
   - Provides study tips and recommendations

Each agent:
- Uses OpenAI-compatible API through OpenRouter
- Validates responses with Pydantic models
- Implements error handling and fallbacks
- Returns structured, predictable outputs

### Full Stack Flow

```
User Interface (React)
    ↓
API Client (TypeScript)
    ↓
Python Backend (FastAPI)
    ↓
Pydantic AI Agents
    ↓
OpenRouter → Gemini 2.0 Flash (Free)
    ↓
Structured Response
    ↓
Convex Database (persistence)
    ↓
Real-time UI Update
```

### Key Features

#### 1. AI Explanations
- Input any topic
- Choose depth level
- Get structured explanation with:
  - Main explanation (2-3 paragraphs)
  - Key points (3-5 bullets)
  - Real-world examples (2-3)
- Save for later review

#### 2. Smart Flashcards
- Generate 1-20 flashcards
- Interactive flip animation
- Navigate between cards
- Save entire deck

#### 3. Interactive Quizzes
- Choose difficulty level
- Multiple-choice questions
- Instant feedback
- Detailed explanations
- Score tracking and history

#### 4. Study Schedules
- Multi-topic planning
- Flexible time allocation
- Day-by-day breakdown
- Personalized study tips

#### 5. Progress Tracking
- Total study sessions
- Hours studied
- Quiz performance
- Save favorite content

### Design Highlights

- **Modern Blue Theme**: Professional color palette
- **Smooth Animations**: Framer Motion throughout
- **Responsive**: Works on mobile and desktop
- **Loading States**: Clear feedback during AI generation
- **Error Handling**: Graceful fallbacks
- **Glassmorphism**: Modern backdrop blur effects

## 🚀 Running the Project

### Prerequisites
- Node.js 18+, pnpm
- Python 3.10+
- Convex account (free)
- OpenRouter API key (free)

### Quick Start

1. **Clone and install:**
```bash
git clone <your-repo>
cd study-buddy-ai
pnpm install
cd python-backend && pip install -r requirements.txt
```

2. **Configure environment variables:**

`.env.local`:
```
VITE_CONVEX_URL=<your-convex-url>
VITE_PYTHON_API_URL=http://localhost:8000
```

`python-backend/.env`:
```
OPENROUTER_API_KEY=<your-key>
PORT=8000
```

3. **Run all services:**

**Option 1 - Use startup script (Linux/Mac):**
```bash
./start.sh
```

**Option 2 - Use startup script (Windows):**
```bash
start.bat
```

**Option 3 - Manual:**

Terminal 1:
```bash
cd python-backend
python main.py
```

Terminal 2:
```bash
npx convex dev
```

Terminal 3:
```bash
pnpm dev
```

4. **Open http://localhost:5173**

## 📹 Loom Video Guide

The Loom video demonstrates:

1. **Introduction** (0:00-0:15)
   - Face visible
   - Project overview

2. **Live Demo** (0:15-0:40)
   - AI Explanations feature
   - Flashcard generation
   - Quiz taking with scoring
   - Study schedule creation
   - Progress tracking

3. **Technical Walkthrough** (0:40-0:55)
   - Pydantic AI agent architecture
   - Full-stack integration
   - Real-time database updates

4. **Conclusion** (0:55-1:00)
   - Summary of features
   - Call to action

## 📊 Evaluation Criteria Checklist

### Full Stack Application Quality ✅
- [x] Complete end-to-end functionality
- [x] All features working live
- [x] Proper error states and loading indicators
- [x] Responsive design

### Product Flow & UX ✅
- [x] Clear user journey
- [x] Intuitive navigation
- [x] Real user value proposition
- [x] Thoughtful feature design

### Design Language & UX Polish ✅
- [x] Modern blue theme
- [x] Consistent typography
- [x] Proper spacing and layout
- [x] Smooth animations
- [x] Fast performance

### Backend Implementation ✅
- [x] Clean API design (FastAPI)
- [x] Reliable agent orchestration (Pydantic AI)
- [x] Good code structure
- [x] Validation and error handling
- [x] Real-time database (Convex)

### Pydantic AI Integration ✅
- [x] Multiple specialized agents
- [x] Proper agent initialization
- [x] Structured output validation
- [x] Error handling and retries
- [x] Model configuration (OpenRouter)

## 🔐 Environment Variables

### Frontend
- `VITE_CONVEX_URL` - Your Convex deployment URL
- `VITE_PYTHON_API_URL` - Python backend URL (local: http://localhost:8000)

### Python Backend
- `OPENROUTER_API_KEY` - Get free key at https://openrouter.ai/
- `PORT` - Server port (default: 8000)

## 📁 Project Structure

```
study-buddy-ai/
├── src/                         # React frontend
│   ├── components/tabs/         # Feature tabs
│   ├── lib/api.ts              # Backend API client
│   └── pages/
│       ├── Landing.tsx         # Landing page
│       └── Dashboard.tsx       # Main app
├── convex/                     # Convex backend
│   ├── schema.ts               # Database schema
│   ├── studySessions.ts        # Session tracking
│   ├── savedContent.ts         # Content management
│   └── quizzes.ts             # Quiz scoring
├── python-backend/             # Python AI backend
│   ├── agents/                 # Pydantic AI agents
│   │   ├── study_agent.py
│   │   ├── flashcard_agent.py
│   │   ├── quiz_agent.py
│   │   └── schedule_agent.py
│   ├── main.py                # FastAPI app
│   └── requirements.txt
├── PROJECT_README.md           # Comprehensive docs
├── DEPLOYMENT.md               # Deployment guide
└── start.sh / start.bat        # Startup scripts
```

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development with modern tools
- AI agent orchestration with Pydantic AI
- Real-time database integration
- REST API design
- Type-safe development (TypeScript + Python)
- Responsive UI/UX design
- Production deployment

## 📜 License

MIT License

## 🙏 Acknowledgments

- Pydantic AI for the excellent agent framework
- Convex for the real-time backend
- OpenRouter for free AI model access
- Shadcn UI for beautiful components

---

**Submitted by**: [Your Name]
**Date**: January 2026
**Course**: [Course Name]
