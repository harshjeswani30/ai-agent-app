"""
Schedule Agent - Creates personalized study schedules using Pydantic AI
"""

import os
import json
from typing import List, Dict
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel


class ScheduleAgent:
    def __init__(self):
        """Initialize the Schedule Agent with OpenRouter"""
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
                "You are a study schedule optimizer. Create balanced, effective study schedules. "
                "Distribute topics across days, allocate appropriate time based on complexity, "
                "include breaks and variety, and provide study tips. "
                "Return ONLY valid JSON in this exact format: "
                '{{"schedule": [{{"day": 1, "topic": "...", "duration": 60, "focus_area": "..."}}, ...], '
                '"total_hours": 14, "tips": ["Tip 1", "Tip 2", "Tip 3"]}}'
            ),
        )

    async def create_schedule(self, topics: List[str], hours_per_day: int, days: int) -> Dict:
        """
        Create a personalized study schedule

        Args:
            topics: List of topics to study
            hours_per_day: Hours available per day
            days: Number of days for the schedule

        Returns:
            Dictionary with schedule, total_hours, and tips
        """
        prompt = (
            f"Create a {days}-day study schedule for these topics: {', '.join(topics)}\n"
            f"Available time: {hours_per_day} hours per day\n\n"
            f"Return ONLY a JSON object with this structure:\n"
            f'{{"schedule": [{{"day": 1, "topic": "Topic name", "duration": 60, "focus_area": "Specific area"}}, ...], '
            f'"total_hours": {hours_per_day * days}, "tips": ["Study tip 1", "Study tip 2", "Study tip 3"]}}\n\n'
            f"Duration should be in minutes. Distribute topics across all {days} days. "
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

            # Validate structure
            if "schedule" in data and "tips" in data:
                return {
                    "schedule": data["schedule"],
                    "total_hours": data.get("total_hours", hours_per_day * days),
                    "tips": data["tips"]
                }

        except json.JSONDecodeError:
            pass

        # Fallback: Create a basic schedule
        minutes_per_day = hours_per_day * 60
        blocks_per_day = len(topics)
        duration_per_block = minutes_per_day // max(blocks_per_day, 1)

        schedule = []
        for day in range(1, days + 1):
            for i, topic in enumerate(topics):
                schedule.append({
                    "day": day,
                    "topic": topic,
                    "duration": duration_per_block,
                    "focus_area": f"Core concepts and practice for {topic}"
                })

        return {
            "schedule": schedule,
            "total_hours": hours_per_day * days,
            "tips": [
                "Take regular breaks every 45-60 minutes",
                "Review previous day's material before starting new topics",
                "Practice active recall and self-testing",
                "Create summary notes at the end of each session",
                "Stay hydrated and get enough sleep"
            ]
        }
