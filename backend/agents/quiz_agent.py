"""
Quiz Agent - Powered by Pydantic AI
Generates quizzes and practice questions
"""
import os
import json
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider


# Context for quiz generation
class QuizContext(BaseModel):
    """Context for quiz generation"""
    subject: str
    topic: str
    num_questions: int = 5
    difficulty: str = "intermediate"


# Quiz question model
class QuizQuestionData(BaseModel):
    """Model for a single quiz question"""
    question: str
    options: list[str]
    correct_answer: str
    explanation: str


# Quiz data model
class QuizData(BaseModel):
    """Complete quiz data"""
    questions: list[QuizQuestionData]


# Configure the AI model
api_key = os.getenv("OPENROUTER_API_KEY")
model_name = os.getenv("AI_MODEL", "tngtech/deepseek-r1t2-chimera:free")

# Create OpenAI-compatible provider for OpenRouter
provider = OpenAIProvider(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

# Create the model
model = OpenAIChatModel(
    model_name,
    provider=provider,
)

# Initialize the quiz agent
quiz_agent = Agent(
    model,
    deps_type=QuizContext,
    output_type=QuizData,
    system_prompt="""You are a quiz generation expert for StudyBuddy AI.

Your role is to:
1. Create high-quality, educational quiz questions
2. Ensure questions match the specified difficulty level
3. Provide clear, unambiguous questions
4. Offer 4 answer options for each multiple choice question
5. Include detailed explanations for correct answers
6. Make questions progressively build understanding

Question Guidelines:
- Questions should test understanding, not just memorization
- Options should be plausible but clearly distinguishable
- Avoid trick questions or ambiguous wording
- Explanations should teach the concept
- Match the difficulty level (beginner, intermediate, advanced)

Always return questions in valid JSON format matching the QuizData model.
""",
)


# Tools are commented out as the free model doesn't support tool calling
# Uncomment if using a model that supports tools (e.g., gpt-4, claude-3)

# @quiz_agent.tool
async def create_question(
    ctx: RunContext[QuizContext],
    question_text: str,
    correct_answer: str,
    distractors: list[str]
) -> dict:
    """
    Create a formatted quiz question with options.

    Args:
        question_text: The question to ask
        correct_answer: The correct answer
        distractors: Incorrect answer options

    Returns:
        Formatted question dictionary
    """
    import random

    # Combine and shuffle options
    all_options = [correct_answer] + distractors[:3]  # Ensure 4 options total
    random.shuffle(all_options)

    return {
        "question": question_text,
        "options": all_options,
        "correct_answer": correct_answer,
        "explanation": f"The correct answer is '{correct_answer}'."
    }


# @quiz_agent.tool
async def validate_quiz(ctx: RunContext[QuizContext], quiz_data: dict) -> bool:
    """
    Validate that a quiz meets quality standards.

    Args:
        quiz_data: The quiz data to validate

    Returns:
        True if valid, False otherwise
    """
    try:
        # Check number of questions
        if len(quiz_data.get("questions", [])) != ctx.deps.num_questions:
            return False

        # Check each question has required fields
        for q in quiz_data["questions"]:
            if not all(key in q for key in ["question", "options", "correct_answer", "explanation"]):
                return False

            # Check for 4 options
            if len(q["options"]) != 4:
                return False

            # Check correct answer is in options
            if q["correct_answer"] not in q["options"]:
                return False

        return True

    except Exception:
        return False


# @quiz_agent.tool
async def suggest_topics(ctx: RunContext[QuizContext]) -> list[str]:
    """
    Suggest related topics that could be tested.

    Returns:
        List of related topic suggestions
    """
    subject = ctx.deps.subject
    topic = ctx.deps.topic

    # This would ideally use the AI to generate related topics
    # For now, return a simple structure
    return [
        f"Fundamentals of {topic}",
        f"Advanced {topic} concepts",
        f"Practical applications of {topic}",
        f"{topic} in {subject}",
    ]
