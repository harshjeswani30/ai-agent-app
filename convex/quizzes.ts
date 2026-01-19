import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Save quiz result
export const saveQuizResult = mutation({
  args: {
    subject: v.string(),
    topic: v.string(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    difficulty: v.string(),
    timeSpent: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || !user._id) {
      throw new Error("Unauthorized");
    }

    const score = (args.correctAnswers / args.totalQuestions) * 100;

    const resultId = await ctx.db.insert("quizResults", {
      userId: user._id as string,
      subject: args.subject,
      topic: args.topic,
      totalQuestions: args.totalQuestions,
      correctAnswers: args.correctAnswers,
      score: Math.round(score),
      difficulty: args.difficulty,
      timeSpent: args.timeSpent,
    });

    // Update user progress
    await updateUserProgress(ctx, user._id, args.subject, score);

    return resultId;
  },
});

// Get user's quiz results
export const getUserQuizzes = query({
  args: {
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    let query = ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc");

    if (args.subject) {
      const subject = args.subject; // TypeScript needs this
      query = ctx.db
        .query("quizResults")
        .withIndex("by_user_and_subject", (q) =>
          q.eq("userId", user._id).eq("subject", subject)
        )
        .order("desc");
    }

    const results = await query.take(50);
    return results;
  },
});

// Get quiz statistics
export const getQuizStats = query({
  args: {
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return null;
    }

    let query = ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id!));

    if (args.subject) {
      const subject = args.subject; // TypeScript needs this
      query = ctx.db
        .query("quizResults")
        .withIndex("by_user_and_subject", (q) =>
          q.eq("userId", user._id!).eq("subject", subject)
        );
    }

    const results = await query.take(100);

    if (results.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuestions: 0,
      };
    }

    const totalQuizzes = results.length;
    const averageScore =
      results.reduce((sum, r) => sum + r.score, 0) / totalQuizzes;
    const bestScore = Math.max(...results.map((r) => r.score));
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      bestScore,
      totalQuestions,
    };
  },
});

// Helper: Update user progress
async function updateUserProgress(
  ctx: any,
  userId: string,
  subject: string,
  score: number
) {
  const progress = await ctx.db
    .query("userProgress")
    .withIndex("by_user_and_subject", (q: any) =>
      q.eq("userId", userId).eq("subject", subject)
    )
    .first();

  if (progress) {
    // Update existing progress
    const newQuizCount = progress.quizzesTaken + 1;
    const newAvgScore =
      (progress.averageScore * progress.quizzesTaken + score) / newQuizCount;

    await ctx.db.patch(progress._id, {
      quizzesTaken: newQuizCount,
      averageScore: Math.round(newAvgScore),
      lastStudyDate: Date.now(),
    });
  } else {
    // Create new progress entry
    await ctx.db.insert("userProgress", {
      userId,
      subject,
      totalStudyTime: 0,
      quizzesTaken: 1,
      averageScore: Math.round(score),
      streak: 1,
      lastStudyDate: Date.now(),
    });
  }
}

// Get average quiz score
export const getAverageScore = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return 0;
    }

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id!))
      .collect();

    if (results.length === 0) return 0;

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    return Math.round(totalScore / results.length);
  },
});

// Save quiz result (for compatibility with new API)
export const saveResult = mutation({
  args: {
    topic: v.string(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const score = (args.correctAnswers / args.totalQuestions) * 100;

    return await ctx.db.insert("quizResults", {
      userId: user._id!,
      subject: args.topic,
      topic: args.topic,
      totalQuestions: args.totalQuestions,
      correctAnswers: args.correctAnswers,
      score,
      difficulty: "medium",
      timeSpent: 0,
    });
  },
});
