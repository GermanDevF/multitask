"use client";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DataTable } from "@/components/data-table";

import { useNewDebtor } from "@/features/debtors/hooks/use-new-debtor";

import { columns } from "./columns";
import { useGetDebtors } from "@/features/debtors/api/use-get-debtors";
import { useOpenDebtor } from "@/features/debtors/hooks/use-open-debtor";

export default function DebtsCard() {
  const newDebtor = useNewDebtor();
  const debtsQuery = useGetDebtors();
  const { onOpen } = useOpenDebtor();

  const isLoading = debtsQuery.isLoading;

  return (
    <div className="mx-auto w-full max-w-screen-2xl pb-10">
      <Card className="border-none shadow-none drop-shadow-none">
        <CardHeader className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between px-4">
          <CardTitle className="line-clamp-1 text-xl">Deudores</CardTitle>
          <Button
            size="sm"
            className="w-full lg:w-auto"
            onClick={() => newDebtor.onOpen()}>
            <PlusIcon className="size-4" />
            Agregar deudor
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={debtsQuery?.debtors ?? []}
            loading={isLoading}
            onEdit={(row) => onOpen(row._id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
