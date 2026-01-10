import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { FormError } from "@/components/form-error";
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

import { PasswordInput } from "@/features/auth/components/password-input";
import { SignUpFormData, signUpSchema } from "@/features/auth/schemas/sign-up";
import { SignInFlow } from "@/features/auth/types";
import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const defaultValues: SignUpFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

interface SignUpCardProps {
  onSignInFlowChange: (flow: SignInFlow) => void;
}

export const SignUpCard = ({ onSignInFlowChange }: SignUpCardProps) => {
  const { signIn } = useAuthActions();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });

  const onProviderSignUp = (value: "google" | "github") => {
    startTransition(async () => {
      try {
        await signIn(value, {
          flow: "signUp",
        });
      } catch {
        setError("Failed to sign up with provider");
      }
    });
  };

  const onPasswordSignUp = (data: SignUpFormData) => {
    startTransition(async () => {
      try {
        await signIn("password", {
          email: data.email,
          name: data.name,
          password: data.password,
          flow: "signUp",
        });
      } catch (error) {
        console.log(error);
        setError("Failed to sign up with password");
      }
    });
  };

  return (
    <Card className="h-full w-full border-0 shadow-lg">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Crear una cuenta
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Ingresa tu email y contraseña para crear una cuenta
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <FormError error={error} />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onPasswordSignUp)}
            className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
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
                    <PasswordInput
                      {...field}
                      className="h-11 transition-all"
                      disabled={isPending}
                      placeholder="********"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Confirmar contraseña
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      className="h-11 transition-all"
                      disabled={isPending}
                      placeholder="********"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-11 w-full text-base font-medium transition-all"
              disabled={isPending}>
              {isPending ? "Registrando..." : "Registrarse"}
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
            className="group hover:bg-accent/50 relative h-11 w-full transition-all"
            size="lg"
            type="button"
            disabled={isPending}
            onClick={() => onProviderSignUp("google")}>
            <FcGoogle className="absolute left-4 size-5" />
            <span className="ml-2">Continuar con Google</span>
          </Button>
          <Button
            variant="outline"
            className="group hover:bg-accent/50 relative h-11 w-full transition-all"
            size="lg"
            type="button"
            disabled={isPending}
            onClick={() => onProviderSignUp("github")}>
            <FaGithub className="absolute left-4 size-5" />
            <span className="ml-2">Continuar con Github</span>
          </Button>
        </div>
      </CardContent>

      <div className="border-t px-6 pt-4 pb-6">
        <p className="text-muted-foreground text-center text-sm">
          Ya tienes una cuenta?{" "}
          <button
            type="button"
            className="text-primary focus:ring-primary rounded-sm font-medium transition-all hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
            onClick={() => onSignInFlowChange("signIn")}>
            Iniciar sesión
          </button>
        </p>
      </div>
    </Card>
  );
};
