"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { StatTile } from "./stat-tile";
import type { LoanInstallmentStats } from "./types";

type LoanStatsGridProps = {
  stats: LoanInstallmentStats;
};

export function LoanStatsGrid({ stats }: LoanStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatTile label="Cuotas" value={stats.total} icon={Calendar} />
      <StatTile
        label="Pagadas"
        value={stats.paid}
        icon={CheckCircle2}
        valueClassName="text-emerald-600 dark:text-emerald-400"
      />
      <StatTile
        label="Pendientes"
        value={stats.pending}
        icon={Clock}
        valueClassName="text-amber-600 dark:text-amber-400"
      />
      <StatTile
        label="Vencidas"
        value={stats.late}
        icon={AlertCircle}
        valueClassName="text-red-600 dark:text-red-400"
      />
    </div>
  );
}
