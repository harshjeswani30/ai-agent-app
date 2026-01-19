"""
Quiz Agent - Generates quiz questions using Pydantic AI
"""

import os
import json
from typing import List, Dict
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel


class QuizAgent:
    def __init__(self):
        """Initialize the Quiz Agent with OpenRouter"""
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable not set")

        self.model = OpenAIModel(
            "google/gemini-2.0-flash-001:free",
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )

        self.agent = Agent(
            self.model,
            system_prompt=(
                "You are a quiz generator. Create multiple-choice questions with 4 options each. "
                "Questions should test comprehension and application, not just recall. "
                "One option must be correct, three must be plausible but incorrect. "
                "Include an explanation for why the correct answer is right. "
                "Return ONLY valid JSON in this exact format: "
                '{{"questions": [{{"question": "...", "options": ["A", "B", "C", "D"], '
                '"correct_answer": "A", "explanation": "..."}}]}}'
            ),
        )

    async def generate_quiz(self, topic: str, difficulty: str, count: int) -> Dict:
        """
        Generate quiz questions for a topic

        Args:
            topic: The subject for the quiz
            difficulty: The difficulty level (easy, medium, hard)
            count: Number of questions to generate

        Returns:
            Dictionary with list of quiz questions
        """
        prompt = (
            f"Generate {count} {difficulty} multiple-choice questions about: {topic}\n\n"
            f"Return ONLY a JSON object with this structure:\n"
            f'{{"questions": [{{"question": "...", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], '
            f'"correct_answer": "Option 1", "explanation": "..."}}, ...]}}\n\n'
            f"No other text, just the JSON."
        )

        result = await self.agent.run(prompt)
        response_text = result.data.strip()

        # Try to parse JSON
        try:
            # Remove markdown code blocks if present
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json"):
                    response_text = response_text[4:]
                response_text = response_text.strip()

            data = json.loads(response_text)
            questions = data.get("questions", [])

            # Validate and ensure correct structure
            validated_questions = []
            for q in questions:
                if all(k in q for k in ["question", "options", "correct_answer", "explanation"]):
                    if len(q["options"]) == 4:
                        validated_questions.append(q)

            # If we don't have enough valid questions, create defaults
            while len(validated_questions) < count:
                validated_questions.append({
                    "question": f"What is an important aspect of {topic}?",
                    "options": [
                        "Fundamental concept A",
                        "Basic principle B",
                        "Core idea C",
                        "Essential element D"
                    ],
                    "correct_answer": "Fundamental concept A",
                    "explanation": "This represents a key understanding of the topic."
                })

            return {"questions": validated_questions[:count]}

        except json.JSONDecodeError:
            # Fallback: Create default questions
            default_questions = []
            for i in range(count):
                default_questions.append({
                    "question": f"Question {i+1} about {topic}",
                    "options": [
                        "Option A - Correct answer",
                        "Option B - Incorrect",
                        "Option C - Incorrect",
                        "Option D - Incorrect"
                    ],
                    "correct_answer": "Option A - Correct answer",
                    "explanation": "This is the correct answer because it accurately describes the concept."
                })

            return {"questions": default_questions}
