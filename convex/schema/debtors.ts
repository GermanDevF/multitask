import { defineTable } from "convex/server";
import { v } from "convex/values";

export const debtors = defineTable({
  userId: v.id("users"),
  fullName: v.string(),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  notes: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_fullName", ["userId", "fullName"])
  .index("by_user_phone", ["userId", "phone"]);
