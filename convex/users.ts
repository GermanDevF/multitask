import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Obtiene la información del usuario actualmente autenticado.
 * @returns {Promise<Object|null>} El usuario autenticado si existe, null si no está autenticado
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    return await ctx.db.get(userId);
  },
});
