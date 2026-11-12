
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import type { AuthFormData } from "@/lib/types";
import { authClient } from "@/lib/auth-client";

function SignInForm() {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Where to send the user after signing in — guarded flows (e.g. Apply
  // Now) pass the page they were on so the user lands back there.
  const redirectTo = searchParams.get("redirectTo") || "/";

  const handleSignIn = async (data: AuthFormData) => {
    setError(null);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
        callbackURL: "/",
      });

      if (signInError) {
        setError(
          signInError.message ||
            "Invalid email or password. Please try again."
        );
        return;
      }

      // The sign-in response sets the session cookie. Refresh re-renders
      // server components with that cookie and clears the router cache,
      // so the destination page shows the fresh session, not a stale one.
      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      console.error("Signin error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <AuthForm
      mode="signin"
      onSubmit={handleSignIn}
      error={error}
    />
  );
}

export default function SignInPage() {
  // useSearchParams needs a Suspense boundary during static prerendering.
  return (
    <React.Suspense fallback={null}>
      <SignInForm />
    </React.Suspense>
  );
}
