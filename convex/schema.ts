import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  // Study sessions - tracks when users study
  studySessions: defineTable({
    userId: v.id("users"),
    topic: v.string(),
    type: v.union(
      v.literal("explanation"),
      v.literal("flashcards"),
      v.literal("quiz"),
      v.literal("schedule")
    ),
    duration: v.optional(v.number()), // in minutes
    completed: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "type"]),

  // Saved content - explanations, flashcards, etc.
  savedContent: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("explanation"),
      v.literal("flashcards"),
      v.literal("quiz"),
      v.literal("schedule")
    ),
    topic: v.string(),
    content: v.string(), // JSON stringified content
    isFavorite: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "type"])
    .index("by_user_and_favorite", ["userId", "isFavorite"]),

  // Quiz results - track quiz performance
  quizResults: defineTable({
    userId: v.id("users"),
    topic: v.string(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    score: v.number(), // percentage
  }).index("by_user", ["userId"]),
});

export default schema;
