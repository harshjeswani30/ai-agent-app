import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      username: v.optional(v.string()), // username of the user
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    })
      .index("email", ["email"]) // index for the email. do not remove or modify
      .index("by_username", ["username"]), // index for the username

    // Study session tracking
    studySessions: defineTable({
      userId: v.string(),
      subject: v.string(),
      topic: v.string(),
      duration: v.number(), // in minutes
      notes: v.optional(v.string()),
      status: v.union(v.literal("active"), v.literal("completed"), v.literal("paused")),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_subject", ["userId", "subject"]),

    // Quiz results
    quizResults: defineTable({
      userId: v.string(),
      subject: v.string(),
      topic: v.string(),
      totalQuestions: v.number(),
      correctAnswers: v.number(),
      score: v.number(), // percentage
      difficulty: v.string(),
      timeSpent: v.number(), // in seconds
    })
      .index("by_user", ["userId"])
      .index("by_user_and_subject", ["userId", "subject"]),

    // Chat history
    chatMessages: defineTable({
      userId: v.string(),
      message: v.string(),
      response: v.string(),
      subject: v.optional(v.string()),
      difficulty: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    // Study plans
    studyPlans: defineTable({
      userId: v.string(),
      subject: v.string(),
      goal: v.string(),
      durationWeeks: v.number(),
      hoursPerWeek: v.number(),
      planData: v.string(), // JSON stringified plan
      progress: v.number(), // percentage completed
      status: v.union(v.literal("active"), v.literal("completed"), v.literal("archived")),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_status", ["userId", "status"]),

    // User progress tracking
    userProgress: defineTable({
      userId: v.string(),
      subject: v.string(),
      totalStudyTime: v.number(), // in minutes
      quizzesTaken: v.number(),
      averageScore: v.number(),
      streak: v.number(), // days
      lastStudyDate: v.number(), // timestamp
    })
      .index("by_user", ["userId"])
      .index("by_user_and_subject", ["userId", "subject"]),

    // Saved content (flashcards, explanations, schedules)
    savedContent: defineTable({
      userId: v.string(),
      type: v.union(v.literal("explanation"), v.literal("flashcards"), v.literal("quiz"), v.literal("schedule")),
      topic: v.string(),
      content: v.string(), // JSON stringified content
      isFavorite: v.boolean(),
    }).index("by_user", ["userId"])
      .index("by_user_and_type", ["userId", "type"])
      .index("by_user_and_favorite", ["userId", "isFavorite"])
  },
  {
    schemaValidation: false,
  },
);

export default schema;
