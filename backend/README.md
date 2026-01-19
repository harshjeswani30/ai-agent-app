# StudyBuddy AI Backend

Python backend powered by **Pydantic AI** for intelligent study assistance.

## Tech Stack

- **Framework**: FastAPI
- **AI Engine**: Pydantic AI v0.0.14
- **Model Provider**: OpenRouter (free models)
- **Validation**: Pydantic v2

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
```

3. Get free API key:
- Visit https://openrouter.ai
- Sign up for free
- Generate API key
- Free models available: llama-3.2-3b-instruct, phi-3-mini, etc.

## Running

Start the development server:
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload
```

API will be available at http://localhost:8000

## API Endpoints

### Health Check
- `GET /` - Health status

### Chat
- `POST /api/chat` - Chat with AI study assistant
  - Body: `{message: string, subject?: string, difficulty?: string}`

### Quiz Generation
- `POST /api/quiz/generate` - Generate practice quiz
  - Body: `{subject: string, topic: string, num_questions?: number, difficulty?: string}`

### Study Planning
- `POST /api/study-plan` - Create personalized study plan
  - Body: `{subject: string, goal: string, available_hours_per_week: number, duration_weeks: number}`

### Subjects
- `GET /api/subjects` - Get available subjects

## Pydantic AI Agents

### Study Agent (`agents/study_agent.py`)
Handles explanations, concept breakdowns, and study guidance.

**Tools**:
- `break_down_concept` - Breaks complex concepts into parts
- `generate_examples` - Creates practice examples
- `suggest_study_techniques` - Recommends study methods
- `check_understanding` - Generates comprehension questions

### Quiz Agent (`agents/quiz_agent.py`)
Generates quizzes and practice questions.

**Tools**:
- `create_question` - Formats quiz questions
- `validate_quiz` - Ensures quiz quality
- `suggest_topics` - Recommends related topics

## Architecture

```
backend/
├── main.py                 # FastAPI application
├── agents/
│   ├── study_agent.py      # Study assistant agent (Pydantic AI)
│   ├── quiz_agent.py       # Quiz generation agent (Pydantic AI)
│   └── __init__.py
├── requirements.txt
├── .env.example
└── README.md
```

## Environment Variables

- `OPENROUTER_API_KEY` - API key for OpenRouter (required)
- `AI_MODEL` - Model to use (default: meta-llama/llama-3.2-3b-instruct:free)
- `CORS_ORIGINS` - Allowed CORS origins (default: http://localhost:5173)

## Free Models

Available free models on OpenRouter:
- `meta-llama/llama-3.2-3b-instruct:free`
- `microsoft/phi-3-mini-128k-instruct:free`
- `google/gemma-2-9b-it:free`

See https://openrouter.ai/models?order=pricing-low-to-high

## Development

The backend uses **Pydantic AI** for agent orchestration, providing:
- Type-safe agent definitions
- Structured output validation
- Tool/function calling support
- Easy model provider swapping
- Async support out of the box

Each agent is defined with:
- System prompt for behavior
- Context type for dependencies
- Result type for validated outputs
- Tools decorated with `@agent.tool`
