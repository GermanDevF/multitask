import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";

import {
  debtorSchema,
  type DebtorFormInput,
} from "@/features/debtors/schemas/debtor";

import { Id } from "../../../../convex/_generated/dataModel";

type DebtorFormProps = {
  id?: Id<"debtors">;
  defaultValues?: DebtorFormInput;
  onSubmit: (data: DebtorFormInput) => void;
  disabled?: boolean;
  loading?: boolean;
};

export function DebtorForm({
  id,
  defaultValues,
  onSubmit,
  disabled,
  loading,
}: DebtorFormProps) {
  const form = useForm<DebtorFormInput>({
    resolver: zodResolver(debtorSchema),
    defaultValues,
    disabled,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const handleSubmit = useCallback(
    (data: DebtorFormInput) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  const labelButton = useMemo(() => {
    if (id) {
      return loading ? "Actualizando..." : "Actualizar";
    }
    return loading ? "Creando..." : "Crear";
  }, [loading, id]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">
                Nombre completo
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Juan Pérez"
                  disabled={disabled}
                  className="h-11 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">Teléfono</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  disabled={disabled}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">
                Correo electrónico
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="email@example.com"
                  disabled={disabled}
                  className="h-11 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">Notas</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Notas adicionales sobre el deudor..."
                  disabled={disabled}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled || loading} className="w-full">
          {labelButton}
        </Button>
      </form>
    </Form>
  );
}
