import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveResult = mutation({
  args: {
    topic: v.string(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.insert("quizzes", {
      userId: userId,
      topic: args.topic,
      totalQuestions: args.totalQuestions,
      correctAnswers: args.correctAnswers,
    });
  },
});

export const getAverageScore = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const quizzes = await ctx.db
      .query("quizzes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (quizzes.length === 0) return 0;

    const totalScore = quizzes.reduce((sum, quiz) => {
      return sum + (quiz.correctAnswers / quiz.totalQuestions) * 100;
    }, 0);

    return Math.round(totalScore / quizzes.length);
  },
});