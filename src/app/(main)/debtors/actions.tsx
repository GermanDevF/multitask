"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useConfirm } from "@/hooks/use-confirm";

import { useRemoveDebtor } from "@/features/debtors/api/use-remove-debtor";
import { useOpenDebtor } from "@/features/debtors/hooks/use-open-debtor";

import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  id: Id<"debtors">;
};

export const Actions = ({ id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this debtor?",
    "This action cannot be undone."
  );
  const { onOpen } = useOpenDebtor();

  const { mutate: removeDebtor, isPending: isDeleting } = useRemoveDebtor();

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      removeDebtor(id, {
        onSuccess: () => {
          toast.success("Deudor eliminado correctamente");
        },
        onError: () => {
          toast.error("Error al eliminar el deudor");
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
            onClick={() => onOpen(id)}
            className="cursor-pointer">
            <Edit className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDeleting}
            onClick={handleDelete}
            className="cursor-pointer"
            variant="destructive">
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog />
    </>
  );
};
