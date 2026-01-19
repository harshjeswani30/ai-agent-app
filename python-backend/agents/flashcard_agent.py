"""
Flashcard Agent - Generates study flashcards using Pydantic AI
"""

import os
import json
from typing import List, Dict
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel


class FlashcardAgent:
    def __init__(self):
        """Initialize the Flashcard Agent with OpenRouter"""
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
                "You are a flashcard generator. Create clear, concise flashcards for studying. "
                "Each flashcard should have a question on one side and an answer on the other. "
                "Questions should test understanding, not just memorization. "
                "Answers should be informative but brief (1-2 sentences). "
                "Return ONLY valid JSON in this exact format: "
                '{{"flashcards": [{{"question": "Q1", "answer": "A1"}}, {{"question": "Q2", "answer": "A2"}}]}}'
            ),
        )

    async def generate_flashcards(self, topic: str, count: int) -> Dict:
        """
        Generate flashcards for a topic

        Args:
            topic: The subject for flashcards
            count: Number of flashcards to generate

        Returns:
            Dictionary with list of flashcards
        """
        prompt = (
            f"Generate {count} flashcards about: {topic}\n\n"
            f"Return ONLY a JSON object with this structure:\n"
            f'{{"flashcards": [{{"question": "...", "answer": "..."}}, ...]}}\n\n'
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
            flashcards = data.get("flashcards", [])

            # Ensure we have the requested count
            if len(flashcards) < count:
                # Pad with generic flashcards if needed
                for i in range(len(flashcards), count):
                    flashcards.append({
                        "question": f"What is an important concept in {topic}?",
                        "answer": "This is a key concept that requires further study."
                    })

            return {"flashcards": flashcards[:count]}

        except json.JSONDecodeError:
            # Fallback: Parse manually
            lines = response_text.split("\n")
            flashcards = []
            current_q = None

            for line in lines:
                line = line.strip()
                if line.startswith("Q:") or line.startswith("Question:"):
                    current_q = line.split(":", 1)[1].strip()
                elif (line.startswith("A:") or line.startswith("Answer:")) and current_q:
                    answer = line.split(":", 1)[1].strip()
                    flashcards.append({"question": current_q, "answer": answer})
                    current_q = None

            # If parsing failed, create default flashcards
            if not flashcards:
                flashcards = [
                    {"question": f"What is {topic}?", "answer": f"A fundamental concept in the field."},
                    {"question": f"Why is {topic} important?", "answer": "It forms the basis for advanced understanding."},
                    {"question": f"How is {topic} applied?", "answer": "In various practical scenarios."},
                ]

            return {"flashcards": flashcards[:count]}
