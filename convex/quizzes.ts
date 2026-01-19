import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveResult = mutation({
  args: {
    topic: v.string(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quizzes", args);
  },
});

export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quizzes").order("desc").take(50);
  },
});

export const getAverageScore = query({
  args: {},
  handler: async (ctx) => {
    const quizzes = await ctx.db.query("quizzes").take(100);
    if (quizzes.length === 0) return 0;
    
    const totalScore = quizzes.reduce((sum, quiz) => {
      return sum + (quiz.correctAnswers / quiz.totalQuestions) * 100;
    }, 0);
    
    return Math.round(totalScore / quizzes.length);
  },
});