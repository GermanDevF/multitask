/**
 * Lógica de dominio para cálculo de prorrateos y saldos de gastos del hogar.
 * Funciones puras sin dependencias de React ni Convex.
 */

export type Expense = {
  id: string;
  amountCents: number;
  paidBy: string;
};

export type PersonShare = {
  person: string;
  paidCents: number;
  sharePct: number;
};

export type Balance = {
  from: string;
  to: string;
  amountCents: number;
};

/**
 * Calcula cuánto pagó cada persona y su porcentaje del total.
 */
export function calculatePaidPercentages(expenses: Expense[]): PersonShare[] {
  if (!expenses.length) return [];

  const totals = new Map<string, number>();
  for (const ex of expenses) {
    totals.set(ex.paidBy, (totals.get(ex.paidBy) ?? 0) + ex.amountCents);
  }

  const totalCents = [...totals.values()].reduce((acc, v) => acc + v, 0);
  if (!totalCents) return [];

  return [...totals.entries()].map(([person, paidCents]) => ({
    person,
    paidCents,
    sharePct: (paidCents / totalCents) * 100,
  }));
}

/**
 * Calcula los saldos mínimos para que cada persona llegue al porcentaje objetivo.
 * Si no se pasa targetPercents, el objetivo es equitativo (100 / N personas).
 *
 * @param shares - Array con lo que pagó cada persona.
 * @param targetPercents - Mapa opcional persona → porcentaje objetivo (0–100). Deben sumar 100.
 */
export function calculateBalances(
  shares: PersonShare[],
  targetPercents?: Record<string, number>
): Balance[] {
  if (!shares.length) return [];

  const totalCents = shares.reduce((acc, s) => acc + s.paidCents, 0);
  if (!totalCents) return [];

  const equalPct = 100 / shares.length;

  const deltas = shares.map((s) => {
    const targetPct = targetPercents?.[s.person] ?? equalPct;
    const shouldHavePaidCents = (targetPct / 100) * totalCents;
    return {
      person: s.person,
      delta: s.paidCents - shouldHavePaidCents,
    };
  });

  const debtors = deltas
    .filter((d) => d.delta < -0.5)
    .map((d) => ({ ...d }));
  const creditors = deltas
    .filter((d) => d.delta > 0.5)
    .map((d) => ({ ...d }));

  const balances: Balance[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(-debtor.delta, creditor.delta);

    if (amount > 0.5) {
      balances.push({
        from: debtor.person,
        to: creditor.person,
        amountCents: Math.round(amount),
      });
      debtor.delta += amount;
      creditor.delta -= amount;
    }

    if (debtor.delta >= -0.5) i++;
    if (creditor.delta <= 0.5) j++;
  }

  return balances;
}

/** Formatea centavos como moneda. */
export function formatCents(cents: number, currency: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
