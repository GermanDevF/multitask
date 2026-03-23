import { defineTable } from "convex/server";
import { v } from "convex/values";

export const installments = defineTable({
  userId: v.id("users"),
  loanId: v.id("loans"),
  number: v.number(), // 1..N
  dueDate: v.number(), // ms
  amountCents: v.number(),
  paidCents: v.number(),
  status: v.union(
    v.literal("PENDING"),
    v.literal("PAID"),
    v.literal("LATE"),
    v.literal("CANCELLED"),
  ),
  paidAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_loan", ["loanId"])
  .index("by_user_dueDate", ["userId", "dueDate"])
  .index("by_loan_number", ["loanId", "number"])
  .index("by_user_status_dueDate", ["userId", "status", "dueDate"]);
