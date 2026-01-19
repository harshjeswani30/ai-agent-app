"""
Simple Study Agent using OpenAI directly
"""
import os
from openai import OpenAI

# Lazy initialization
_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set")
        _client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )
    return _client

def get_model_name():
    return os.getenv("AI_MODEL", "tngtech/deepseek-r1t2-chimera:free")

SYSTEM_PROMPT = """You are StudyBuddy, an expert AI tutor and study assistant.

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
"""

async def run_study_agent(message: str, subject: str = "general", difficulty: str = "intermediate"):
    """
    Run the study agent with a message
    """
    try:
        client = get_client()
        model = get_model_name()

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Subject: {subject}\nDifficulty: {difficulty}\n\n{message}"}
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Error calling OpenRouter API: {str(e)}")
