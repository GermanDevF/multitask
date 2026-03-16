"use client";
import { useMemo } from "react";
import {
  // ArrowRight,
  PlusIcon,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetExpenses } from "../api/use-get-expenses";
import { useNewExpense } from "../hooks/use-new-expense";
import {
  calculateBalances,
  calculatePaidPercentages,
  formatCents,
} from "../domain/calc";
import { NewExpenseDialog } from "./new-expense-dialog";
import { expenseColumns } from "./expenses-columns";

function formatCurrency(cents: number, currency = "MXN") {
  return formatCents(cents, currency);
}

export function ExpensesDashboard() {
  const { expenses, isLoading } = useGetExpenses();
  const newExpense = useNewExpense();

  const domainExpenses = useMemo(
    () =>
      expenses.map((e) => ({
        id: e._id,
        amountCents: e.amountCents,
        paidBy: e.paidByName,
      })),
    [ expenses ]
  );

  const personShares = useMemo(
    () => calculatePaidPercentages(domainExpenses),
    [ domainExpenses ]
  );

  const balances = useMemo(
    () => calculateBalances(personShares),
    [ personShares ]
  );

  const totalCents = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amountCents, 0),
    [ expenses ]
  );

  const currency = expenses[ 0 ]?.currency ?? "MXN";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gastos del Hogar</h2>
          <p className="text-sm text-muted-foreground">
            Registro y prorrateo de gastos compartidos
          </p>
        </div>
        <Button
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => newExpense.onOpen()}>
          <PlusIcon className="size-4" />
          Nuevo gasto
        </Button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total gastado
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCents, currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length} gastos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personShares.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Con gastos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gastos este mes
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                expenses.filter((e) => {
                  const now = new Date();
                  const d = new Date(e.date);
                  return (
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              En {new Date().toLocaleString("es-MX", { month: "long" })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Porcentajes pagados */}
      {personShares.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-muted-foreground" />
              Prorrateo pagado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {personShares.map((s) => (
                <div
                  key={s.person}
                  className="flex flex-col items-start gap-1 rounded-lg border p-3">
                  <span className="text-sm font-medium">{s.person}</span>
                  <span className="text-2xl font-bold">
                    {s.sharePct.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(s.paidCents, currency)}
                  </span>
                  {/* Barra de progreso */}
                  <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{ width: `${Math.min(100, s.sharePct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saldos */}
      {/* {balances.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowRight className="size-4 text-muted-foreground" />
              Saldos (para quedar 50/50)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {balances.map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start gap-1 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/40 dark:bg-yellow-950/20 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{b.from}</Badge>
                    <span className="text-muted-foreground">le debe a</span>
                    <Badge variant="outline">{b.to}</Badge>
                  </div>
                  <span className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm">
                    {formatCurrency(b.amountCents, currency)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}

      {balances.length === 0 && personShares.length > 1 && (
        <Card className="border-green-200 dark:border-green-900">
          <CardContent className="py-4">
            <p className="text-sm text-green-700 dark:text-green-400 text-center font-medium">
              ¡Están al día! Los gastos están equilibrados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tabla de historial */}
      <div>
        <h3 className="text-base font-semibold mb-3">Historial de gastos</h3>
        <div className="overflow-x-auto">
          <DataTable
            columns={expenseColumns}
            data={expenses}
            loading={isLoading}
            onEdit={() => { }}
          />
        </div>
      </div>

      <NewExpenseDialog />
    </div>
  );
}
