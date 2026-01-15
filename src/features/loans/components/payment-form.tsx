"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { CurrencyInput } from "@/components/currency-input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Id } from "../../../../convex/_generated/dataModel";
import { PaymentFormInput, paymentFormSchema } from "../schemas/payment";

type PaymentFormProps = {
  loanId: Id<"loans">;
  installmentId: Id<"installments">;
  currency: string;
  maxAmount: number; // en centavos
  defaultValues?: PaymentFormInput;
  onSubmit: (data: PaymentFormInput) => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PaymentForm({
  currency,
  maxAmount,
  defaultValues,
  onSubmit,
  disabled,
  loading,
}: PaymentFormProps) {
  const form = useForm<PaymentFormInput>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: defaultValues || {
      amount: "",
      paymentDate: new Date(),
      method: undefined,
      reference: "",
      notes: "",
    },
    disabled,
    shouldUnregister: true,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const handleSubmit = useCallback(
    (data: PaymentFormInput) => {
      const amountCents = Math.round(Number(data.amount) * 100);
      if (amountCents > maxAmount) {
        form.setError("amount", {
          type: "manual",
          message: `El monto no puede exceder ${(maxAmount / 100).toFixed(2)} ${currency}`,
        });
        return;
      }
      onSubmit(data);
    },
    [onSubmit, maxAmount, currency, form]
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  Monto del pago
                </FormLabel>
                <FormControl>
                  <CurrencyInput
                    {...field}
                    placeholder="0.00"
                    disabled={disabled}
                    value={field.value}
                    onChange={field.onChange}
                    onChangeValue={(value) =>
                      field.onChange(value?.toString() || "")
                    }
                  />
                </FormControl>
                <FormDescription>
                  Monto máximo pendiente: {formatCurrency(maxAmount / 100)}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  Fecha de pago
                </FormLabel>
                <FormControl>
                  <DatePicker
                    value={
                      field.value instanceof Date
                        ? field.value
                        : field.value
                          ? new Date(field.value as string)
                          : undefined
                    }
                    onChange={(date) => field.onChange(date)}
                    disabled={disabled}
                  />
                </FormControl>
                <FormDescription>
                  Fecha en que se realizó el pago
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  Método de pago
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={disabled}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un método (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                    <SelectItem value="CARD">Tarjeta</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Método utilizado para realizar el pago (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  Referencia
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Número de referencia o comprobante"
                    disabled={disabled}
                  />
                </FormControl>
                <FormDescription>
                  Número de referencia, comprobante o folio (opcional)
                </FormDescription>
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
                  <Input
                    {...field}
                    placeholder="Notas adicionales sobre el pago"
                    disabled={disabled}
                  />
                </FormControl>
                <FormDescription>
                  Información adicional sobre el pago (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={disabled || loading}>
            {loading ? "Registrando..." : "Registrar pago"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
