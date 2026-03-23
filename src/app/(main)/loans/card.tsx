"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DataTable } from "@/components/data-table";

import { useGetLoans } from "@/features/loans/api/use-get-loans";
import { useNewLoan } from "@/features/loans/hooks/use-new-loan";
import { useOpenLoan } from "@/features/loans/hooks/use-open-loan";
import { columns } from "./columns";

export default function LoansCard() {
  const newLoan = useNewLoan();
  const loansQuery = useGetLoans();
  const { onOpen } = useOpenLoan();

  const isLoading = loansQuery.isLoading;
  const loans = loansQuery?.loans ?? [];
  const count = loans.length;

  const description =
    isLoading || count === 0
      ? "Consulta el estado, las cuotas y los montos de cada préstamo."
      : `${count} ${count === 1 ? "préstamo registrado" : "préstamos registrados"}. Doble clic en una fila para editar.`;

  return (
    <div className="mx-auto w-full max-w-screen-2xl pb-10">
      <Card className="border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader className="flex flex-col gap-4 px-2 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Préstamos
            </CardTitle>
            <CardDescription className="text-pretty sm:max-w-xl">
              {description}
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            onClick={() => newLoan.onOpen()}>
            <PlusIcon className="size-4" aria-hidden />
            Agregar préstamo
          </Button>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="overflow-x-auto rounded-xl">
            <DataTable
              columns={columns}
              data={loans}
              loading={isLoading}
              loadingLabel="Cargando préstamos…"
              emptyDescription='No hay préstamos. Usa «Agregar préstamo» para crear uno.'
              onEdit={(row) => onOpen(row._id)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
