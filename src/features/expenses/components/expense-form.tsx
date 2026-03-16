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

import {
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  ExpenseFormInput,
  expenseFormSchema,
} from "../schemas/expense";

type ExpenseFormProps = {
  defaultValues?: Partial<ExpenseFormInput>;
  onSubmit: (data: ExpenseFormInput) => void;
  disabled?: boolean;
  loading?: boolean;
};

export function ExpenseForm({
  defaultValues,
  onSubmit,
  disabled,
  loading,
}: ExpenseFormProps) {
  const form = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
      amount: "",
      currency: "MXN",
      category: undefined,
      date: new Date(),
      paidBy: "",
      ...defaultValues,
    },
    disabled,
    shouldUnregister: true,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({ currency: "MXN", date: new Date(), ...defaultValues });
    }
  }, [ defaultValues, form ]);

  const handleSubmit = useCallback(
    (data: ExpenseFormInput) => {
      onSubmit(data);
    },
    [ onSubmit ]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">Descripción</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ej. Compras del supermercado"
                  disabled={disabled}
                />
              </FormControl>
              <FormDescription>Descripción breve del gasto</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monto / Moneda */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Monto</FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder="0.00"
                    disabled={disabled}
                    value={field.value}
                    onChange={(v) => field.onChange(v ?? "")}
                    onChangeValue={() => { }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Moneda</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    disabled={disabled}
                    value={field.value}>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MXN">MXN — Peso Mexicano</SelectItem>
                      <SelectItem value="USD">USD — Dólar</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Fecha / Quién pagó */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Fecha</FormLabel>
                <FormControl>
                  <DatePicker
                    value={
                      field.value instanceof Date
                        ? field.value
                        : undefined
                    }
                    onChange={(day) => field.onChange(day)}
                    disabled={disabled}
                  />
                </FormControl>
                <FormDescription>Fecha en que ocurrió el gasto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paidBy"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  ¿Quién pagó?
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej. Ana"
                    disabled={disabled}
                  />
                </FormControl>
                <FormDescription>Nombre de quien realizó el pago</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Categoría */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">Categoría</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  disabled={disabled}
                  value={field.value}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[ cat ]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Tipo de gasto</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={disabled || loading}
          className="h-11 w-full"
          size="lg">
          {loading ? "Guardando..." : "Guardar gasto"}
        </Button>
      </form>
    </Form>
  );
}
