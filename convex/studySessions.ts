import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Update session duration and status
export const updateSession = mutation({
  args: {
    sessionId: v.id("studySessions"),
    duration: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"), v.literal("paused"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== user._id) {
      throw new Error("Session not found or unauthorized");
    }

    await ctx.db.patch(args.sessionId, {
      ...(args.duration !== undefined && { duration: args.duration }),
      ...(args.status && { status: args.status }),
      ...(args.notes && { notes: args.notes }),
    });

    return args.sessionId;
  },
});

// Get user's study sessions
export const getUserSessions = query({
  args: {
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || !user._id) {
      return [];
    }

    let query = ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id as string))
      .order("desc");

    if (args.subject) {
      const subject = args.subject; // TypeScript needs this
      query = ctx.db
        .query("studySessions")
        .withIndex("by_user_and_subject", (q) =>
          q.eq("userId", user._id!).eq("subject", subject)
        )
        .order("desc");
    }

    const sessions = await query.take(50);
    return sessions;
  },
});

// Get active session
export const getActiveSession = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return null;
    }

    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id!))
      .order("desc")
      .take(10);

    return sessions.find((s) => s.status === "active") || null;
  },
});

// Simplified create for tabs (creates and completes immediately)
export const create = mutation({
  args: {
    topic: v.string(),
    type: v.union(v.literal("explanation"), v.literal("flashcards"), v.literal("quiz"), v.literal("schedule")),
    subject: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || !user._id) {
      throw new Error("Unauthorized");
    }

    const sessionId = await ctx.db.insert("studySessions", {
      userId: user._id as string,
      subject: args.subject || "General",
      topic: args.topic,
      duration: 0,
      notes: args.notes,
      status: "completed" as const,
    });

    return sessionId;
  },
});

// Get study statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
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
      .withIndex("by_user", (q) => q.eq("userId", user._id!))
      .collect();

    const totalMinutes = sessions.reduce(
      (sum, s) => sum + (s.duration ?? 0),
      0
    );

    return {
      totalSessions: sessions.length,
      totalMinutes,
      byType: {
        explanation: 0,
        flashcards: 0,
        quiz: 0,
        schedule: 0,
      },
    };
  },
});
