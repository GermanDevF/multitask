import { defineTable } from "convex/server";
import { v } from "convex/values";

export const expenses = defineTable({
  description: v.string(),
  amountCents: v.number(),
  currency: v.string(), // "MXN" / "USD", igual que loans
  category: v.string(), // FOOD, RENT, UTILITIES, OTHER, etc.
  paidByName: v.string(), // o paidByUserId: v.id("users") si ya tienes usuarios
  date: v.number(), // timestamp en ms
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_date", ["date"])
  .index("by_paidBy", ["paidByName"]);
