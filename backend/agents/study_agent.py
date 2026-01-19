"""
Study Agent - Powered by Pydantic AI
Helps students with explanations, concepts, and study guidance
"""
import os
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider


# Context for the study agent
class StudyContext(BaseModel):
    """Context passed to the study agent"""
    subject: str
    difficulty: str = "intermediate"


# Configure the AI model (using OpenRouter)
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

# Initialize the study agent
study_agent = Agent(
    model,
    deps_type=StudyContext,
    output_type=str,
    system_prompt="""You are StudyBuddy, an expert AI tutor and study assistant.

Your role is to:
1. Explain complex concepts in clear, understandable ways
2. Adapt explanations to the student's difficulty level (beginner, intermediate, advanced)
3. Provide relevant examples and analogies
4. Break down problems step-by-step
5. Encourage learning with positive reinforcement
6. Suggest study strategies and techniques

Guidelines:
- Always be patient and encouraging
- Use simple language for beginners, more technical terms for advanced students
- Provide concrete examples to illustrate abstract concepts
- If the student seems confused, offer to explain differently
- Focus on understanding, not just memorization
- Suggest related topics to explore

Format your responses in a clear, structured way using markdown when helpful.
""",
)


# Tools are commented out as the free model doesn't support tool calling
# Uncomment if using a model that supports tools (e.g., gpt-4, claude-3)

# @study_agent.tool
async def break_down_concept(ctx: RunContext[StudyContext], concept: str) -> str:
    """
    Break down a complex concept into simpler parts.

    Args:
        concept: The concept to break down

    Returns:
        A structured breakdown of the concept
    """
    difficulty = ctx.deps.difficulty
    subject = ctx.deps.subject

    return f"""Breaking down '{concept}' for {difficulty} level in {subject}:

1. **Core Definition**: [Main idea]
2. **Key Components**: [Essential parts]
3. **How It Works**: [Process/mechanism]
4. **Real-World Example**: [Concrete application]
5. **Common Misconceptions**: [What students often get wrong]

This breakdown can be filled in based on the specific concept."""


# @study_agent.tool
async def generate_examples(ctx: RunContext[StudyContext], topic: str, count: int = 3) -> dict:
    """
    Generate practice examples for a topic.

    Args:
        topic: The topic to generate examples for
        count: Number of examples to generate

    Returns:
        A dictionary with examples and solutions
    """
    return {
        "topic": topic,
        "examples": [
            {
                "problem": f"Example problem {i + 1} for {topic}",
                "solution": f"Solution approach for problem {i + 1}",
                "difficulty": ctx.deps.difficulty
            }
            for i in range(count)
        ]
    }


# @study_agent.tool
async def suggest_study_techniques(ctx: RunContext[StudyContext], topic: str) -> list[str]:
    """
    Suggest effective study techniques for a topic.

    Args:
        topic: The topic being studied

    Returns:
        List of study technique suggestions
    """
    techniques = [
        f"**Active Recall**: Test yourself on {topic} without looking at notes",
        f"**Spaced Repetition**: Review {topic} at increasing intervals (1 day, 3 days, 1 week)",
        f"**Feynman Technique**: Explain {topic} as if teaching someone else",
        f"**Practice Problems**: Solve varied problems related to {topic}",
        f"**Mind Mapping**: Create visual connections between concepts in {topic}",
    ]

    return techniques


# @study_agent.tool
async def check_understanding(ctx: RunContext[StudyContext], concept: str) -> dict:
    """
    Generate questions to check understanding of a concept.

    Args:
        concept: The concept to check understanding of

    Returns:
        Dictionary with check questions
    """
    return {
        "concept": concept,
        "check_questions": [
            f"Can you explain {concept} in your own words?",
            f"What is an example of {concept} in real life?",
            f"How does {concept} relate to other topics in {ctx.deps.subject}?",
            f"What would happen if we changed [key parameter] in {concept}?",
        ]
    }
