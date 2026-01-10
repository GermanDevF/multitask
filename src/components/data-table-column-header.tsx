import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  showSorting?: boolean;
  showVisibility?: boolean;
  showFilters?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  showSorting = true,
  showVisibility = true,
  showFilters = false,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [isOpen, setIsOpen] = useState(false);

  // Si la columna no puede ser ordenada y no tiene otras funcionalidades, mostrar solo el título
  if (!column.getCanSort() && !showVisibility && !showFilters) {
    return (
      <div className={cn("font-medium text-white", className)} {...props}>
        {title}
      </div>
    );
  }

  const getSortIcon = () => {
    const sortDirection = column.getIsSorted();
    switch (sortDirection) {
      case "asc":
        return <ArrowUp className="ml-2 size-4" />;
      case "desc":
        return <ArrowDown className="ml-2 size-4" />;
      default:
        return <ChevronsUpDown className="ml-2 size-4" />;
    }
  };

  const handleSort = (desc: boolean) => {
    column.toggleSorting(desc);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8",
              "hover:bg-primary/75 text-white hover:text-purple-100",
              "focus:ring-primary focus:ring-2 focus:ring-offset-2"
            )}
            aria-label={`Opciones para columna ${title}`}>
            <span className="font-medium">{title}</span>
            {showSorting && column.getCanSort() && getSortIcon()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {showSorting && column.getCanSort() && (
            <>
              <DropdownMenuItem
                onClick={() => handleSort(false)}
                className="cursor-pointer"
                aria-label="Ordenar ascendente">
                <ArrowUp className="mr-2 h-4 w-4" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSort(true)}
                className="cursor-pointer"
                aria-label="Ordenar descendente">
                <ArrowDown className="mr-2 h-4 w-4" />
                Desc
              </DropdownMenuItem>
              {column.getIsSorted() && (
                <DropdownMenuItem
                  onClick={() => column.clearSorting()}
                  className="cursor-pointer"
                  aria-label="Limpiar ordenamiento">
                  <ChevronsUpDown className="mr-2 h-4 w-4" />
                  Clear sorting
                </DropdownMenuItem>
              )}
            </>
          )}

          {showFilters && column.getCanFilter() && (
            <>
              <DropdownMenuItem
                onClick={() => column.setFilterValue("")}
                className="cursor-pointer"
                aria-label="Limpiar filtros">
                Limpiar filtros
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
