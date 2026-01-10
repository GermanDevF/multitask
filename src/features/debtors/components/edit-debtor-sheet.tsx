import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useEditDebtor } from "@/features/debtors/api/use-edit-debtor";
import { useGetDebtor } from "@/features/debtors/api/use-get-debtor";

import { DebtorForm } from "@/features/debtors/components/debtor-form";

import { useOpenDebtor } from "@/features/debtors/hooks/use-open-debtor";

import { type DebtorFormInput } from "@/features/debtors/schemas/debtor";

export function EditDebtorSheet() {
  const { isOpen, id, onClose } = useOpenDebtor();
  const { mutate, isPending } = useEditDebtor();
  const { debtor, isLoading: isLoadingDebtor } = useGetDebtor({ id });
  const isLoading = useMemo(
    () => isLoadingDebtor || isPending,
    [isLoadingDebtor, isPending]
  );

  const defaultValues = useMemo(() => {
    if (!id || !debtor) {
      return { fullName: "", email: "", phone: "", notes: "" };
    }
    return {
      fullName: debtor.fullName ?? "",
      email: debtor.email ?? "",
      phone: debtor.phone ?? "",
      notes: debtor.notes ?? "",
    };
  }, [id, debtor]);

  const handleSubmit = useCallback(
    async (data: DebtorFormInput) => {
      mutate(
        { id: id!, ...data },
        {
          onSuccess: () => {
            toast.success("Deudor actualizado correctamente");
            onClose();
          },
          onError: () => {
            toast.error("Error al actualizar el deudor");
          },
        }
      );
    },
    [mutate, id, onClose]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Editar deudor</SheetTitle>
        </SheetHeader>
        <SheetDescription>Edita los datos del deudor.</SheetDescription>
        <DebtorForm
          id={id ?? undefined}
          onSubmit={handleSubmit}
          loading={isLoading}
          defaultValues={defaultValues}
        />
      </SheetContent>
    </Sheet>
  );
}
