"""
Study Agent - Explains topics and concepts using Pydantic AI
"""

import os
from typing import List, Dict
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel


class StudyAgent:
    def __init__(self):
        """Initialize the Study Agent with OpenRouter"""
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable not set")

        # Use OpenRouter with a free model
        self.model = OpenAIModel(
            "google/gemini-2.0-flash-001:free",
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )

        # Create the agent with a system prompt
        self.agent = Agent(
            self.model,
            system_prompt=(
                "You are an expert educational tutor specializing in breaking down complex topics. "
                "Your role is to provide clear, comprehensive explanations suitable for students. "
                "Always structure your responses with: "
                "1) A main explanation (2-3 paragraphs), "
                "2) Key points (3-5 bullet points), "
                "3) Real-world examples (2-3 examples). "
                "Adapt your depth based on the student's level (basic, intermediate, advanced)."
            ),
        )

    async def explain_topic(self, topic: str, depth: str) -> Dict:
        """
        Generate a comprehensive explanation of a topic

        Args:
            topic: The subject to explain
            depth: The depth level (basic, intermediate, advanced)

        Returns:
            Dictionary with explanation, key_points, and examples
        """
        prompt = (
            f"Explain the following topic at a {depth} level: {topic}\n\n"
            f"Format your response as follows:\n"
            f"EXPLANATION:\n[Your detailed explanation]\n\n"
            f"KEY POINTS:\n- [Point 1]\n- [Point 2]\n- [Point 3]\n\n"
            f"EXAMPLES:\n- [Example 1]\n- [Example 2]\n- [Example 3]"
        )

        result = await self.agent.run(prompt)
        response_text = result.data

        # Parse the structured response
        sections = response_text.split("\n\n")
        explanation = ""
        key_points = []
        examples = []

        current_section = None
        for section in sections:
            if section.startswith("EXPLANATION:"):
                explanation = section.replace("EXPLANATION:", "").strip()
                current_section = "explanation"
            elif section.startswith("KEY POINTS:"):
                current_section = "key_points"
                points_text = section.replace("KEY POINTS:", "").strip()
                key_points = [p.strip("- ").strip() for p in points_text.split("\n") if p.strip()]
            elif section.startswith("EXAMPLES:"):
                current_section = "examples"
                examples_text = section.replace("EXAMPLES:", "").strip()
                examples = [e.strip("- ").strip() for e in examples_text.split("\n") if e.strip()]
            elif current_section == "explanation":
                explanation += "\n\n" + section

        # Fallback parsing if structure isn't followed
        if not explanation:
            lines = response_text.split("\n")
            explanation_lines = []
            for line in lines:
                if line.strip().startswith("-"):
                    if not key_points:
                        key_points.append(line.strip("- ").strip())
                    else:
                        examples.append(line.strip("- ").strip())
                else:
                    explanation_lines.append(line)
            explanation = "\n".join(explanation_lines).strip()

        # Ensure we have content
        if not key_points:
            key_points = ["Understanding requires practice", "Break down complex concepts", "Connect to real applications"]
        if not examples:
            examples = ["Real-world application example", "Practical use case", "Common scenario"]

        return {
            "explanation": explanation or response_text,
            "key_points": key_points[:5],  # Limit to 5
            "examples": examples[:3]  # Limit to 3
        }
