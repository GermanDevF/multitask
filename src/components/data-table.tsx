"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { FileSearch, Loader2 } from "lucide-react";
import React from "react";

import { DataTablePagination } from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  onEdit: (row: TData) => void;
  /** Texto bajo el spinner (p. ej. contexto de la pantalla). */
  loadingLabel?: string;
  /** Mensaje cuando no hay filas (p. ej. indicar cómo crear el primer registro). */
  emptyDescription?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  onEdit,
  loadingLabel = "Cargando…",
  emptyDescription = "No hay datos para mostrar.",
}: DataTableProps<TData, TValue>) {
  const [ sorting, setSorting ] = React.useState<SortingState>([]);
  const [ columnFilters, setColumnFilters ] = React.useState<ColumnFiltersState>(
    []
  );
  const [ rowSelection, setRowSelection ] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 8,
      },
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const hasData = table.getRowModel().rows.length > 0;

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="rounded-md border">
        <Table className="rounded-md">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index, array) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      index === 0 && "rounded-tl-md",
                      index === array.length - 1 && "rounded-tr-md",
                      header.column.columnDef.meta?.className
                    )}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Estado de carga
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="text-muted-foreground size-6 animate-spin" />
                    <p className="text-muted-foreground text-sm">{loadingLabel}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : !hasData ? (
              // Estado sin datos
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileSearch className="text-muted-foreground size-8" />
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      {emptyDescription}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Datos normales
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(loading && "pointer-events-none opacity-50")}
                  onClick={() => {
                    row.toggleSelected();
                  }}
                  onDoubleClick={() => {
                    onEdit(row.original);
                  }}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.columnDef.meta?.className)}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación - solo mostrar si hay datos y no está cargando */}
      {hasData && !loading && (
        <div className="mt-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}
