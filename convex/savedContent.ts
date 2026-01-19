import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Save content
export const save = mutation({
  args: {
    type: v.union(
      v.literal("explanation"),
      v.literal("flashcards"),
      v.literal("quiz"),
      v.literal("schedule")
    ),
    topic: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("savedContent", {
      userId,
      type: args.type,
      topic: args.topic,
      content: args.content,
      isFavorite: false,
    });
  },
});

// Toggle favorite
export const toggleFavorite = mutation({
  args: {
    contentId: v.id("savedContent"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const content = await ctx.db.get(args.contentId);
    if (!content || content.userId !== userId) {
      throw new Error("Content not found or unauthorized");
    }

    await ctx.db.patch(args.contentId, {
      isFavorite: !content.isFavorite,
    });
  },
});

// Delete saved content
export const remove = mutation({
  args: {
    contentId: v.id("savedContent"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const content = await ctx.db.get(args.contentId);
    if (!content || content.userId !== userId) {
      throw new Error("Content not found or unauthorized");
    }

    await ctx.db.delete(args.contentId);
  },
});

// Get saved content by type
export const getByType = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("explanation"),
        v.literal("flashcards"),
        v.literal("quiz"),
        v.literal("schedule")
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    if (args.type) {
      return await ctx.db
        .query("savedContent")
        .withIndex("by_user_and_type", (q) =>
          q.eq("userId", userId).eq("type", args.type!)
        )
        .order("desc")
        .take(50);
    }

    return await ctx.db
      .query("savedContent")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});

// Get favorites
export const getFavorites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("savedContent")
      .withIndex("by_user_and_favorite", (q) =>
        q.eq("userId", userId).eq("isFavorite", true)
      )
      .order("desc")
      .take(50);
  },
});
