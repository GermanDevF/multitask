import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function nextDueDate(
  base: Date,
  i: number,
  frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY"
) {
  if (frequency === "WEEKLY") return addDays(base, 7 * i);
  if (frequency === "BIWEEKLY") return addDays(base, 14 * i);
  return addMonths(base, i);
}

export const createLoanWithInstallments = mutation({
  args: {
    debtorId: v.id("debtors"),
    principalCents: v.number(),
    currency: v.string(),
    startDate: v.number(),
    firstDueDate: v.number(),
    installmentsCount: v.number(),
    frequency: v.union(
      v.literal("WEEKLY"),
      v.literal("BIWEEKLY"),
      v.literal("MONTHLY")
    ),
    interestType: v.union(v.literal("NONE"), v.literal("SIMPLE")),
    interestRateBps: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");

    const now = Date.now();

    // Validar que el debtor sea del user actual
    const debtor = await ctx.db.get(args.debtorId);
    if (!debtor) throw new Error("Deudor no encontrado");
    if (debtor.userId !== userId) throw new Error("Prohibido");

    const loanId = await ctx.db.insert("loans", {
      userId,
      debtorId: args.debtorId,
      principalCents: args.principalCents,
      currency: args.currency,
      startDate: args.startDate,
      firstDueDate: args.firstDueDate,
      installmentsCount: args.installmentsCount,
      frequency: args.frequency,
      interestType: args.interestType,
      interestRateBps: args.interestRateBps,
      status: "ACTIVE",
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // Reparto exacto en centavos
    const base = Math.floor(args.principalCents / args.installmentsCount);
    const remainder = args.principalCents - base * args.installmentsCount;

    const firstDue = new Date(args.firstDueDate);

    for (let i = 0; i < args.installmentsCount; i++) {
      const amount = base + (i < remainder ? 1 : 0);
      const due = nextDueDate(firstDue, i, args.frequency);

      await ctx.db.insert("installments", {
        userId,
        loanId,
        number: i + 1,
        dueDate: due.getTime(),
        amountCents: amount,
        paidCents: 0,
        status: "PENDING",
        createdAt: now,
        updatedAt: now,
      });
    }

    return await ctx.db.get(loanId);
  },
});
