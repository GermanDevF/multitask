"use client";
import { LayoutDashboardIcon, UserIcon } from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Panel",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Deudores",
      url: "/debtors",
      icon: UserIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarHeader className="flex items-center gap-2">
          <Logo href="/dashboard" />
          <p className="text-lg font-medium tracking-tight">Debts</p>
        </SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
