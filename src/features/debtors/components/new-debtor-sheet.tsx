import { useCallback } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCreateDebtor } from "@/features/debtors/api/use-create-debtor";
import { DebtorForm } from "@/features/debtors/components/debtor-form";
import { useNewDebtor } from "@/features/debtors/hooks/use-new-debtor";
import { type DebtorFormInput } from "@/features/debtors/schemas/debtor";

export function NewDebtorSheet() {
  const { isOpen, onClose } = useNewDebtor();
  const { mutate, isPending } = useCreateDebtor();

  const handleSubmit = useCallback(
    (data: DebtorFormInput) => {
      mutate(data, {
        onSuccess: () => {
          toast.success("Deudor creado correctamente");
          onClose();
        },
        onError: () => {
          toast.error("Error al crear el deudor");
        },
      });
    },
    [mutate, onClose]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Nuevo deudor</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          Crea un nuevo deudor para tu préstamo.
        </SheetDescription>
        <DebtorForm
          onSubmit={handleSubmit}
          loading={isPending}
          defaultValues={{ fullName: "", email: "", phone: "", notes: "" }}
        />
      </SheetContent>
    </Sheet>
  );
}
