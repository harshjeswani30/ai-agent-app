import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  studySessions: defineTable({
    type: v.string(),
    subject: v.string(),
    topic: v.string(),
    notes: v.string(),
  }),
  
  savedContent: defineTable({
    type: v.string(),
    topic: v.string(),
    content: v.string(),
    isFavorite: v.optional(v.boolean()),
  }),
  
  quizzes: defineTable({
    topic: v.string(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
  }),
});
