"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { Doc } from "../../../../convex/_generated/dataModel";
import { Actions } from "./actions";

// Función para formatear moneda
function formatCurrency(cents: number, currency: string): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Función para formatear fecha
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Función para formatear frecuencia
function formatFrequency(frequency: string): string {
  const map: Record<string, string> = {
    WEEKLY: "Semanal",
    BIWEEKLY: "Quincenal",
    MONTHLY: "Mensual",
  };
  return map[frequency] || frequency;
}

// Función para obtener el color del badge según el estado
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

// Función para traducir el estado
function formatStatus(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: "Activo",
    PAID: "Pagado",
    CANCELLED: "Cancelado",
    DEFAULTED: "Vencido",
  };
  return map[status] || status;
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
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Estado" />;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>
      );
    },
  },
  {
    accessorKey: "debtorName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Deudor" />;
    },
    cell: ({ row }) => {
      return (
        <span className="font-medium">{row.original.debtorName || "-"}</span>
      );
    },
  },
  {
    accessorKey: "principalCents",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Monto" />;
    },
    cell: ({ row }) => {
      const loan = row.original;
      return (
        <span className="font-medium">
          {formatCurrency(loan.principalCents, loan.currency)}
        </span>
      );
    },
  },
  {
    accessorKey: "installmentsCount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Cuotas" />;
    },
    cell: ({ row }) => {
      const loan = row.original;
      const paidCount =
        loan.installments?.filter((i) => i.status === "PAID").length || 0;
      const totalCount = loan.installmentsCount;
      return (
        <span className="text-sm">
          {paidCount} / {totalCount}
        </span>
      );
    },
  },
  {
    accessorKey: "frequency",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Frecuencia" />;
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm">
          {formatFrequency(row.original.frequency)}
        </span>
      );
    },
  },
  {
    accessorKey: "interestRateBps",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tasa de interés" />;
    },
    cell: ({ row }) => {
      const loan = row.original;
      if (loan.interestType === "NONE") {
        return <span className="text-sm text-muted-foreground">-</span>;
      }
      const rate = loan.interestRateBps / 100;
      return <span className="text-sm">{rate.toFixed(2)}%</span>;
    },
  },
  {
    accessorKey: "firstDueDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Primera cuota" />;
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm">{formatDate(row.original.firstDueDate)}</span>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Fecha de inicio" />;
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.startDate)}
        </span>
      );
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Notas" />;
    },
    cell: ({ row }) => {
      const notes = row.original.notes;
      if (!notes) {
        return <span className="text-sm text-muted-foreground">-</span>;
      }
      return (
        <span className="text-sm max-w-[200px] truncate block" title={notes}>
          {notes}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    header: () => {
      return <span className="text-black dark:text-white">Acciones</span>;
    },
    cell: ({ row }) => {
      return <Actions id={row.original._id} />;
    },
  },
];
