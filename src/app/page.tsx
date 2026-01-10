import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  HandCoins,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

const stats = [
  {
    label: "Deudas activas",
    value: "3",
    icon: HandCoins,
  },
  {
    label: "Pagos del mes",
    value: "$1,250",
    icon: CreditCard,
  },
  {
    label: "Personas",
    value: "6",
    icon: Users,
  },
];

const features = [
  {
    title: "Saldos claros, sin Excel",
    description:
      "Ve cuánto debes, cuánto te deben y el saldo neto por persona, en un solo lugar.",
    icon: TrendingUp,
  },
  {
    title: "Pagos y recordatorios",
    description:
      "Registra pagos parciales y controla fechas para no olvidarte de nada.",
    icon: Calendar,
  },
  {
    title: "Privacidad primero",
    description:
      "Tus datos viven en tu app. Diseñado para ser simple, seguro y rápido.",
    icon: ShieldCheck,
  },
];

const steps = [
  {
    title: "Crea una deuda",
    description: "Añade monto, persona y una nota (opcional).",
  },
  {
    title: "Registra pagos",
    description:
      "Marca pagos parciales o totales para mantener el saldo al día.",
  },
  {
    title: "Revisa el resumen",
    description: "Consulta el total y quién está al día, en segundos.",
  },
];

function StatCard({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur supports-backdrop-filter:bg-card/40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-linear-to-br from-foreground/10 to-transparent blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-linear-to-br from-foreground/10 to-transparent blur-2xl" />
      </div>
      <div className="relative flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-background">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-3xl border bg-linear-to-b from-card to-background p-6 shadow-sm sm:p-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-linear-to-br from-foreground/10 to-transparent blur-2xl" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-linear-to-br from-foreground/10 to-transparent blur-2xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Home listo para convertir en dashboard
            </div>

            <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Controla deudas y pagos con claridad, sin esfuerzo.
                </h1>
                <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Un resumen simple para saber quién debe qué, cuánto pagó y
                  cuál es el saldo real. Diseñado para ser rápido y agradable de
                  usar.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/auth"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-sm transition hover:opacity-90">
                    Empezar ahora <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#como-funciona"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-card">
                    Ver cómo funciona
                  </a>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {stats.map(({ label, value, icon }) => (
                    <StatCard
                      key={label}
                      label={label}
                      value={value}
                      Icon={icon}
                    />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border bg-background p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Resumen rápido</p>
                    <span className="rounded-full border bg-card px-2 py-0.5 text-xs text-muted-foreground">
                      Demo
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border bg-card p-3">
                      <p className="text-xs text-muted-foreground">
                        Total por cobrar
                      </p>
                      <p className="mt-1 text-lg font-semibold tracking-tight">
                        $2,980
                      </p>
                    </div>
                    <div className="rounded-xl border bg-card p-3">
                      <p className="text-xs text-muted-foreground">
                        Total por pagar
                      </p>
                      <p className="mt-1 text-lg font-semibold tracking-tight">
                        $1,730
                      </p>
                    </div>
                    <div className="rounded-xl border bg-card p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Próximo pago
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            15 Ene · $250 a Juan
                          </p>
                        </div>
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map(({ title, description, icon }) => (
            <FeatureCard
              key={title}
              title={title}
              description={description}
              Icon={icon}
            />
          ))}
        </section>

        <section id="como-funciona" className="rounded-3xl border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Cómo funciona
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tres pasos para tener todo ordenado.
              </p>
            </div>
          </div>

          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((s, idx) => (
              <li
                key={s.title}
                className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-card text-sm font-semibold">
                    {idx + 1}
                  </div>
                  <p className="font-medium">{s.title}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Siguiente paso: convertir esto en tu dashboard con datos reales.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-card">
              Continuar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
