import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    type: v.string(),
    subject: v.string(),
    topic: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.insert("studySessions", {
      userId: userId,
      type: args.type,
      subject: args.subject,
      topic: args.topic,
      notes: args.notes || "",
    });
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { totalSessions: 0, totalMinutes: 0 };

    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      totalSessions: sessions.length,
      totalMinutes: sessions.length * 30, // Estimate 30 min per session
    };
  },
});