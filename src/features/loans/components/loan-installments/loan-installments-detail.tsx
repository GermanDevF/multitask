"use client";

import { Calendar } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InstallmentMobileCard } from "./installment-mobile-card";
import { InstallmentTableRow } from "./installment-table-row";
import type { Installment, InstallmentRowProps } from "./types";

type RowContext = Omit<InstallmentRowProps, "installment">;

type LoanInstallmentsDetailProps = {
  installments: Installment[];
  rowContext: RowContext | null;
};

export function LoanInstallmentsDetail({
  installments,
  rowContext,
}: LoanInstallmentsDetailProps) {
  return (
    <div>
      <div className="mb-3 flex flex-col gap-1 sm:mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Detalle por cuota</h2>
        <p className="text-sm text-muted-foreground">
          Las filas resaltadas están vencidas o pendientes con fecha pasada
        </p>
      </div>

      {installments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-14 text-center">
          <Calendar className="mb-3 size-10 text-muted-foreground/60" />
          <p className="font-medium text-foreground">Sin cuotas</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Este préstamo aún no tiene cuotas generadas o registradas.
          </p>
        </div>
      ) : (
        <>
          {rowContext ? (
            <div className="md:hidden">
              <ul className="space-y-3" aria-label="Lista de cuotas">
                {installments.map((installment) => (
                  <li key={installment._id}>
                    <InstallmentMobileCard
                      installment={installment}
                      {...rowContext}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="hidden overflow-hidden rounded-xl border md:block">
            <div className="max-h-[min(70vh,32rem)] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background shadow-[0_1px_0_0_hsl(var(--border))]">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-14 bg-background">#</TableHead>
                    <TableHead className="min-w-36 bg-background">
                      Vencimiento
                    </TableHead>
                    <TableHead className="text-right bg-background">Monto</TableHead>
                    <TableHead className="text-right bg-background">Pagado</TableHead>
                    <TableHead className="text-right bg-background">
                      Pendiente
                    </TableHead>
                    <TableHead className="bg-background">Estado</TableHead>
                    <TableHead className="w-30 bg-background">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rowContext
                    ? installments.map((installment) => (
                        <InstallmentTableRow
                          key={installment._id}
                          installment={installment}
                          {...rowContext}
                        />
                      ))
                    : null}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
