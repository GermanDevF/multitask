"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { Doc } from "../../../../convex/_generated/dataModel";
import { Actions } from "./actions";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

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
