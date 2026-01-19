import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Save quiz result
export const saveResult = mutation({
  args: {
    topic: v.string(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const score = (args.correctAnswers / args.totalQuestions) * 100;

    return await ctx.db.insert("quizResults", {
      userId,
      topic: args.topic,
      totalQuestions: args.totalQuestions,
      correctAnswers: args.correctAnswers,
      score,
    });
  },
});

// Get user's quiz results
export const getUserResults = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit ?? 20);
  },
});

// Get average score
export const getAverageScore = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0;
    }

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (results.length === 0) return 0;

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    return Math.round(totalScore / results.length);
  },
});
