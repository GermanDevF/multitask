"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useGetExpenses } from "@/features/expenses/api/use-get-expenses";
import {
  calculateBalances,
  calculatePaidPercentages,
  formatCents,
} from "@/features/expenses/domain/calc";
import { ExpensesBarChart } from "@/features/loans/components/expenses-bar-chart";
import { StatCard } from "@/features/loans/components/stat-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CreditCard,
  DollarSign,
  HandCoins,
  ShoppingBasket,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useGetDashboard } from "../api/use-get-dashboard";

// Función para formatear moneda (MXN por defecto, consistente con loans)
function formatCurrency(cents: number): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Función para formatear fecha
function formatDate(timestamp: number | null): string {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DashboardStats() {
  const { data, isLoading } = useGetDashboard();
  const { expenses, isLoading: expensesLoading } = useGetExpenses();

  const domainExpenses = useMemo(
    () =>
      (expenses ?? []).map((e) => ({
        id: e._id,
        amountCents: e.amountCents,
        paidBy: e.paidByName,
      })),
    [ expenses ],
  );

  const personShares = useMemo(
    () => calculatePaidPercentages(domainExpenses),
    [ domainExpenses ],
  );

  const balances = useMemo(
    () => calculateBalances(personShares),
    [ personShares ],
  );

  const totalExpensesCents = useMemo(
    () => (expenses ?? []).reduce((sum, e) => sum + e.amountCents, 0),
    [ expenses ],
  );

  const thisMonthExpensesCents = useMemo(() => {
    const now = new Date();
    return (expenses ?? [])
      .filter((e) => {
        const d = new Date(e.date);
        return (
          d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amountCents, 0);
  }, [ expenses ]);

  const expensesCurrency = expenses && expenses.length > 0
    ? expenses[ 0 ].currency
    : "MXN";

  const monthlyExpenses = useMemo(() => {
    const list = expenses ?? [];
    if (!list.length) return [];

    const byMonth = new Map<
      string,
      { totalCents: number; byPerson: Record<string, number> }
    >();

    for (const e of list) {
      const d = new Date(e.date);
      const year = d.getFullYear();
      const month = d.getMonth();
      const key = `${year}-${month}`;
      const current = byMonth.get(key);
      const totalCents = (current?.totalCents ?? 0) + e.amountCents;
      const byPerson = { ...(current?.byPerson ?? {}) };
      byPerson[ e.paidByName ] = (byPerson[ e.paidByName ] ?? 0) + e.amountCents;
      byMonth.set(key, { totalCents, byPerson });
    }

    const entries = [ ...byMonth.entries() ]
      .map(([ key, { totalCents, byPerson } ]) => {
        const [ y, m ] = key.split("-").map(Number);
        const label = new Date(y, m, 1).toLocaleDateString("es-MX", {
          month: "short",
          year: "numeric",
        });
        return { label, year: y, month: m, totalCents, byPerson };
      })
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);

    const last = 6;
    return entries.slice(-last);
  }, [ expenses ]);

  if (isLoading || expensesLoading) {
    return (
      <div className="space-y-8" role="status" aria-label="Cargando panel">
        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2 pt-4 sm:pt-6">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="pb-4 sm:pb-6">
                  <Skeleton className="h-8 w-28 animate-pulse" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2 pt-4 sm:pt-6">
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent className="pb-4 sm:pb-6">
                  <Skeleton className="h-8 w-24 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2 pt-4 sm:pt-6">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="pb-4 sm:pb-6">
                  <Skeleton className="h-8 w-20 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No hay datos disponibles
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Crea deudores y préstamos para ver el resumen aquí.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8" role="region" aria-label="Panel de resumen">
      {/* Préstamos */}
      <section aria-labelledby="dashboard-prestamos-heading" className="space-y-4">
        <h2
          id="dashboard-prestamos-heading"
          className="text-lg font-semibold tracking-tight text-foreground">
          Préstamos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Préstamos activos"
          value={data.activeLoansCount.toString()}
          icon={HandCoins}
          variant="default"
          description={`${data.activeDebtorsCount} deudores activos`}
        />
        <StatCard
          label="Pendiente por recibir"
          value={formatCurrency(data.totalPendingAmount)}
          icon={DollarSign}
          variant="warning"
          description="Total de cuotas pendientes"
        />
        <StatCard
          label="Este mes"
          value={formatCurrency(data.monthlyExpectedAmount)}
          icon={Calendar}
          variant="success"
          description="Cuotas que vencen este mes"
        />
        <StatCard
          label="Total recuperado"
          value={formatCurrency(data.totalRecovered)}
          icon={TrendingUp}
          variant="success"
          description={`De ${formatCurrency(data.totalLent)} prestados`}
        />
      </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
            className={cn(
              "transition-colors",
              data.overdueCount > 0 && "border-red-200 dark:border-red-900",
            )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 sm:pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cuotas vencidas
            </CardTitle>
            <AlertTriangle
                className={cn(
                  "h-4 w-4 shrink-0",
                data.overdueCount > 0
                  ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground",
                )}
            />
          </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="text-xl font-bold tabular-nums sm:text-2xl">
              {data.overdueCount > 0 ? (
                <span className="text-red-600 dark:text-red-400">
                  {data.overdueCount}
                </span>
              ) : (
                data.overdueCount
              )}
            </div>
              <p className="mt-1 text-xs text-muted-foreground">
              {formatCurrency(data.overdueAmount)} pendientes
            </p>
          </CardContent>
        </Card>

        <Card
            className={cn(
              "transition-colors",
              data.upcomingCount > 0 && "border-yellow-200 dark:border-yellow-900",
            )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 sm:pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Próximos 7 días
            </CardTitle>
            <Calendar
                className={cn(
                  "h-4 w-4 shrink-0",
                data.upcomingCount > 0
                  ? "text-yellow-600 dark:text-yellow-400"
                    : "text-muted-foreground",
                )}
            />
          </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="text-xl font-bold tabular-nums sm:text-2xl">
              {data.upcomingCount > 0 ? (
                <span className="text-yellow-600 dark:text-yellow-400">
                  {data.upcomingCount}
                </span>
              ) : (
                data.upcomingCount
              )}
            </div>
              <p className="mt-1 text-xs text-muted-foreground">
              {formatCurrency(data.upcomingAmount)} a recibir
            </p>
            {data.nextDueDate && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                Próxima: {formatDate(data.nextDueDate)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 sm:pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estado de cuotas
            </CardTitle>
              <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Pendientes
                </span>
                <Badge variant="outline">
                  {data.installmentsByStatus.pending}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pagadas</span>
                <Badge variant="default" className="bg-green-600">
                  {data.installmentsByStatus.paid}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vencidas</span>
                <Badge variant="destructive">
                  {data.installmentsByStatus.late}
                </Badge>
              </div>
              {data.installmentsByStatus.cancelled > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Canceladas
                  </span>
                  <Badge variant="secondary">
                    {data.installmentsByStatus.cancelled}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Resumen financiero */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Card className="transition-colors hover:border-muted-foreground/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 sm:pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total prestado
            </CardTitle>
              <TrendingUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="text-xl font-bold tabular-nums sm:text-2xl">
              {formatCurrency(data.totalLent)}
            </div>
              <p className="mt-1 text-xs text-muted-foreground">
              En {data.activeLoansCount} préstamos activos
            </p>
          </CardContent>
        </Card>

          <Card className="transition-colors hover:border-muted-foreground/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 sm:pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total recuperado
            </CardTitle>
              <TrendingUp className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
          </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="text-xl font-bold tabular-nums text-green-600 dark:text-green-400 sm:text-2xl">
              {formatCurrency(data.totalRecovered)}
            </div>
              <p className="mt-1 text-xs text-muted-foreground">
              {data.totalLent > 0
                ? `${Math.round((data.totalRecovered / data.totalLent) * 100)}% del total`
                : "0% del total"}
            </p>
          </CardContent>
        </Card>

          <Card className="transition-colors hover:border-muted-foreground/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 sm:pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Por recuperar
            </CardTitle>
              <TrendingDown className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="text-xl font-bold tabular-nums text-yellow-600 dark:text-yellow-400 sm:text-2xl">
              {formatCurrency(data.totalToReceive)}
            </div>
              <p className="mt-1 text-xs text-muted-foreground">
              {data.totalPendingAmount > 0
                ? `${data.installmentsByStatus.pending + data.installmentsByStatus.late} cuotas pendientes`
                : "Todo al día"}
            </p>
          </CardContent>
        </Card>
      </div>
      </section>

      <Separator className="my-6" />

      {/* Gastos del hogar */}
      <section
        aria-labelledby="dashboard-gastos-heading"
        className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h2
              id="dashboard-gastos-heading"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
              <ShoppingBasket className="size-4 text-muted-foreground" />
              Gastos del hogar
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Resumen de gastos compartidos.
            </p>
          </div>
          <Link
            href="/expenses"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm">
            Ver todos
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {(expenses?.length ?? 0) === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <ShoppingBasket className="size-10 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Sin gastos registrados
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Registra gastos en la sección Gastos del hogar para ver el resumen aquí.
              </p>
              <Link
                href="/expenses"
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Ir a Gastos
                <ArrowRight className="size-3.5" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <StatCard
                label="Total gastado"
                value={formatCents(totalExpensesCents, expensesCurrency)}
                icon={ShoppingBasket}
                variant="default"
                description={`${expenses?.length ?? 0} gastos registrados`}
              />
              <StatCard
                label="Este mes"
                value={formatCents(thisMonthExpensesCents, expensesCurrency)}
                icon={Calendar}
                variant="warning"
                description="Gastos del mes en curso"
              />
              <StatCard
                label="Personas con gastos"
                value={personShares.length.toString()}
                icon={Users}
                variant="success"
                description="Personas que han registrado pagos"
              />
            </div>

            {monthlyExpenses.length > 0 && (
              <ExpensesBarChart
                data={monthlyExpenses}
                currency={expensesCurrency}
              />
            )}

            {personShares.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Prorrateo por persona
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {personShares.map((s) => (
                      <div
                        key={s.person}
                        className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                        <span className="text-sm font-medium">{s.person}</span>
                        <span className="text-2xl font-bold tabular-nums">
                          {s.sharePct.toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatCents(s.paidCents, expensesCurrency)}
                        </span>
                        <div className="mt-0.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-[width] duration-300"
                            style={{ width: `${Math.min(100, s.sharePct)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}


            {balances.length === 0 && personShares.length > 1 && (
              <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                <CardContent className="py-4 text-center">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Los gastos entre personas están equilibrados.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>
    </div>
  );
}
