import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    username: v.optional(v.string()),
  }),

  studySessions: defineTable({
    userId: v.id("users"),
    type: v.string(),
    subject: v.string(),
    topic: v.string(),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  savedContent: defineTable({
    userId: v.id("users"),
    type: v.string(),
    topic: v.string(),
    content: v.string(),
    isFavorite: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "type"]),

  quizzes: defineTable({
    userId: v.id("users"),
    topic: v.string(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
  }).index("by_user", ["userId"]),
});

export default schema;