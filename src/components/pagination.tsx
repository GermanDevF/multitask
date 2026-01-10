import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [8, 16, 32, 64, 128, 256],
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

  // Calcular el rango de items mostrados en la página actual
  const { startItem, endItem } = useMemo(() => {
    const start = pageIndex * pageSize + 1;
    const end = Math.min((pageIndex + 1) * pageSize, totalRows);
    return { startItem: start, endItem: end };
  }, [pageIndex, pageSize, totalRows]);

  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  // Mostrar información relevante de selección
  const selectionInfo = useMemo(() => {
    if (selectedRowsCount === 0) return null;
    return (
      <span className="text-muted-foreground text-sm">
        {selectedRowsCount} of {totalRows}{" "}
        {selectedRowsCount === 1 ? "row selected" : "rows selected"}
      </span>
    );
  }, [selectedRowsCount, totalRows]);

  // Información del rango de items
  const rangeInfo = useMemo(() => {
    if (totalRows === 0) {
      return <span className="text-muted-foreground text-sm">No results</span>;
    }
    return (
      <span className="text-muted-foreground text-sm">
        Showing {startItem} - {endItem} of {totalRows}{" "}
        {totalRows === 1 ? "result" : "results"}
      </span>
    );
  }, [startItem, endItem, totalRows]);

  return (
    <div className="flex flex-col gap-4 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Información de selección y rango */}
      <div className="flex flex-1 flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-4">
        {rangeInfo}
        {selectionInfo}
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        {/* Selector de filas por página */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            disabled={totalRows === 0}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Indicador de página */}
        <div className="flex min-w-[100px] items-center justify-center text-sm font-medium">
          Page {totalRows === 0 ? 0 : pageIndex + 1} of {pageCount}
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!canPreviousPage}
            aria-label="Go to first page"
            title="First page">
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!canPreviousPage}
            aria-label="Go to previous page"
            title="Previous page">
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!canNextPage}
            aria-label="Go to next page"
            title="Next page">
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!canNextPage}
            aria-label="Go to last page"
            title="Last page">
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
