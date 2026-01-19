"""
StudyBuddy AI - FastAPI Backend with Pydantic AI
Main application entry point
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

from agents.study_agent import study_agent, StudyContext
from agents.quiz_agent import quiz_agent, QuizContext

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="StudyBuddy AI API",
    description="AI-powered study assistant using Pydantic AI",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    subject: str | None = None
    difficulty: str | None = "intermediate"


class ChatResponse(BaseModel):
    response: str
    sources: list[str] | None = None
    follow_up_questions: list[str] | None = None


class QuizRequest(BaseModel):
    subject: str
    topic: str
    num_questions: int = 5
    difficulty: str = "intermediate"


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_answer: str
    explanation: str


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]
    subject: str
    topic: str


class StudyPlanRequest(BaseModel):
    subject: str
    goal: str
    available_hours_per_week: int
    duration_weeks: int


class StudyPlanResponse(BaseModel):
    plan: dict
    weekly_schedule: list[dict]
    milestones: list[str]


# Health check endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "StudyBuddy AI",
        "version": "1.0.0"
    }


# Chat with study agent
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with the AI study assistant.
    Handles questions, explanations, and study guidance.
    """
    max_retries = 3
    retry_delay = 0.5  # seconds

    for attempt in range(max_retries):
        try:
            logger.info(f"Processing chat request (attempt {attempt + 1}/{max_retries}): {request.message[:50]}...")

            # Create context for the agent
            context = StudyContext(
                subject=request.subject or "general",
                difficulty=request.difficulty or "intermediate"
            )

            # Run the agent
            result = await study_agent.run(
                request.message,
                deps=context
            )

            # Extract response
            response_text = result.data

            # Generate follow-up questions
            follow_ups = [
                "Can you explain this in simpler terms?",
                "What are some practice problems for this topic?",
                "How does this relate to real-world applications?"
            ]

            return ChatResponse(
                response=response_text,
                sources=None,
                follow_up_questions=follow_ups
            )

        except Exception as e:
            error_msg = str(e)

            # Check if it's a concurrency error
            if "OptimisticConcurrencyControlFailure" in error_msg or "agent_message" in error_msg:
                if attempt < max_retries - 1:
                    logger.warning(f"Database concurrency conflict on attempt {attempt + 1}, retrying in {retry_delay}s...")
                    import asyncio
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                    continue
                else:
                    logger.error(f"Max retries reached for chat request: {error_msg}")
                    raise HTTPException(
                        status_code=503,
                        detail="The AI assistant is currently busy. Please try again in a moment."
                    )
            else:
                # Non-retryable error
                logger.error(f"Error in chat endpoint: {error_msg}")
                raise HTTPException(status_code=500, detail=str(e))


# Generate quiz
@app.post("/api/quiz/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """
    Generate a quiz for a given subject and topic.
    Uses AI to create questions with multiple choice answers.
    """
    max_retries = 3
    retry_delay = 0.5

    for attempt in range(max_retries):
        try:
            logger.info(f"Generating quiz (attempt {attempt + 1}/{max_retries}): {request.subject} - {request.topic}")

            # Create context for quiz agent
            context = QuizContext(
                subject=request.subject,
                topic=request.topic,
                num_questions=request.num_questions,
                difficulty=request.difficulty
            )

            # Run the quiz agent
            result = await quiz_agent.run(
                f"Generate {request.num_questions} quiz questions about {request.topic} in {request.subject}",
                deps=context
            )

            # Parse the quiz data
            quiz_data = result.data

            return QuizResponse(
                questions=quiz_data["questions"],
                subject=request.subject,
                topic=request.topic
            )

        except Exception as e:
            error_msg = str(e)

            if "OptimisticConcurrencyControlFailure" in error_msg or "agent_message" in error_msg:
                if attempt < max_retries - 1:
                    logger.warning(f"Database concurrency conflict, retrying in {retry_delay}s...")
                    import asyncio
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2
                    continue
                else:
                    logger.error(f"Max retries reached for quiz generation: {error_msg}")
                    raise HTTPException(
                        status_code=503,
                        detail="The AI assistant is currently busy. Please try again."
                    )
            else:
                logger.error(f"Error generating quiz: {error_msg}")
                raise HTTPException(status_code=500, detail=str(e))


# Generate study plan
@app.post("/api/study-plan", response_model=StudyPlanResponse)
async def generate_study_plan(request: StudyPlanRequest):
    """
    Generate a personalized study plan based on goals and availability.
    """
    try:
        logger.info(f"Generating study plan for: {request.subject}")

        # Create context
        context = StudyContext(
            subject=request.subject,
            difficulty="intermediate"
        )

        # Create prompt for study plan
        prompt = f"""Create a detailed study plan for:
- Subject: {request.subject}
- Goal: {request.goal}
- Available time: {request.available_hours_per_week} hours/week
- Duration: {request.duration_weeks} weeks

Provide a structured plan with weekly breakdown and milestones."""

        # Run the agent
        result = await study_agent.run(prompt, deps=context)

        # Parse the response into structured format
        plan_text = result.data

        # Create sample weekly schedule (in production, parse from AI response)
        weekly_schedule = [
            {
                "week": i + 1,
                "topics": [f"Topic {i + 1}.1", f"Topic {i + 1}.2"],
                "hours": request.available_hours_per_week
            }
            for i in range(request.duration_weeks)
        ]

        milestones = [
            f"Week {i * (request.duration_weeks // 3)}: Milestone {i + 1}"
            for i in range(1, 4)
        ]

        return StudyPlanResponse(
            plan={"overview": plan_text},
            weekly_schedule=weekly_schedule,
            milestones=milestones
        )

    except Exception as e:
        logger.error(f"Error generating study plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get available subjects
@app.get("/api/subjects")
async def get_subjects():
    """Get list of available subjects"""
    return {
        "subjects": [
            {"id": "mathematics", "name": "Mathematics", "icon": "📐"},
            {"id": "science", "name": "Science", "icon": "🔬"},
            {"id": "programming", "name": "Programming", "icon": "💻"},
            {"id": "languages", "name": "Languages", "icon": "🌍"},
            {"id": "history", "name": "History", "icon": "📚"},
            {"id": "literature", "name": "Literature", "icon": "📖"},
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
