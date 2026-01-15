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

import { dateInputToMs, moneyToCents } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRegisterPayment } from "../api/use-register-payment";
import { usePaymentDialog } from "../hooks/use-payment-dialog";
import { PaymentFormInput } from "../schemas/payment";
import { PaymentForm } from "./payment-form";
import { useGetLoan } from "../api/use-get-loan";

export function PaymentDialog() {
  const { isOpen, loanId, installmentId, onClose } = usePaymentDialog();
  const { mutate, isPending } = useRegisterPayment();
  const { data } = useGetLoan({ id: loanId ?? null });

  const installment = data?.installments?.find(
    (inst) => inst._id === installmentId
  );
  const loan = data?.loan;

  const handleSubmit = useCallback(
    async (formData: PaymentFormInput) => {
      if (!loanId || !installmentId) {
        toast.error("Error: No se pudo obtener la información del pago");
        return;
      }

      const amountCents = moneyToCents(formData.amount);
      const remaining = installment
        ? installment.amountCents - installment.paidCents
        : 0;

      if (amountCents > remaining) {
        toast.error(
          `El monto excede lo pendiente. Pendiente: ${(remaining / 100).toFixed(2)} ${loan?.currency || ""}`
        );
        return;
      }

      mutate(
        {
          loanId: loanId as Id<"loans">,
          installmentId: installmentId as Id<"installments">,
          amountCents,
          paymentDate: dateInputToMs(formData.paymentDate as Date),
          method: formData.method,
          reference: formData.reference?.trim() || undefined,
          notes: formData.notes?.trim() || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Pago registrado correctamente");
            onClose();
          },
          onError: (error) => {
            toast.error(
              error?.message ||
                "Error al registrar el pago. Intenta nuevamente."
            );
          },
        }
      );
    },
    [mutate, onClose, loanId, installmentId, installment, loan]
  );

  if (!loan || !installment) {
    return null;
  }

  const remaining = installment.amountCents - installment.paidCents;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Registra un pago para la cuota #{installment.number}. Monto
            pendiente:{" "}
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: loan.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(remaining / 100)}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <PaymentForm
            loanId={loanId as Id<"loans">}
            installmentId={installmentId as Id<"installments">}
            currency={loan.currency}
            maxAmount={remaining}
            defaultValues={{
              amount: remaining > 0 ? (remaining / 100).toFixed(2) : "",
              paymentDate: new Date(),
              method: undefined,
              reference: "",
              notes: "",
            }}
            onSubmit={handleSubmit}
            loading={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
