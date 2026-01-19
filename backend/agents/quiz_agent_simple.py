"""
Simple Quiz Agent using OpenAI directly
"""
import os
import json
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

async def generate_quiz(subject: str, topic: str, num_questions: int = 5, difficulty: str = "intermediate"):
    """
    Generate quiz questions
    """
    try:
        client = get_client()
        model = get_model_name()

        prompt = f"""Generate {num_questions} multiple choice quiz questions about {topic} in {subject}.

Difficulty level: {difficulty}

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{{
  "questions": [
    {{
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Explanation of why this is correct"
    }}
  ]
}}

The correct_answer should be the index (0-3) of the correct option.
Make the questions educational and appropriate for the {difficulty} level."""

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a quiz generator. Return ONLY valid JSON, no markdown formatting."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=2000,
        )

        content = response.choices[0].message.content

        # Clean up the response - remove markdown code blocks if present
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        # Parse and return
        quiz_data = json.loads(content)
        return quiz_data

    except json.JSONDecodeError as e:
        # If JSON parsing fails, return a fallback
        return {
            "questions": [
                {
                    "question": f"What is an important concept in {topic}?",
                    "options": ["Concept A", "Concept B", "Concept C", "Concept D"],
                    "correct_answer": 0,
                    "explanation": "This is a placeholder question. The AI response couldn't be parsed properly."
                }
            ]
        }
    except Exception as e:
        raise Exception(f"Error calling OpenRouter API: {str(e)}")
