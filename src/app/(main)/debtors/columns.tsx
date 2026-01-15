"use client";
import { ColumnDef } from "@tanstack/react-table";
import { formatPhoneNumber } from "react-phone-number-input";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/data-table-column-header";

import { Actions } from "./actions";

import { Doc } from "../../../../convex/_generated/dataModel";

export const columns: ColumnDef<Doc<"debtors">>[] = [
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
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Nombre" />;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Teléfono" />;
    },
    cell: ({ row }) => {
      return <span>{formatPhoneNumber(row.original.phone || "") || "-"}</span>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Correo" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.email || "-"}</span>;
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Notas" />;
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    header: () => {
      return <span className="text-white">Acciones</span>;
    },
    cell: ({ row }) => {
      return <Actions id={row.original._id} />;
    },
  },
];
