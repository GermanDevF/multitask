import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("debtors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("debtors") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    fullName: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");

    const now = Date.now();

    const debtorId = await ctx.db.insert("debtors", {
      userId,
      fullName: args.fullName,
      phone: args.phone,
      email: args.email,
      notes: args.notes,
      createdAt: now,
    });

    return await ctx.db.get(debtorId);
  },
});

export const update = mutation({
  args: {
    id: v.id("debtors"),
    fullName: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");

    const debtor = await ctx.db.get(args.id);
    if (!debtor) throw new Error("Deudor no encontrado");
    if (debtor.userId !== userId) throw new Error("Prohibido");

    return await ctx.db.patch(args.id, {
      fullName: args.fullName,
      phone: args.phone,
      email: args.email,
      notes: args.notes,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("debtors") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");

    return await ctx.db.delete(args.id);
  },
});
