"use client";
import { LogInIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ToggleTheme } from "@/components/toggle-theme";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Logo />

        <div className="flex items-center gap-3">
          <nav className="hidden text-sm text-muted-foreground sm:block">
            Gestiona tus deudas con claridad
          </nav>
          <ToggleTheme animationType="circle-spread" />
          {!isAuthPage && (
            <>
              <Button asChild>
                <Link href="/auth?flow=signIn">
                  <LogInIcon className="size-4" /> Iniciar sesión
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/auth?flow=signUp">
                  <UserPlusIcon className="size-4" /> Registrarse
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
