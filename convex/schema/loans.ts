import { defineTable } from "convex/server";
import { v } from "convex/values";

export const loans = defineTable({
  userId: v.id("users"),
  debtorId: v.id("debtors"),
  principalCents: v.number(),
  currency: v.string(), // "MXN"
  startDate: v.number(), // ms
  firstDueDate: v.number(), // ms
  installmentsCount: v.number(),
  frequency: v.union(
    v.literal("WEEKLY"),
    v.literal("BIWEEKLY"),
    v.literal("MONTHLY"),
  ),
  interestType: v.union(v.literal("NONE"), v.literal("SIMPLE")),
  interestRateBps: v.number(), // 500 = 5.00% (tu regla por periodo)
  status: v.union(
    v.literal("ACTIVE"),
    v.literal("PAID"),
    v.literal("CANCELLED"),
    v.literal("DEFAULTED"),
  ),
  notes: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_debtor", ["userId", "debtorId"])
  .index("by_user_status", ["userId", "status"])
  .index("by_debtor", ["debtorId"]);
