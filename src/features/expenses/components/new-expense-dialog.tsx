"use client";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCreateExpense } from "../api/use-create-expense";
import { useNewExpense } from "../hooks/use-new-expense";
import { ExpenseFormInput } from "../schemas/expense";
import { ExpenseForm } from "./expense-form";

export function NewExpenseDialog() {
  const { isOpen, onClose } = useNewExpense();
  const { mutate, isPending } = useCreateExpense();

  const handleSubmit = useCallback(
    async (data: ExpenseFormInput) => {
      const amountCents = Math.round(Number(data.amount) * 100);
      const dateMs =
        data.date instanceof Date
          ? data.date.getTime()
          : new Date(data.date as string).getTime();

      mutate(
        {
          description: data.description,
          amountCents,
          currency: data.currency,
          category: data.category,
          paidByName: data.paidBy,
          date: dateMs,
        },
        {
          onSuccess: () => {
            toast.success("Gasto registrado correctamente");
            onClose();
          },
          onError: (error) => {
            toast.error(
              error?.message ?? "Error al registrar el gasto. Intenta nuevamente."
            );
          },
        }
      );
    },
    [mutate, onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo gasto</DialogTitle>
          <DialogDescription>
            Registra un gasto del hogar. Todos los campos son obligatorios
            excepto donde se indique.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ExpenseForm onSubmit={handleSubmit} loading={isPending} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
