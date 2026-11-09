
"use client";

import * as React from "react";

import { AuthForm, AuthFormData } from "@/components/auth-form";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [error, setError] = React.useState<string | null>(null);

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

      // The sign-in response sets the session cookie. Navigate with a full
      // page load so the homepage is requested fresh with that cookie —
      // the client-side router can otherwise show a stale render and the
      // session is never picked up.
      window.location.assign("/");
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
