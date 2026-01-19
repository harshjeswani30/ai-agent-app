import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    type: v.string(),
    topic: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("savedContent", {
      ...args,
      isFavorite: false,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("savedContent").order("desc").take(100);
  },
});

export const getByType = query({
  args: {
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.type) {
      return await ctx.db.query("savedContent").order("desc").take(100);
    }
    const allContent = await ctx.db.query("savedContent").take(1000);
    return allContent.filter(item => item.type === args.type);
  },
});

export const getFavorites = query({
  args: {},
  handler: async (ctx) => {
    const allContent = await ctx.db.query("savedContent").take(1000);
    return allContent.filter(item => item.isFavorite === true);
  },
});

export const toggleFavorite = mutation({
  args: {
    contentId: v.id("savedContent"),
  },
  handler: async (ctx, args) => {
    const content = await ctx.db.get(args.contentId);
    if (!content) throw new Error("Content not found");
    
    await ctx.db.patch(args.contentId, {
      isFavorite: !content.isFavorite,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("savedContent"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});