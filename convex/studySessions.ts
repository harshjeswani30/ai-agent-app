import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    type: v.string(),
    subject: v.string(),
    topic: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("studySessions", args);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("studySessions").take(1000);
    return {
      totalSessions: sessions.length,
      totalMinutes: sessions.length * 30, // Estimate 30 min per session
    };
  },
});