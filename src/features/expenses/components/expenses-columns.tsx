"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { useConfirm } from "@/hooks/use-confirm";

import { Doc } from "../../../../convex/_generated/dataModel";
import { useRemoveExpense } from "../api/use-remove-expense";
import { CATEGORY_LABELS, ExpenseCategory } from "../schemas/expense";

function formatCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DeleteAction({ id }: { id: Doc<"expenses">["_id"] }) {
  const [ConfirmDialog, confirm] = useConfirm(
    "¿Eliminar este gasto?",
    "Esta acción no se puede deshacer."
  );
  const { mutate, isPending } = useRemoveExpense();

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      mutate(id, {
        onSuccess: () => toast.success("Gasto eliminado correctamente"),
        onError: () => toast.error("Error al eliminar el gasto"),
      });
    }
  };

  return (
    <>
      <Button
        size="icon-sm"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        disabled={isPending}
        onClick={handleDelete}>
        <Trash2 className="size-4" />
      </Button>
      <ConfirmDialog />
    </>
  );
}

export const expenseColumns: ColumnDef<Doc<"expenses">>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{formatDate(row.original.date)}</span>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-sm max-w-[180px] truncate block" title={row.original.description}>
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "paidByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pagó" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.paidByName}</span>
    ),
  },
  {
    accessorKey: "amountCents",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-sm">
        {formatCurrency(row.original.amountCents, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => (
      <Badge variant="secondary">
        {CATEGORY_LABELS[row.original.category as ExpenseCategory] ??
          row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moneda" />
    ),
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.currency}
      </span>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    header: () => <span className="sr-only">Acciones</span>,
    cell: ({ row }) => <DeleteAction id={row.original._id} />,
  },
];
