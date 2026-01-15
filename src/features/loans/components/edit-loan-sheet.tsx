import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useOpenLoan } from "@/features/loans/hooks/use-open-loan";

import { useGetLoan } from "../api/use-get-loan";
import { LoanFormInput } from "../schemas/loan";
import { LoanForm } from "./loan-form";
import { useEditLoan } from "../api/use-edit-loan";
import { dateInputToMs, moneyToCents } from "@/lib/utils";
import { useGetDebtor } from "@/features/debtors/api/use-get-debtor";

export function EditLoanSheet() {
  const { isOpen, id, onClose } = useOpenLoan();
  const { mutate, isPending } = useEditLoan();
  const { data, isLoading: isLoadingLoan } = useGetLoan({ id });
  const debtorId = data?.loan.debtorId ?? null;
  const { debtor, isLoading: isLoadingDebtor } = useGetDebtor({ id: debtorId });
  const isLoading = useMemo(
    () => isLoadingLoan || isLoadingDebtor || isPending,
    [isLoadingLoan, isLoadingDebtor, isPending]
  );

  const defaultValues = useMemo(() => {
    if (!id || !data) {
      return {
        debtorId: "",
        amount: "",
        currency: "",
        startDate: "",
        firstDueDate: "",
        installmentsCount: "",
        frequency: "WEEKLY" as const,
        interestType: "NONE" as const,
        interestRatePercent: "",
        notes: "",
      };
    }
    // Convertir centavos a moneda para mostrar en el formulario
    const amountInCurrency = data.loan.principalCents
      ? (data.loan.principalCents / 100).toFixed(2)
      : "";

    return {
      debtorId: data.loan.debtorId ?? "",
      amount: amountInCurrency,
      currency: data.loan.currency ?? "",
      startDate: data.loan.startDate
        ? new Date(data.loan.startDate).toISOString().split("T")[0]
        : "",
      firstDueDate: data.loan.firstDueDate
        ? new Date(data.loan.firstDueDate).toISOString().split("T")[0]
        : "",
      installmentsCount: data.loan.installmentsCount ?? "",
      frequency: (data.loan.frequency ?? "WEEKLY") as
        | "WEEKLY"
        | "BIWEEKLY"
        | "MONTHLY",
      interestType: (data.loan.interestType ?? "NONE") as "NONE" | "SIMPLE",
      interestRatePercent:
        data.loan.interestType === "NONE"
          ? "0"
          : data.loan.interestRateBps
            ? String(data.loan.interestRateBps / 100)
            : "",
      notes: data.loan.notes ?? "",
    };
  }, [id, data]);

  const handleSubmit = useCallback(
    async (data: LoanFormInput) => {
      if (!debtor?.fullName) {
        toast.error("Error: No se pudo obtener la información del deudor");
        return;
      }

      // Si el tipo de interés es NONE, establecer la tasa en 0
      const interestRate =
        data.interestType === "NONE" ? "0" : data.interestRatePercent || "0";

      mutate(
        {
          id: id!,
          fullName: debtor.fullName,
          principalCents: moneyToCents(data.amount),
          currency: data.currency,
          startDate: dateInputToMs(data.startDate),
          firstDueDate: dateInputToMs(data.firstDueDate),
          installmentsCount: Number(data.installmentsCount),
          frequency: data.frequency,
          interestType: data.interestType,
          interestRateBps: Math.round(Number(interestRate) * 100),
          notes: data.notes?.trim() ? data.notes.trim() : undefined,
        },
        {
          onSuccess: () => {
            toast.success("Préstamo actualizado correctamente");
            onClose();
          },
          onError: (error) => {
            toast.error(
              error?.message ||
                "Error al actualizar el préstamo. Intenta nuevamente."
            );
          },
        }
      );
    },
    [mutate, id, onClose, debtor]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="overflow-y-auto w-md">
        <SheetHeader>
          <SheetTitle>Editar préstamo</SheetTitle>
          <SheetDescription>
            Modifica la información del préstamo. Los cambios se aplicarán
            inmediatamente.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          {isLoadingLoan ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">
                Cargando información del préstamo...
              </div>
            </div>
          ) : (
            <LoanForm
              id={id ?? undefined}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              loading={isLoading}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
