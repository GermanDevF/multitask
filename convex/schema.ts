import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Esquema de la base de datos de Convex.
 * Define las tablas: debtors, loans, installments y payments.
 */
export default defineSchema({
  ...authTables,
  /**
   * DEBTORS (deudores sin cuenta)
   * Pertenecen al usuario autenticado (lender).
   */
  debtors: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_fullName", ["userId", "fullName"])
    .index("by_user_phone", ["userId", "phone"]),

  /**
   * LOANS (préstamos)
   */
  loans: defineTable({
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
      v.literal("MONTHLY")
    ),

    interestType: v.union(v.literal("NONE"), v.literal("SIMPLE")),
    interestRateBps: v.number(), // 500 = 5.00% (tu regla por periodo)

    status: v.union(
      v.literal("ACTIVE"),
      v.literal("PAID"),
      v.literal("CANCELLED"),
      v.literal("DEFAULTED")
    ),

    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_debtor", ["userId", "debtorId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_debtor", ["debtorId"]),

  /**
   * INSTALLMENTS (cuotas)
   */
  installments: defineTable({
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
      v.literal("CANCELLED")
    ),

    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_loan", ["loanId"])
    .index("by_user_dueDate", ["userId", "dueDate"])
    .index("by_loan_number", ["loanId", "number"])
    .index("by_user_status_dueDate", ["userId", "status", "dueDate"]),

  /**
   * PAYMENTS (abonos)
   */
  payments: defineTable({
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
        v.literal("OTHER")
      )
    ),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_loan", ["loanId"])
    .index("by_user_paymentDate", ["userId", "paymentDate"])
    .index("by_installment", ["installmentId"]),
});
