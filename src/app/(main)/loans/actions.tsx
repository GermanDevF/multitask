"use client";

import { Edit, MoreHorizontal, Trash2, List } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useConfirm } from "@/hooks/use-confirm";

import { Id } from "../../../../convex/_generated/dataModel";
import { useOpenLoan } from "@/features/loans/hooks/use-open-loan";
import { useOpenInstallments } from "@/features/loans/hooks/use-open-installments";
import { useRemoveLoan } from "@/features/loans/api/use-remove-loan";

type Props = {
  id: Id<"loans">;
};

export const Actions = ({ id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "¿Estás seguro de querer eliminar este préstamo?",
    "Esta acción no puede ser deshacer."
  );
  const { onOpen } = useOpenLoan();
  const { onOpen: onOpenInstallments } = useOpenInstallments();

  const { mutate: removeLoan, isPending: isDeleting } = useRemoveLoan();

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      removeLoan(id, {
        onSuccess: () => {
          toast.success("Préstamo eliminado correctamente");
        },
        onError: () => {
          toast.error("Error al eliminar el préstamo");
        },
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={isDeleting}
            onClick={() => onOpenInstallments(id)}
            className="cursor-pointer">
            <List className="size-4" />
            Ver cuotas
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDeleting}
            onClick={() => onOpen(id)}
            className="cursor-pointer">
            <Edit className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDeleting}
            onClick={handleDelete}
            className="cursor-pointer"
            variant="destructive">
            <Trash2 className="size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog />
    </>
  );
};
