import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    from: v.optional(v.number()),
    to: v.optional(v.number()),
    category: v.optional(v.string()),
    paidByName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let results = await ctx.db
      .query("expenses")
      .withIndex("by_date")
      .order("desc")
      .collect();

    if (args.from !== undefined) {
      results = results.filter((e) => e.date >= args.from!);
    }
    if (args.to !== undefined) {
      results = results.filter((e) => e.date <= args.to!);
    }
    if (args.category) {
      results = results.filter((e) => e.category === args.category);
    }
    if (args.paidByName) {
      results = results.filter((e) => e.paidByName === args.paidByName);
    }

    return results;
  },
});

export const create = mutation({
  args: {
    description: v.string(),
    amountCents: v.number(),
    currency: v.string(),
    category: v.string(),
    paidByName: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");

    if (!args.description.trim()) throw new Error("La descripción es obligatoria");
    if (args.amountCents <= 0) throw new Error("El monto debe ser mayor a cero");
    if (!args.paidByName.trim()) throw new Error("Quién pagó es obligatorio");

    const now = Date.now();
    return ctx.db.insert("expenses", {
      description: args.description.trim(),
      amountCents: args.amountCents,
      currency: args.currency,
      category: args.category.trim(),
      paidByName: args.paidByName.trim(),
      date: args.date,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");

    const expense = await ctx.db.get(args.id);
    if (!expense) throw new Error("Gasto no encontrado");

    await ctx.db.delete(args.id);
  },
});
