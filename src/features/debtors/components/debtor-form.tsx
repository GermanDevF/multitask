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
    console.log({ id, loading });

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
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
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
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled || loading}>
          {labelButton}
        </Button>
      </form>
    </Form>
  );
}
