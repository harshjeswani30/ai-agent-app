import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get user's overall progress
export const getOverallProgress = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return null;
    }

    const progressRecords = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(20);

    const totalStudyTime = progressRecords.reduce(
      (sum, p) => sum + p.totalStudyTime,
      0
    );
    const totalQuizzes = progressRecords.reduce(
      (sum, p) => sum + p.quizzesTaken,
      0
    );
    const averageScore =
      progressRecords.length > 0
        ? progressRecords.reduce((sum, p) => sum + p.averageScore, 0) /
          progressRecords.length
        : 0;

    // Calculate current streak
    const lastStudyDate = Math.max(
      ...progressRecords.map((p) => p.lastStudyDate),
      0
    );
    const daysSinceLastStudy = Math.floor(
      (Date.now() - lastStudyDate) / (1000 * 60 * 60 * 24)
    );
    const currentStreak = daysSinceLastStudy <= 1 ? progressRecords[0]?.streak || 0 : 0;

    return {
      totalStudyTime,
      totalQuizzes,
      averageScore: Math.round(averageScore),
      currentStreak,
      subjects: progressRecords.map((p) => ({
        subject: p.subject,
        studyTime: p.totalStudyTime,
        quizzesTaken: p.quizzesTaken,
        averageScore: p.averageScore,
      })),
    };
  },
});

// Get subject-specific progress
export const getSubjectProgress = query({
  args: {
    subject: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return null;
    }

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user_and_subject", (q) =>
        q.eq("userId", user._id).eq("subject", args.subject)
      )
      .first();

    if (!progress) {
      return {
        subject: args.subject,
        totalStudyTime: 0,
        quizzesTaken: 0,
        averageScore: 0,
        streak: 0,
      };
    }

    return {
      subject: progress.subject,
      totalStudyTime: progress.totalStudyTime,
      quizzesTaken: progress.quizzesTaken,
      averageScore: progress.averageScore,
      streak: progress.streak,
      lastStudyDate: progress.lastStudyDate,
    };
  },
});

// Get recent activity
export const getRecentActivity = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    // Get recent sessions
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);

    // Get recent quizzes
    const quizzes = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);

    // Combine and sort by creation time
    const activities = [
      ...sessions.map((s) => ({
        type: "session" as const,
        subject: s.subject,
        topic: s.topic,
        time: s._creationTime,
        duration: s.duration,
      })),
      ...quizzes.map((q) => ({
        type: "quiz" as const,
        subject: q.subject,
        topic: q.topic,
        time: q._creationTime,
        score: q.score,
      })),
    ].sort((a, b) => b.time - a.time);

    return activities.slice(0, 15);
  },
});
