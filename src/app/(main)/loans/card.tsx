"use client";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DataTable } from "@/components/data-table";

import { useGetLoans } from "@/features/loans/api/use-get-loans";
import { useNewLoan } from "@/features/loans/hooks/use-new-loan";
import { useOpenLoan } from "@/features/loans/hooks/use-open-loan";
import { InstallmentsSheet } from "@/features/loans/components/installments-sheet";
import { columns } from "./columns";

export default function LoansCard() {
  const newLoan = useNewLoan();
  const loansQuery = useGetLoans();
  const { onOpen } = useOpenLoan();

  const isLoading = loansQuery.isLoading;

  console.log(loansQuery?.loans);

  return (
    <>
      <div className="mx-auto w-full max-w-screen-2xl pb-10">
        <Card className="border-none shadow-none drop-shadow-none">
          <CardHeader className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between px-4">
            <CardTitle className="line-clamp-1 text-xl">Préstamos</CardTitle>
            <Button
              size="sm"
              className="w-full lg:w-auto"
              onClick={() => newLoan.onOpen()}>
              <PlusIcon className="size-4" />
              Agregar préstamo
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={loansQuery?.loans ?? []}
              loading={isLoading}
              onEdit={(row) => onOpen(row._id)}
            />
          </CardContent>
        </Card>
      </div>
      <InstallmentsSheet />
    </>
  );
}
