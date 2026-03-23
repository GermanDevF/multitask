"use client";

import { Edit, MoreHorizontal, Trash2, List } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useRemoveLoan } from "@/features/loans/api/use-remove-loan";

type Props = {
  id: Id<"loans">;
};

export const Actions = ({ id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "¿Eliminar este préstamo?",
    "Esta acción no se puede deshacer."
  );
  const router = useRouter();
  const { onOpen } = useOpenLoan();

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
      <div
        className="flex justify-end"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 md:size-8"
              aria-label="Acciones del préstamo">
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-32">
            <DropdownMenuItem
              disabled={isDeleting}
              onClick={() => router.push(`/loans/${id}/installments`)}
              className="cursor-pointer">
              <List className="size-4" aria-hidden />
              Ver cuotas
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeleting}
              onClick={() => onOpen(id)}
              className="cursor-pointer">
              <Edit className="size-4" aria-hidden />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeleting}
              onClick={handleDelete}
              className="cursor-pointer"
              variant="destructive">
              <Trash2 className="size-4" aria-hidden />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ConfirmDialog />
    </>
  );
};
