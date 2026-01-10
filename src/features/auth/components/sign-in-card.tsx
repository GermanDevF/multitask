import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Separator } from "@/components/ui/separator";
import { FormError } from "@/components/form-error";

import { PasswordInput } from "@/features/auth/components/password-input";
import { SignInFormData, signInSchema } from "@/features/auth/schemas/sign-in";
import { SignInFlow } from "@/features/auth/types";

const defaultValues: SignInFormData = {
  email: "",
  password: "",
};

interface SignInCardProps {
  onSignInFlowChange: (flow: SignInFlow) => void;
}

export const SignInCard = ({ onSignInFlowChange }: SignInCardProps) => {
  const authActions = useAuthActions();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues,
  });

  const handleProviderSignIn = (value: "google" | "github") => {
    startTransition(async () => {
      await authActions.signIn(value);
    });
  };

  const onPasswordSignIn = (data: SignInFormData) => {
    startTransition(() => {
      authActions
        .signIn("password", {
          email: data.email,
          password: data.password,
          flow: "signIn",
        })
        .catch(() => {
          setError("Invalid email or password");
        });
    });
  };

  return (
    <Card className="h-full w-full border-0 shadow-lg">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Iniciar sesión
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Ingresa tu email y contraseña para iniciar sesión
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <FormError error={error} />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onPasswordSignIn)}
            className="space-y-5">
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
                      placeholder="email@example.com"
                      type="email"
                      disabled={isPending}
                      className="h-11 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} className="h-11 transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-11 w-full text-base font-medium transition-all"
              disabled={isPending}>
              {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">
              O continuar con
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            disabled={isPending}
            className="group hover:bg-accent/50 relative h-11 w-full transition-all disabled:cursor-not-allowed disabled:opacity-50"
            size="lg"
            type="button"
            onClick={() => handleProviderSignIn("google")}>
            <FcGoogle className="absolute left-4 size-5" />
            <span className="ml-2">Continuar con Google</span>
          </Button>
          <Button
            variant="outline"
            disabled={isPending}
            className="group hover:bg-accent/50 relative h-11 w-full transition-all disabled:cursor-not-allowed disabled:opacity-50"
            size="lg"
            type="button"
            onClick={() => handleProviderSignIn("github")}>
            <FaGithub className="absolute left-4 size-5" />
            <span className="ml-2">Continuar con Github</span>
          </Button>
        </div>
      </CardContent>

      <div className="border-t px-6 pt-4 pb-6">
        <p className="text-muted-foreground text-center text-sm">
          No tienes una cuenta?{" "}
          <button
            type="button"
            className="text-primary focus:ring-primary rounded-sm font-medium transition-all hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
            onClick={() => onSignInFlowChange("signUp")}>
            Registrarse
          </button>
        </p>
      </div>
    </Card>
  );
};
