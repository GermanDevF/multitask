import { useCallback } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { dateInputToMs, moneyToCents } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCreateLoan } from "../api/use-create-loan";
import { useNewLoan } from "../hooks/use-new-loan";
import { LoanFormInput } from "../schemas/loan";
import { LoanForm } from "./loan-form";

export function NewLoanSheet() {
  const { isOpen, onClose } = useNewLoan();
  const { mutate, isPending } = useCreateLoan();

  const handleSubmit = useCallback(
    async (data: LoanFormInput) => {
      if (!data.debtorId) {
        toast.error("Error: No se pudo obtener el deudor");
        return;
      }

      // Si el tipo de interés es NONE, establecer la tasa en 0
      const interestRate =
        data.interestType === "NONE" ? "0" : data.interestRatePercent || "0";

      // Calcular el monto total en centavos
      const totalCents = moneyToCents(data.amount);
      const installmentsCount = Number(data.installmentsCount);

      // Calcular el monto por installment y redondear cada uno
      const installmentAmountCents = Math.round(totalCents / installmentsCount);

      // Ajustar el principalCents para que la suma de installments redondeados coincida
      // Si hay diferencia por el redondeo, se distribuirá en los primeros installments
      const adjustedPrincipalCents = installmentAmountCents * installmentsCount;

      mutate(
        {
          debtorId: data.debtorId as Id<"debtors">,
          principalCents: adjustedPrincipalCents,
          currency: data.currency,
          startDate: dateInputToMs(data.startDate as Date),
          firstDueDate: dateInputToMs(data.firstDueDate as Date),
          installmentsCount: installmentsCount,
          frequency: data.frequency,
          interestType: data.interestType,
          interestRateBps: Math.round(Number(interestRate) * 100),
          notes: data.notes?.trim() ? data.notes.trim() : undefined,
        },
        {
          onSuccess: () => {
            toast.success("Préstamo creado correctamente");
            onClose();
          },
          onError: (error) => {
            toast.error(
              error?.message ||
                "Error al crear el préstamo. Intenta nuevamente."
            );
          },
        }
      );
    },
    [mutate, onClose]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nuevo préstamo</SheetTitle>
          <SheetDescription>
            Completa el formulario para crear un nuevo préstamo. Todos los
            campos marcados son obligatorios.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <LoanForm
            defaultValues={{
              debtorId: "",
              amount: "",
              currency: "",
              startDate: "",
              firstDueDate: "",
              installmentsCount: "",
              frequency: "WEEKLY" as const,
              interestType: "NONE" as const,
              interestRatePercent: "0",
              notes: "",
            }}
            onSubmit={handleSubmit}
            loading={isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
