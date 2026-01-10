import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthPage = createRouteMatcher(["/auth", "/auth/:path*"]);
const isProtectedPage = createRouteMatcher(["/dashboard", "/dashboard/:path*"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const onAuthPage = isAuthPage(request);
  const onProtectedPage = isProtectedPage(request);

  // Evita llamadas innecesarias en rutas públicas (mejor performance).
  if (!onAuthPage && !onProtectedPage) return;

  const isAuthenticated = await convexAuth.isAuthenticated();

  // Si ya está logueado, no tiene sentido permanecer en /auth.
  if (onAuthPage && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }

  // Protege el dashboard: si no está logueado, manda al login.
  if (onProtectedPage && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
