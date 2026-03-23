"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { Doc } from "../../../../convex/_generated/dataModel";
import { Actions } from "./actions";

function formatCurrency(cents: number, currency: string): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFrequency(frequency: string): string {
  const map: Record<string, string> = {
    WEEKLY: "Semanal",
    BIWEEKLY: "Quincenal",
    MONTHLY: "Mensual",
  };
  return map[frequency] || frequency;
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const map: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    ACTIVE: "default",
    PAID: "secondary",
    CANCELLED: "outline",
    DEFAULTED: "destructive",
  };
  return map[status] || "outline";
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: "Activo",
    PAID: "Pagado",
    CANCELLED: "Cancelado",
    DEFAULTED: "Vencido",
  };
  return map[status] || status;
}

function InstallmentProgress({
  paidCount,
  totalCount,
}: {
  paidCount: number;
  totalCount: number;
}) {
  const pct =
    totalCount > 0 ? Math.min(100, Math.round((paidCount / totalCount) * 100)) : 0;

  return (
    <div className="flex min-w-20 max-w-36 flex-col gap-1.5">
      <span className="text-sm tabular-nums text-foreground">
        {paidCount} / {totalCount}
      </span>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Cuotas pagadas: ${paidCount} de ${totalCount}`}>
        <div
          className="h-full rounded-full bg-primary/85 transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

type LoanWithDebtor = Doc<"loans"> & {
  debtorName?: string;
  installments?: Array<Doc<"installments">>;
};

export const columns: ColumnDef<LoanWithDebtor>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todas las filas de esta página"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Seleccionar préstamo de ${row.original.debtorName ?? "deudor"}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "debtorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deudor" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.original.debtorName?.trim() || "—"}
      </span>
    ),
  },
  {
    accessorKey: "principalCents",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto" />
    ),
    cell: ({ row }) => {
      const loan = row.original;
      return (
        <span className="font-medium tabular-nums">
          {formatCurrency(loan.principalCents, loan.currency)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={getStatusVariant(status)} className="whitespace-nowrap">
          {formatStatus(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "installmentsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cuotas" />
    ),
    meta: {
      className: "hidden md:table-cell",
    },
    cell: ({ row }) => {
      const loan = row.original;
      const paidCount =
        loan.installments?.filter((i) => i.status === "PAID").length ?? 0;
      const totalCount = loan.installmentsCount;
      return (
        <InstallmentProgress paidCount={paidCount} totalCount={totalCount} />
      );
    },
  },
  {
    accessorKey: "frequency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Frecuencia" />
    ),
    meta: {
      className: "hidden md:table-cell",
    },
    cell: ({ row }) => (
      <span className="text-sm">{formatFrequency(row.original.frequency)}</span>
    ),
  },
  {
    accessorKey: "interestRateBps",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Interés" />
    ),
    meta: {
      className: "hidden md:table-cell",
    },
    cell: ({ row }) => {
      const loan = row.original;
      if (loan.interestType === "NONE") {
        return <span className="text-sm text-muted-foreground">Sin interés</span>;
      }
      const rate = loan.interestRateBps / 100;
      return (
        <span className="text-sm tabular-nums">{rate.toFixed(2)}%</span>
      );
    },
  },
  {
    accessorKey: "firstDueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Primera cuota" />
    ),
    meta: {
      className: "hidden lg:table-cell",
    },
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">
        {formatDate(row.original.firstDueDate)}
      </span>
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inicio" />
    ),
    meta: {
      className: "hidden lg:table-cell",
    },
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {formatDate(row.original.startDate)}
      </span>
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notas" />
    ),
    meta: {
      className: "hidden lg:table-cell",
    },
    cell: ({ row }) => {
      const notes = row.original.notes;
      if (!notes?.trim()) {
        return <span className="text-sm text-muted-foreground">—</span>;
      }
      return (
        <span
          className="block max-w-48 truncate text-sm"
          title={notes}>
          {notes}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    header: () => (
      <span className="text-sm font-medium text-muted-foreground">Acciones</span>
    ),
    cell: ({ row }) => <Actions id={row.original._id} />,
  },
];
