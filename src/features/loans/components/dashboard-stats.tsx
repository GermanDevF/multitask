"use client";

import {
  AlertTriangle,
  Calendar,
  CreditCard,
  DollarSign,
  HandCoins,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetDashboard } from "../api/use-get-dashboard";

// Función para formatear moneda
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

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  variant?: "default" | "success" | "warning" | "danger";
  description?: string;
};

function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  description,
}: StatCardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-green-200 dark:border-green-900",
    warning: "border-yellow-200 dark:border-yellow-900",
    danger: "border-red-200 dark:border-red-900",
  };

  const iconStyles = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  };

  return (
    <Card className={variantStyles[variant]}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconStyles[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { data, isLoading } = useGetDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
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
    );
  }

  if (!data) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Alertas y próximos vencimientos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          className={
            data.overdueCount > 0 ? "border-red-200 dark:border-red-900" : ""
          }>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cuotas vencidas
            </CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${
                data.overdueCount > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overdueCount > 0 ? (
                <span className="text-red-600 dark:text-red-400">
                  {data.overdueCount}
                </span>
              ) : (
                data.overdueCount
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(data.overdueAmount)} pendientes
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            data.upcomingCount > 0
              ? "border-yellow-200 dark:border-yellow-900"
              : ""
          }>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Próximos 7 días
            </CardTitle>
            <Calendar
              className={`h-4 w-4 ${
                data.upcomingCount > 0
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.upcomingCount > 0 ? (
                <span className="text-yellow-600 dark:text-yellow-400">
                  {data.upcomingCount}
                </span>
              ) : (
                data.upcomingCount
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(data.upcomingAmount)} a recibir
            </p>
            {data.nextDueDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Próxima: {formatDate(data.nextDueDate)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estado de cuotas
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total prestado
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalLent)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              En {data.activeLoansCount} préstamos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total recuperado
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.totalRecovered)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.totalLent > 0
                ? `${Math.round((data.totalRecovered / data.totalLent) * 100)}% del total`
                : "0% del total"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Por recuperar
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatCurrency(data.totalToReceive)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.totalPendingAmount > 0
                ? `${data.installmentsByStatus.pending + data.installmentsByStatus.late} cuotas pendientes`
                : "Todo al día"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
