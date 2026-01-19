"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { vly } from "../src/lib/vly-integrations";

export const explainTopic = action({
  args: {
    topic: v.string(),
    depth: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `You are an expert tutor. Explain the topic "${args.topic}" at a ${args.depth} level.

Provide:
1. A clear explanation (2-3 paragraphs)
2. 3-5 key points
3. 2-3 practical examples

Format your response as JSON:
{
  "topic": "${args.topic}",
  "explanation": "...",
  "key_points": ["...", "..."],
  "examples": ["...", "..."],
  "timestamp": "..."
}`;

    const result = await vly.ai.completion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1000,
    });

    if (result.success && result.data) {
      const content = result.data.choices[0]?.message?.content || "{}";
      try {
        return JSON.parse(content);
      } catch {
        return {
          topic: args.topic,
          explanation: content,
          key_points: [],
          examples: [],
          timestamp: new Date().toISOString(),
        };
      }
    }

    throw new Error(result.error || "Failed to generate explanation");
  },
});

export const generateFlashcards = action({
  args: {
    topic: v.string(),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const prompt = `Generate ${args.count} flashcards about "${args.topic}".

Format as JSON:
{
  "topic": "${args.topic}",
  "flashcards": [
    {"question": "...", "answer": "..."}
  ],
  "timestamp": "..."
}`;

    const result = await vly.ai.completion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1500,
    });

    if (result.success && result.data) {
      const content = result.data.choices[0]?.message?.content || "{}";
      try {
        return JSON.parse(content);
      } catch {
        return {
          topic: args.topic,
          flashcards: [],
          timestamp: new Date().toISOString(),
        };
      }
    }

    throw new Error(result.error || "Failed to generate flashcards");
  },
});

export const generateQuiz = action({
  args: {
    topic: v.string(),
    difficulty: v.string(),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const prompt = `Generate a ${args.difficulty} difficulty quiz with ${args.count} multiple choice questions about "${args.topic}".

Format as JSON:
{
  "topic": "${args.topic}",
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "..."
    }
  ],
  "timestamp": "..."
}`;

    const result = await vly.ai.completion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      maxTokens: 2000,
    });

    if (result.success && result.data) {
      const content = result.data.choices[0]?.message?.content || "{}";
      try {
        return JSON.parse(content);
      } catch {
        return {
          topic: args.topic,
          questions: [],
          timestamp: new Date().toISOString(),
        };
      }
    }

    throw new Error(result.error || "Failed to generate quiz");
  },
});

export const createSchedule = action({
  args: {
    topics: v.array(v.string()),
    hours_per_day: v.number(),
    days: v.number(),
  },
  handler: async (ctx, args) => {
    const prompt = `Create a ${args.days}-day study schedule for these topics: ${args.topics.join(", ")}. 
Student can study ${args.hours_per_day} hours per day.

Format as JSON:
{
  "schedule": [
    {"day": 1, "topic": "...", "duration": 60, "focus_area": "..."}
  ],
  "total_hours": ${args.hours_per_day * args.days},
  "tips": ["...", "..."],
  "timestamp": "..."
}`;

    const result = await vly.ai.completion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      maxTokens: 2000,
    });

    if (result.success && result.data) {
      const content = result.data.choices[0]?.message?.content || "{}";
      try {
        return JSON.parse(content);
      } catch {
        return {
          schedule: [],
          total_hours: args.hours_per_day * args.days,
          tips: [],
          timestamp: new Date().toISOString(),
        };
      }
    }

    throw new Error(result.error || "Failed to create schedule");
  },
});
