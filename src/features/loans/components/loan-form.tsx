"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { useCreateLoan } from "@/features/loans/api/use-create-loan";
import {
  loanFormSchema,
  type LoanFormInput,
  type LoanFormValues,
} from "@/features/loans/schemas/loan";
import { Id } from "../../../../convex/_generated/dataModel";
import { dateInputToMs, moneyToCents } from "@/lib/utils";
import { useGetDebtors } from "@/features/debtors/api/use-get-debtors";

type DebtorOption = { id: Id<"debtors">; label: string };

export function LoanForm({
  onCreated,
  defaultValues,
  disabled,
}: {
  debtors?: DebtorOption[];
  onCreated?: (loanId: Id<"loans">) => void;
  defaultValues?: LoanFormInput;
  disabled?: boolean;
}) {
  const { mutate, isPending, error, isSuccess } = useCreateLoan();
  const [localError, setLocalError] = useState<string | null>(null);
  const { debtors, isLoading: isLoadingDebtors } = useGetDebtors();

  const isLoading = useMemo(
    () => isPending || isLoadingDebtors,
    [isPending, isLoadingDebtors]
  );

  const dataDebtors = useMemo(() => {
    return debtors?.map((d) => ({
      id: d._id,
      label: d.fullName,
    }));
  }, [debtors]);
  // const defaultValues = useMemo<LoanFormInput>(
  //   () => ({
  //     debtorId: "",
  //     amount: "",
  //     currency: defaultCurrency,
  //     startDate: todayISODate(),
  //     firstDueDate: todayISODate(),
  //     installmentsCount: 12,
  //     frequency: "MONTHLY",
  //     interestType: "NONE",
  //     interestRatePercent: "0",
  //     notes: "",
  //   }),
  //   [defaultCurrency]
  // );

  const form = useForm<LoanFormInput, unknown, LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues,
    disabled,
  });

  const interestType = useWatch({
    control: form.control,
    name: "interestType",
  });

  const onSubmit = async (values: LoanFormValues) => {
    setLocalError(null);

    const interestRateBps =
      values.interestType === "NONE"
        ? 0
        : Math.round(Number(values.interestRatePercent) * 100); // 5% -> 500 bps

    const response = await mutate(
      {
        debtorId: values.debtorId as Id<"debtors">,
        principalCents: moneyToCents(values.amount),
        currency: values.currency,
        startDate: dateInputToMs(values.startDate),
        firstDueDate: dateInputToMs(values.firstDueDate),
        installmentsCount: values.installmentsCount,
        frequency: values.frequency,
        interestType: values.interestType,
        interestRateBps,
        notes: values.notes?.trim() ? values.notes.trim() : undefined,
      },
      {
        onSuccess: (res) => {
          if (res?.loanId) onCreated?.(res.loanId);
          form.reset(defaultValues);
        },
        onError: (e) => setLocalError(e.message),
      }
    );

    if (!response && error?.message && !localError) {
      setLocalError(error.message);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Crear préstamo
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <FormError error={localError ?? error?.message} />
        {isSuccess ? (
          <p className="rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground">
            Préstamo creado correctamente.
          </p>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="debtorId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Deudor</FormLabel>
                    <FormControl>
                      {!!dataDebtors?.length && (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecciona un deudor" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataDebtors?.map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="decimal"
                        placeholder="Ej. 1500.00"
                        className="h-11"
                        disabled={isLoading}
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
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecciona moneda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MXN">MXN</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inicio</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="h-11"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstDueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primer pago</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="h-11"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="installmentsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuotas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={
                          typeof field.value === "number" ? field.value : ""
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="h-11"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecciona frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WEEKLY">Semanal</SelectItem>
                          <SelectItem value="BIWEEKLY">Quincenal</SelectItem>
                          <SelectItem value="MONTHLY">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interés</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">Sin interés</SelectItem>
                          <SelectItem value="SIMPLE">Simple</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestRatePercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa (%)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="decimal"
                        placeholder="Ej. 5"
                        className="h-11"
                        disabled={isLoading || interestType === "NONE"}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Se convierte a BPS (ej. 5% → 500).
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Notas (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-11"
                        placeholder="Ej. Préstamo por reparación del auto"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full text-base"
              disabled={isLoading}>
              {isPending ? "Creando..." : "Crear préstamo"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Tip: si todavía no tienes selector de deudores, puedes pegar el Id
        manualmente.
      </CardFooter>
    </Card>
  );
}
