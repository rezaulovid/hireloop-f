
"use client";

import * as React from "react";

import { AuthForm, AuthFormData } from "@/components/auth-form";
import { authClient } from "@/lib/auth-client";

function getSignUpErrorMessage(error: {
  message?: string | null;
  status?: number;
}): string {
  const isDuplicateEmail =
    error.status === 422 ||
    error.message?.toLowerCase().includes("already exists");

  if (isDuplicateEmail) {
    return "An account with this email already exists. Try signing in instead.";
  }

  return error.message || "Unable to create your account. Please try again.";
}

export default function SignUpPage() {
  const [error, setError] = React.useState<string | null>(null);

  const handleSignUp = async (data: AuthFormData) => {
    setError(null);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: data.name as string,
        email: data.email,
        password: data.password,
        callbackURL: "/",
        role: data.role,
      });

      if (signUpError) {
        setError(getSignUpErrorMessage(signUpError));
        return;
      }

      // The sign-up response sets the session cookie. Navigate with a full
      // page load so the homepage is requested fresh with that cookie —
      // the client-side router can otherwise show a stale render and the
      // session is never picked up.
      window.location.assign("/");
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
