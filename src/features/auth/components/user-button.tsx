"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import { JSX, useCallback } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/features/auth/api/use-current-user";

/**
 * UserButton Component
 *
 * Componente que muestra el botón de usuario con su avatar y un menú desplegable
 * que permite ver información del usuario y cerrar sesión.
 *
 * @component
 * @example
 * ```tsx
 * <UserButton />
 * ```
 *
 * @features
 * - Muestra el avatar del usuario (imagen o iniciales como fallback)
 * - Menú desplegable con información del usuario
 * - Opción para cerrar sesión
 * - Estados de carga con skeleton
 * - Chiste escondido: haz clic 5 veces seguidas en el avatar para descubrirlo 🎭
 *
 * @accessibility
 * - Incluye atributos ARIA apropiados
 * - Soporte para navegación por teclado
 * - Etiquetas descriptivas para lectores de pantalla
 *
 * @returns {JSX.Element | null} El componente del botón de usuario o null si no hay usuario autenticado
 */
export const UserButton = (): JSX.Element | null => {
  const { signOut } = useAuthActions();
  const { user, isLoading } = useCurrentUser();

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return (
      <Skeleton
        className="size-10 rounded-full"
        aria-label="Cargando información del usuario"
      />
    );
  }

  // No mostrar nada si no hay usuario autenticado
  if (!user) {
    return null;
  }

  const { email, name, image } = user;

  // Generar iniciales para el fallback del avatar
  // Prioriza el nombre, luego el email
  const getInitials = (): string => {
    if (name) {
      const nameParts = name.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        return (
          nameParts[0][0] + nameParts[nameParts.length - 1][0]
        ).toUpperCase();
      }
      return name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const avatarFallback = getInitials();
  const displayName = name || email || "Usuario";
  const displayEmail = email || "Sin email";

  return (
    <div className="relative">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="focus-visible:ring-ring relative cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={`Menú de usuario: ${displayName}`}
          aria-haspopup="true">
          <Avatar className="ring-background hover:ring-primary/20 size-10 ring-2 transition-all duration-200 hover:scale-105 hover:opacity-80">
            <AvatarImage src={image || undefined} alt={displayName} />
            <AvatarFallback className="from-primary/20 to-primary/40 text-primary font-semibold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64"
          align="end"
          sideOffset={8}
          aria-label="Menú de usuario">
          <DropdownMenuLabel className="flex flex-col space-y-1 p-3">
            <div className="flex items-center gap-2">
              <UserIcon className="text-muted-foreground size-4" />
              <span className="truncate text-sm font-semibold">
                {displayName}
              </span>
            </div>
            <span className="text-muted-foreground truncate text-xs">
              {displayEmail}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            onClick={handleSignOut}
            aria-label="Cerrar sesión">
            <LogOut className="mr-2 size-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
