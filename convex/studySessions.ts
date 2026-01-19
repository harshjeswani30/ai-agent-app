import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new study session
export const create = mutation({
  args: {
    topic: v.string(),
    type: v.union(
      v.literal("explanation"),
      v.literal("flashcards"),
      v.literal("quiz"),
      v.literal("schedule")
    ),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("studySessions", {
      userId,
      topic: args.topic,
      type: args.type,
      duration: args.duration,
      completed: false,
    });
  },
});

// Complete a study session
export const complete = mutation({
  args: {
    sessionId: v.id("studySessions"),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or unauthorized");
    }

    await ctx.db.patch(args.sessionId, {
      completed: true,
      duration: args.duration ?? session.duration,
    });
  },
});

// Get user's study sessions
export const getUserSessions = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit ?? 50);

    return sessions;
  },
});

// Get study statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        byType: {
          explanation: 0,
          flashcards: 0,
          quiz: 0,
          schedule: 0,
        },
      };
    }

    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const totalMinutes = sessions.reduce(
      (sum, s) => sum + (s.duration ?? 0),
      0
    );

    const byType = {
      explanation: 0,
      flashcards: 0,
      quiz: 0,
      schedule: 0,
    };

    sessions.forEach((s) => {
      byType[s.type]++;
    });

    return {
      totalSessions: sessions.length,
      totalMinutes,
      byType,
    };
  },
});
