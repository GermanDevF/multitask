import { defineTable } from "convex/server";
import { v } from "convex/values";

export const payments = defineTable({
  userId: v.id("users"),
  loanId: v.id("loans"),
  installmentId: v.optional(v.id("installments")),
  amountCents: v.number(),
  paymentDate: v.number(),
  method: v.optional(
    v.union(
      v.literal("CASH"),
      v.literal("TRANSFER"),
      v.literal("CARD"),
      v.literal("OTHER"),
    ),
  ),
  reference: v.optional(v.string()),
  notes: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_loan", ["loanId"])
  .index("by_user_paymentDate", ["userId", "paymentDate"])
  .index("by_installment", ["installmentId"]);
