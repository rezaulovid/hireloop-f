
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { AuthForm, AuthFormData } from "@/components/auth-form";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [error, setError] = React.useState<string | null>(null);

  const handleSignIn = async (data: AuthFormData) => {
    setError(null);

    try {
      const { data: signInResponse, error: signInError } =
        await authClient.signIn.email({
          email: data.email,
          password: data.password,
          rememberMe: true,
          callbackURL: "/",
        });

      console.log("Signin response:", signInResponse);

      if (signInError) {
        setError(
          signInError.message ||
            "Invalid email or password. Please try again."
        );
        return;
      }

      router.replace("/");
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
