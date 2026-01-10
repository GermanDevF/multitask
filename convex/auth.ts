import Github from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { DataModel } from "./_generated/dataModel";
import { ConvexError } from "convex/values";
import { z } from "zod";

/**
 * Esquema de validación para emails.
 * Actualmente permite cualquier email válido (la restricción de dominio está comentada).
 */
const EmailSchema = z.email();

/**
 * Esquema de validación para contraseñas.
 * Requiere: mínimo 8 caracteres, al menos un número, una letra minúscula y una letra mayúscula.
 */
const PasswordSchema = z
  .string()
  .min(8)
  .regex(/[0-9]/)
  .regex(/[a-z]/)
  .regex(/[A-Z]/)
  .refine(
    (password) => {
      return (
        password.length >= 8 &&
        /\d/.test(password) &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password)
      );
    },
    {
      message:
        "Password must be at least 8 characters long and contain at least one number, one lowercase letter, and one uppercase letter",
    }
  );

/**
 * Proveedor de autenticación personalizado con contraseña.
 * Valida el formato del email y los requisitos de la contraseña antes de crear el perfil.
 */
const CustomPassword = Password<DataModel>({
  profile(params) {
    const { error } = EmailSchema.safeParse(params.email);
    if (error) throw new ConvexError(z.treeifyError(error));
    return {
      name: params.name as string,
      email: params.email as string,
    };
  },
  validatePasswordRequirements: (password: string) => {
    const { error } = PasswordSchema.safeParse(password);
    if (error) throw new ConvexError(z.treeifyError(error));
  },
});

/**
 * Configuración de autenticación de Convex.
 * Incluye proveedores: GitHub, Google y autenticación con contraseña personalizada.
 *
 * @exports {Object} auth - Objeto de autenticación con rutas HTTP
 * @exports {Function} signIn - Función para iniciar sesión
 * @exports {Function} signOut - Función para cerrar sesión
 * @exports {Function} store - Función para almacenar sesiones
 * @exports {Function} isAuthenticated - Función para verificar autenticación
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Github, Google, CustomPassword],
});
