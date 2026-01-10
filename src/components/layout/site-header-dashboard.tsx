import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { ToggleTheme } from "@/components/toggle-theme";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4"
        />

        <Link href="/dashboard" className="text-sm font-medium tracking-tight">
          Dashboard
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <ToggleTheme animationType="circle-spread" />
        </div>
      </div>
    </header>
  );
}
