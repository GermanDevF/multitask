import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { CurrencyInput } from "@/components/currency-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";

import { useGetDebtors } from "@/features/debtors/api/use-get-debtors";
import { LoanFormInput, loanFormSchema } from "@/features/loans/schemas/loan";

import { Id } from "../../../../convex/_generated/dataModel";

type LoanFormProps = {
  id?: Id<"loans">;
  defaultValues?: LoanFormInput;
  onSubmit: (data: LoanFormInput) => void;
  disabled?: boolean;
  loading?: boolean;
};

export function LoanForm({
  id,
  defaultValues,
  onSubmit,
  disabled,
  loading,
}: LoanFormProps) {
  const form = useForm<LoanFormInput>({
    resolver: zodResolver(loanFormSchema),
    defaultValues,
    disabled,
    shouldUnregister: true,
  });

  const { debtors, isLoading: isLoadingDebtors } = useGetDebtors();

  const debtorOptions = useMemo(() => {
    return debtors?.map((debtor) => ({
      label: debtor.fullName,
      value: debtor._id,
    }));
  }, [debtors]);

  const interestType = useWatch({
    control: form.control,
    name: "interestType",
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  // Calcular resumen del préstamo
  const loanSummary = useMemo(() => {
    const amount = Number(watchedValues.amount) || 0;
    const installments = Number(watchedValues.installmentsCount) || 0;
    const rate = Number(watchedValues.interestRatePercent) || 0;
    const currency = watchedValues.currency || "";

    if (!amount || !installments || !currency) return null;

    const installmentAmount = amount / installments;
    const hasInterest = watchedValues.interestType === "SIMPLE" && rate > 0;

    return {
      totalAmount: amount,
      installments,
      installmentAmount,
      currency,
      frequency: watchedValues.frequency,
      hasInterest,
      interestRate: rate,
    };
  }, [watchedValues]);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  // Establecer automáticamente la tasa de interés en "0" cuando el tipo es NONE
  useEffect(() => {
    if (interestType === "NONE") {
      form.setValue("interestRatePercent", "0", { shouldValidate: false });
    }
  }, [interestType, form]);

  const handleSubmit = useCallback(
    (data: LoanFormInput) => {
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

  const formatFrequency = (freq: string) => {
    const map: Record<string, string> = {
      WEEKLY: "Semanal",
      BIWEEKLY: "Quincenal",
      MONTHLY: "Mensual",
    };
    return map[freq] || freq;
  };

  const formatCurrency = (amount: number, currency: string) => {
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
        {/* Sección: Información básica */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Información básica
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Selecciona el deudor y define el monto del préstamo
            </p>
          </div>
          <FormField
            control={form.control}
            name="debtorId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Deudor</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    disabled={disabled || isLoadingDebtors}
                    value={field.value}>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Selecciona un deudor" />
                    </SelectTrigger>
                    <SelectContent>
                      {debtorOptions?.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No hay deudores disponibles
                        </div>
                      ) : (
                        debtorOptions?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Selecciona el deudor al que se le otorgará el préstamo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">Monto</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      {...field}
                      placeholder="0.00"
                      disabled={disabled}
                      value={field.value}
                      onChange={field.onChange}
                      onChangeValue={(value) =>
                        field.onChange(value?.toString())
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Monto total del préstamo en{" "}
                    {watchedValues.currency || "moneda"}
                  </FormDescription>
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
                        <SelectValue placeholder="Selecciona una moneda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                        <SelectItem value="USD">
                          USD - Dólar Estadounidense
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Moneda del préstamo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Sección: Fechas */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Fechas</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Define cuándo inicia el préstamo y cuándo será el primer pago
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Fecha de inicio
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      {...field}
                      onChange={field.onChange}
                      disabled={disabled}
                      value={field.value ? new Date(field.value) : undefined}
                    />
                  </FormControl>
                  <FormDescription>
                    Fecha en que se otorga el préstamo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstDueDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Primera fecha de pago
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      {...field}
                      onChange={field.onChange}
                      value={field.value ? new Date(field.value) : undefined}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Fecha del primer pago (debe ser igual o posterior a la fecha
                    de inicio)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Sección: Plan de pagos */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Plan de pagos
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Configura el número de cuotas y la frecuencia de pago
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="installmentsCount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Número de cuotas
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      step={1}
                      value={typeof field.value === "number" ? field.value : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={disabled}
                      className="h-11 transition-all"
                      placeholder="12"
                    />
                  </FormControl>
                  <FormDescription>Total de pagos a realizar</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Frecuencia
                  </FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={disabled}
                      value={field.value}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEEKLY">Semanal</SelectItem>
                        <SelectItem value="BIWEEKLY">Quincenal</SelectItem>
                        <SelectItem value="MONTHLY">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Cada cuánto tiempo se realizará el pago
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Sección: Interés */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Interés</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Configura el tipo y tasa de interés (opcional)
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="interestType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Tipo de interés
                  </FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={disabled}
                      value={field.value}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">Sin interés</SelectItem>
                        <SelectItem value="SIMPLE">Interés simple</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Tipo de interés a aplicar al préstamo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {interestType === "SIMPLE" && (
              <FormField
                control={form.control}
                name="interestRatePercent"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Tasa de interés (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        inputMode="decimal"
                        placeholder="5.00"
                        disabled={disabled}
                        className="h-11 transition-all"
                      />
                    </FormControl>
                    <FormDescription>
                      Porcentaje de interés por periodo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <Separator />

        {/* Sección: Notas */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Información adicional
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Agrega notas o comentarios sobre el préstamo (opcional)
            </p>
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  Notas (opcional)
                </FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Ej. Préstamo por reparación del auto"
                    disabled={disabled}
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </FormControl>
                <FormDescription>
                  Información adicional sobre el préstamo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Resumen del préstamo */}
        {loanSummary && (
          <>
            <Separator />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Resumen del préstamo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Monto total:
                  </span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(
                      loanSummary.totalAmount,
                      loanSummary.currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Número de cuotas:
                  </span>
                  <span className="text-sm font-medium">
                    {loanSummary.installments}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Monto por cuota:
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      loanSummary.installmentAmount,
                      loanSummary.currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Frecuencia:
                  </span>
                  <span className="text-sm font-medium">
                    {formatFrequency(loanSummary.frequency || "WEEKLY")}
                  </span>
                </div>
                {loanSummary.hasInterest && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Tasa de interés:
                    </span>
                    <span className="text-sm font-medium">
                      {loanSummary.interestRate.toFixed(2)}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <Button
          type="submit"
          disabled={disabled || loading}
          className="w-full h-11"
          size="lg">
          {labelButton}
        </Button>
      </form>
    </Form>
  );
}
