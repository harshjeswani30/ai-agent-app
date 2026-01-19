"""
Study Buddy AI - Main FastAPI Application
A Pydantic AI-powered study assistant
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import logging
from typing import List, Optional
from datetime import datetime

from agents.study_agent import StudyAgent
from agents.flashcard_agent import FlashcardAgent
from agents.quiz_agent import QuizAgent
from agents.schedule_agent import ScheduleAgent

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Study Buddy AI",
    description="AI-powered study assistant using Pydantic AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
study_agent = StudyAgent()
flashcard_agent = FlashcardAgent()
quiz_agent = QuizAgent()
schedule_agent = ScheduleAgent()


# Request/Response Models
class TopicRequest(BaseModel):
    topic: str
    depth: str = "intermediate"  # basic, intermediate, advanced


class ExplanationResponse(BaseModel):
    topic: str
    explanation: str
    key_points: List[str]
    examples: List[str]
    timestamp: str


class FlashcardRequest(BaseModel):
    topic: str
    count: int = 5


class Flashcard(BaseModel):
    question: str
    answer: str


class FlashcardResponse(BaseModel):
    topic: str
    flashcards: List[Flashcard]
    timestamp: str


class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "medium"  # easy, medium, hard
    count: int = 5


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str


class QuizResponse(BaseModel):
    topic: str
    questions: List[QuizQuestion]
    timestamp: str


class ScheduleRequest(BaseModel):
    topics: List[str]
    hours_per_day: int = 2
    days: int = 7


class StudyBlock(BaseModel):
    day: int
    topic: str
    duration: int  # minutes
    focus_area: str


class ScheduleResponse(BaseModel):
    schedule: List[StudyBlock]
    total_hours: int
    tips: List[str]
    timestamp: str


# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Study Buddy AI",
        "version": "1.0.0"
    }


@app.post("/api/explain", response_model=ExplanationResponse)
async def explain_topic(request: TopicRequest):
    """
    Generate a detailed explanation of a topic
    """
    try:
        logger.info(f"Explaining topic: {request.topic} at {request.depth} level")
        result = await study_agent.explain_topic(request.topic, request.depth)

        return ExplanationResponse(
            topic=request.topic,
            explanation=result["explanation"],
            key_points=result["key_points"],
            examples=result["examples"],
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        logger.error(f"Error explaining topic: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/flashcards", response_model=FlashcardResponse)
async def generate_flashcards(request: FlashcardRequest):
    """
    Generate flashcards for a topic
    """
    try:
        logger.info(f"Generating {request.count} flashcards for: {request.topic}")
        result = await flashcard_agent.generate_flashcards(request.topic, request.count)

        flashcards = [
            Flashcard(question=fc["question"], answer=fc["answer"])
            for fc in result["flashcards"]
        ]

        return FlashcardResponse(
            topic=request.topic,
            flashcards=flashcards,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        logger.error(f"Error generating flashcards: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """
    Generate a quiz for a topic
    """
    try:
        logger.info(f"Generating {request.count} quiz questions for: {request.topic}")
        result = await quiz_agent.generate_quiz(
            request.topic,
            request.difficulty,
            request.count
        )

        questions = [
            QuizQuestion(
                question=q["question"],
                options=q["options"],
                correct_answer=q["correct_answer"],
                explanation=q["explanation"]
            )
            for q in result["questions"]
        ]

        return QuizResponse(
            topic=request.topic,
            questions=questions,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        logger.error(f"Error generating quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/schedule", response_model=ScheduleResponse)
async def create_study_schedule(request: ScheduleRequest):
    """
    Create a personalized study schedule
    """
    try:
        logger.info(f"Creating schedule for topics: {request.topics}")
        result = await schedule_agent.create_schedule(
            request.topics,
            request.hours_per_day,
            request.days
        )

        blocks = [
            StudyBlock(
                day=block["day"],
                topic=block["topic"],
                duration=block["duration"],
                focus_area=block["focus_area"]
            )
            for block in result["schedule"]
        ]

        return ScheduleResponse(
            schedule=blocks,
            total_hours=result["total_hours"],
            tips=result["tips"],
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        logger.error(f"Error creating schedule: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
