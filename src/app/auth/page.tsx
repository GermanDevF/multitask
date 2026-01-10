import { AuthScreen } from "@/features/auth/components/auth-screen";
import { AppShell } from "@/components/layout/app-shell";

function AuthPage() {
  return (
    <AppShell>
      <AuthScreen />
    </AppShell>
  );
}

export default AuthPage;
