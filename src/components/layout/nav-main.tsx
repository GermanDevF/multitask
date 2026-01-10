"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

type NavMainProps = {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: NavMainProps["items"]; // Nested items for submenus
    params?: string;
  }[];
};

function normalizePath(path: string) {
  if (!path) return "/";
  if (path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

function buildHref(url: string, params?: string) {
  if (!params) return url;
  const trimmed = params.startsWith("?") ? params.slice(1) : params;
  return `${url}?${trimmed}`;
}

function toPathname(input: string): string {
  if (!input) return "/";

  // Si llega una URL absoluta, usamos el pathname real.
  if (input.startsWith("http://") || input.startsWith("https://")) {
    try {
      return normalizePath(new URL(input).pathname || "/");
    } catch {
      // Si no se puede parsear, seguimos con el fallback.
    }
  }

  // Quita query y hash, y asegura que tenga "/" al inicio.
  const withoutQueryOrHash = input.split(/[?#]/, 1)[0] ?? "/";
  const withLeadingSlash = withoutQueryOrHash.startsWith("/")
    ? withoutQueryOrHash
    : `/${withoutQueryOrHash}`;

  return normalizePath(withLeadingSlash);
}

function isPathActive(pathname: string, url: string): boolean {
  if (!url || url === "#") return false;

  const current = toPathname(pathname);
  const target = toPathname(url);

  // Evita que "/" marque todo como activo.
  if (target === "/") return current === "/";

  return current === target || current.startsWith(`${target}/`);
}

function isAnyChildActive(
  pathname: string,
  items?: NavMainProps["items"]
): boolean {
  if (!items?.length) return false;
  return items.some((child) => {
    if (isPathActive(pathname, child.url)) return true;
    return isAnyChildActive(pathname, child.items);
  });
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu className="flex flex-col gap-2">
        {items.map((item) => {
          const key = `${item.title}/${item.url}`.toLowerCase();
          const selfActive = isPathActive(pathname, item.url);
          const childActive = isAnyChildActive(pathname, item.items);
          const isActive = selfActive || childActive;

          if (item.items?.length) {
            return (
              <Collapsible
                key={key}
                asChild
                defaultOpen={isActive}
                className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      size="lg">
                      {item.icon && <item.icon className="size-5" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const subKey =
                          `${subItem.title}/${subItem.url}`.toLowerCase();
                        const subActive = isPathActive(pathname, subItem.url);
                        const subHref = buildHref(subItem.url, subItem.params);

                        return (
                          <SidebarMenuSubItem key={subKey}>
                            <SidebarMenuSubButton asChild isActive={subActive}>
                              <Link href={subHref}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          const href = buildHref(item.url, item.params);

          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                className="justify-start"
                tooltip={item.title}
                isActive={isActive}
                asChild>
                <Link href={href} className="flex items-center gap-2">
                  {item.icon && <item.icon className="size-5" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
