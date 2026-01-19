import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

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
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("savedContent", {
      userId: user._id!,
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
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const content = await ctx.db.get(args.contentId);
    if (!content || content.userId !== user._id) {
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
    id: v.id("savedContent"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const content = await ctx.db.get(args.id);
    if (!content || content.userId !== user._id) {
      throw new Error("Content not found or unauthorized");
    }

    await ctx.db.delete(args.id);
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
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    if (args.type) {
      return await ctx.db
        .query("savedContent")
        .withIndex("by_user_and_type", (q) =>
          q.eq("userId", user._id!).eq("type", args.type!)
        )
        .order("desc")
        .take(50);
    }

    return await ctx.db
      .query("savedContent")
      .withIndex("by_user", (q) => q.eq("userId", user._id!))
      .order("desc")
      .take(50);
  },
});

// Get all saved content
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("savedContent")
      .withIndex("by_user", (q) => q.eq("userId", user._id!))
      .order("desc")
      .collect();
  },
});

// Get favorites
export const getFavorites = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("savedContent")
      .withIndex("by_user", (q) => q.eq("userId", user._id!))
      .order("desc")
      .collect();
  },
});
