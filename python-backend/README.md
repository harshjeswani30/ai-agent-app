# Study Buddy AI - Python Backend

This is the Python backend for Study Buddy AI, built with Pydantic AI and FastAPI.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Get a free API key from [OpenRouter](https://openrouter.ai/)
   - Add your API key to `.env`

3. Run the server:
```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

- `POST /api/explain` - Generate topic explanations
- `POST /api/flashcards` - Generate flashcards
- `POST /api/quiz` - Generate quiz questions
- `POST /api/schedule` - Create study schedules

## Tech Stack

- **Pydantic AI** - AI agent framework
- **FastAPI** - Web framework
- **OpenRouter** - AI model gateway (using free Gemini model)
