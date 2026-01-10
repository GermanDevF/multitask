import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />

      <main className="flex flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
