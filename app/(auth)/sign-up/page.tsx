
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { AuthForm, AuthFormData } from "@/components/auth-form";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [error, setError] = React.useState<string | null>(null);

  const handleSignUp = async (data: AuthFormData) => {
    setError(null);

    try {
      const { data: signUpResponse, error: signUpError } =
        await authClient.signUp.email({
          name: data.name as string,
          email: data.email,
          password: data.password,
          callbackURL: "/",
          role: data.role,
        });

      console.log("Signup response:", signUpResponse);

      if (signUpError) {
        setError(
          signUpError.message ||
            "Unable to create your account. Please try again."
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <AuthForm
      mode="signup"
      onSubmit={handleSignUp}
      error={error}
    />
  );
}
