import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const save = mutation({
  args: {
    type: v.string(),
    topic: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.insert("savedContent", {
      userId: userId,
      type: args.type,
      topic: args.topic,
      content: args.content,
      isFavorite: false,
    });
  },
});

export const getByType = query({
  args: { type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    if (args.type) {
      return await ctx.db
        .query("savedContent")
        .withIndex("by_user_and_type", (q) =>
          q.eq("userId", userId).eq("type", args.type as string)
        )
        .collect();
    }

    return await ctx.db
      .query("savedContent")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getFavorites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const allContent = await ctx.db
      .query("savedContent")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return allContent.filter((item) => item.isFavorite === true);
  },
});

export const toggleFavorite = mutation({
  args: { contentId: v.id("savedContent") },
  handler: async (ctx, args) => {
    const content = await ctx.db.get(args.contentId);
    if (!content) throw new Error("Content not found");

    await ctx.db.patch(args.contentId, {
      isFavorite: !content.isFavorite,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("savedContent") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});