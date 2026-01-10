"use client";

import { SignInCard } from "@/features/auth/components/sign-in-card";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { SignInFlow } from "@/features/auth/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const AuthScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const flowParam = searchParams.get("flow");

  const signInFlow: SignInFlow = flowParam === "signUp" ? "signUp" : "signIn";

  const handleSignInFlowChange = (nextFlow: SignInFlow) => {
    if (nextFlow === signInFlow) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("flow", nextFlow);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative flex w-full flex-1 items-center justify-center py-10">
      <div className="w-full max-w-md">
        {signInFlow === "signIn" && (
          <SignInCard onSignInFlowChange={handleSignInFlowChange} />
        )}
        {signInFlow === "signUp" && (
          <SignUpCard onSignInFlowChange={handleSignInFlowChange} />
        )}
      </div>
    </div>
  );
};
