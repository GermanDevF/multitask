import { mutation, query } from "./_generated/server";
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

    // Reparto exacto en centavos con redondeo a cada installment
    const baseAmountPerInstallment =
      args.principalCents / args.installmentsCount;
    const roundedBase = Math.round(baseAmountPerInstallment);
    const totalFromRounded = roundedBase * args.installmentsCount;
    const difference = args.principalCents - totalFromRounded;

    const firstDue = new Date(args.firstDueDate);

    for (let i = 0; i < args.installmentsCount; i++) {
      // Aplicar redondeo y ajustar diferencia en los primeros installments
      const adjustment =
        i < Math.abs(difference) ? (difference > 0 ? 1 : -1) : 0;
      const amount = Math.round(roundedBase + adjustment);
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

export const updateLoan = mutation({
  args: {
    loanId: v.id("loans"),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");

    const loan = await ctx.db.get(args.loanId);

    if (!loan) throw new Error("Préstamo no encontrado");

    if (loan.userId !== userId) throw new Error("Prohibido");

    await ctx.db.patch(args.loanId, {
      principalCents: args.principalCents,
      currency: args.currency,
      startDate: args.startDate,
      firstDueDate: args.firstDueDate,
      installmentsCount: args.installmentsCount,
      frequency: args.frequency,
    });

    return await ctx.db.get(args.loanId);
  },
});

export const deleteLoan = mutation({
  args: {
    loanId: v.id("loans"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");
    const loan = await ctx.db.get(args.loanId);
    if (!loan) throw new Error("Préstamo no encontrado");
    if (loan.userId !== userId) throw new Error("Prohibido");

    const installments = await ctx.db
      .query("installments")
      .withIndex("by_loan", (q) => q.eq("loanId", args.loanId))
      .collect();
    if (installments.length > 0) {
      for (const installment of installments) {
        await ctx.db.delete(installment._id);
      }
    }

    return await ctx.db.delete(args.loanId);
  },
});

export const getLoan = query({
  args: {
    loanId: v.id("loans"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");

    const loan = await ctx.db.get(args.loanId);
    if (!loan) throw new Error("Préstamo no encontrado");

    if (loan.userId !== userId) throw new Error("Prohibido");

    const installments = await ctx.db
      .query("installments")
      .withIndex("by_loan", (q) => q.eq("loanId", args.loanId))
      .collect();
    return { loan, installments };
  },
});

export const registerPayment = mutation({
  args: {
    loanId: v.id("loans"),
    installmentId: v.id("installments"),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sin autorización");

    const now = Date.now();

    // Validar que el préstamo existe y pertenece al usuario
    const loan = await ctx.db.get(args.loanId);
    if (!loan) throw new Error("Préstamo no encontrado");
    if (loan.userId !== userId) throw new Error("Prohibido");

    // Validar que el installment existe y pertenece al préstamo
    const installment = await ctx.db.get(args.installmentId);
    if (!installment) throw new Error("Cuota no encontrada");
    if (installment.loanId !== args.loanId)
      throw new Error("Cuota no pertenece al préstamo");
    if (installment.userId !== userId) throw new Error("Prohibido");

    // Validar que el monto no exceda lo pendiente
    const remaining = installment.amountCents - installment.paidCents;
    if (args.amountCents > remaining) {
      throw new Error(
        `El monto excede lo pendiente. Pendiente: ${remaining / 100} ${loan.currency}`
      );
    }

    // Registrar el pago
    await ctx.db.insert("payments", {
      userId,
      loanId: args.loanId,
      installmentId: args.installmentId,
      amountCents: args.amountCents,
      paymentDate: args.paymentDate,
      method: args.method,
      reference: args.reference,
      notes: args.notes,
      createdAt: now,
    });

    // Actualizar el installment
    const newPaidCents = installment.paidCents + args.amountCents;
    const isFullyPaid = newPaidCents >= installment.amountCents;
    const newStatus = isFullyPaid ? "PAID" : installment.status;

    await ctx.db.patch(args.installmentId, {
      paidCents: newPaidCents,
      status: newStatus,
      paidAt:
        isFullyPaid && !installment.paidAt
          ? args.paymentDate
          : installment.paidAt,
      updatedAt: now,
    });

    // Verificar si todos los installments están pagados para actualizar el estado del préstamo
    const allInstallments = await ctx.db
      .query("installments")
      .withIndex("by_loan", (q) => q.eq("loanId", args.loanId))
      .collect();

    const allPaid = allInstallments.every(
      (inst) => inst.paidCents >= inst.amountCents
    );

    if (allPaid && loan.status === "ACTIVE") {
      await ctx.db.patch(args.loanId, {
        status: "PAID",
        updatedAt: now,
      });
    }

    return await ctx.db.get(args.installmentId);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const loans = await ctx.db
      .query("loans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const installments = await ctx.db
      .query("installments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const loansWithInstallments = await Promise.all(
      loans.map(async (loan) => {
        const debtor = await ctx.db.get(loan.debtorId);
        return {
          ...loan,
          debtorName: debtor?.fullName || "Desconocido",
          installments: installments.filter((i) => i.loanId === loan._id),
        };
      })
    );

    return loansWithInstallments;
  },
});

export const getInstallmentsDashboard = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      return {
        activeLoansCount: 0,
        totalPendingAmount: 0,
        monthlyExpectedAmount: 0,
        overdueCount: 0,
        overdueAmount: 0,
        upcomingCount: 0,
        upcomingAmount: 0,
        totalLent: 0,
        totalRecovered: 0,
        totalToReceive: 0,
        activeDebtorsCount: 0,
        nextDueDate: null,
        installmentsByStatus: {
          pending: 0,
          paid: 0,
          late: 0,
          cancelled: 0,
        },
      };

    const now = Date.now();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const startOfMonthMs = startOfMonth.getTime();

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const endOfMonthMs = endOfMonth.getTime();

    const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

    // Obtener todos los préstamos activos
    const activeLoans = await ctx.db
      .query("loans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "ACTIVE"))
      .collect();

    // Obtener todos los installments
    const allInstallments = await ctx.db
      .query("installments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Obtener todos los préstamos para calcular totales
    const allLoans = await ctx.db
      .query("loans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Calcular estadísticas
    let totalPendingAmount = 0;
    let monthlyExpectedAmount = 0;
    let overdueCount = 0;
    let overdueAmount = 0;
    let upcomingCount = 0;
    let upcomingAmount = 0;
    let totalLent = 0;
    let totalRecovered = 0;
    let nextDueDate: number | null = null;
    const installmentsByStatus = {
      pending: 0,
      paid: 0,
      late: 0,
      cancelled: 0,
    };

    const activeDebtorIds = new Set<string>();

    for (const installment of allInstallments) {
      const remaining = installment.amountCents - installment.paidCents;
      const isPending = installment.status === "PENDING";
      const isPaid = installment.status === "PAID";
      const isLate = installment.status === "LATE";
      const isOverdue = isPending && installment.dueDate < now;

      // Contar por estado
      if (isPending) installmentsByStatus.pending++;
      if (isPaid) installmentsByStatus.paid++;
      if (isLate) installmentsByStatus.late++;
      if (installment.status === "CANCELLED") installmentsByStatus.cancelled++;

      // Monto total pendiente
      if (remaining > 0) {
        totalPendingAmount += remaining;
      }

      // Monto a recibir este mes (installments pendientes que vencen este mes)
      if (
        isPending &&
        installment.dueDate >= startOfMonthMs &&
        installment.dueDate <= endOfMonthMs
      ) {
        monthlyExpectedAmount += remaining;
      }

      // Cuotas vencidas
      if (isOverdue || isLate) {
        overdueCount++;
        overdueAmount += remaining;
      }

      // Próximas cuotas (próximos 7 días)
      if (
        isPending &&
        installment.dueDate >= now &&
        installment.dueDate <= sevenDaysFromNow
      ) {
        upcomingCount++;
        upcomingAmount += remaining;
      }

      // Total recuperado
      if (installment.paidCents > 0) {
        totalRecovered += installment.paidCents;
      }

      // Encontrar la próxima fecha de vencimiento
      if (
        isPending &&
        installment.dueDate >= now &&
        (nextDueDate === null || installment.dueDate < nextDueDate)
      ) {
        nextDueDate = installment.dueDate;
      }

      // Agregar deudor activo si tiene installments pendientes
      if (remaining > 0) {
        const loan = allLoans.find((l) => l._id === installment.loanId);
        if (loan && loan.status === "ACTIVE") {
          activeDebtorIds.add(loan.debtorId);
        }
      }
    }

    // Calcular total prestado (suma de principalCents de todos los préstamos activos)
    for (const loan of activeLoans) {
      totalLent += loan.principalCents;
    }

    // Total a recibir = total pendiente
    const totalToReceive = totalPendingAmount;

    return {
      activeLoansCount: activeLoans.length,
      totalPendingAmount,
      monthlyExpectedAmount,
      overdueCount,
      overdueAmount,
      upcomingCount,
      upcomingAmount,
      totalLent,
      totalRecovered,
      totalToReceive,
      activeDebtorsCount: activeDebtorIds.size,
      nextDueDate,
      installmentsByStatus,
    };
  },
});
