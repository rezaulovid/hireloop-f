
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
  Users,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type AuthMode = "signin" | "signup";

export type UserRole = "seeker" | "recruiter" | "admin";

export type AuthFormData = {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
};

const COPY = {
  signin: {
    title: "Welcome back",
    subtitle: "Sign in to continue your job hunt.",
    submitLabel: "Sign In",
    showName: false,
    footer: "New to HireLoop?",
    footerLinkHref: "/sign-up",
    footerLinkLabel: "Create an account",
  },
  signup: {
    title: "Create your account",
    subtitle: "Three minutes to set up. Matches start arriving today.",
    submitLabel: "Sign Up",
    showName: true,
    footer: "Already have an account?",
    footerLinkHref: "/sign-in",
    footerLinkLabel: "Sign in",
  },
} as const;

const inputClass =
  "h-12 w-full rounded-lg border border-white/10 bg-[#1A1A1F] pl-10 pr-3 text-base tracking-[-0.0125rem] text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)] outline-none transition-colors placeholder:text-white/60 focus:border-[#5C53FE]/60 focus:ring-2 focus:ring-[#5C53FE]/30 aria-invalid:border-destructive/60";

const labelClass = "mb-2 block text-left text-sm text-[#EDEDEF]/80";

const ROLES: {
  value: UserRole;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "seeker", label: "Job Seeker", icon: Users },
  { value: "recruiter", label: "Recruiter", icon: User },
  { value: "admin", label: "Admin", icon: Shield },
];

const rolePillClass =
  "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-sm tracking-[-0.0125rem] transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#5C53FE]/60";

export function AuthForm({
  mode,
  onSubmit,
  error,
}: {
  mode: AuthMode;
  onSubmit?: (data: AuthFormData) => Promise<void> | void;
  error?: string | null;
}) {
  const copy = COPY[mode];
  const isSignup = mode === "signup";

  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [values, setValues] = React.useState<AuthFormData>({
    email: "",
    password: "",
    name: "",
    role: "seeker",
  });

  const setField =
    (field: keyof AuthFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const data: AuthFormData = {
      email: values.email.trim(),
      password: values.password,
      ...(isSignup
        ? {
            name: values.name?.trim(),
            role: values.role,
          }
        : {}),
    };

    try {
      setLoading(true);
      await onSubmit?.(data);
    } catch (err) {
      console.error("Authentication error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10 text-white">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-950/40 blur-[110px]" />

      <div className="relative z-10 w-full max-w-[400px]">

        {/* HireLoop Logo */}
        <Link href="/" className="mb-7 flex justify-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-blue-500">hire</span>
            <span className="text-orange-500">l</span>
            <span className="relative inline-block text-blue-400">
              o
              <span className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-orange-500" />
            </span>
            <span className="text-orange-500">op</span>
          </h1>
        </Link>

        {/* Authentication Card */}
        <div className="w-full rounded-2xl border border-white/10 bg-[#101010]/95 p-6 shadow-[inset_0_3px_10px_rgba(255,255,255,0.06)] sm:p-8">

          {/* Heading */}
          <div className="mb-6 flex flex-col gap-2 text-center">
            <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
              {copy.title}
            </h1>

            <p className="text-sm leading-[1.6] text-white/70">
              {copy.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Role Selection */}
            {isSignup && (
              <fieldset>
                <legend className={labelClass}>
                  Joining HireLoop as
                </legend>

                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map(({ value, label, icon: Icon }) => {
                    const selected = values.role === value;

                    return (
                      <label
                        key={value}
                        className={cn(
                          rolePillClass,
                          selected
                            ? "border-[#5C53FE] bg-[#5C53FE]/15 text-white"
                            : "border-white/10 bg-[#1A1A1F] text-white/70 hover:border-white/25 hover:text-white"
                        )}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={value}
                          checked={selected}
                          onChange={() =>
                            setValues((prev) => ({
                              ...prev,
                              role: value,
                            }))
                          }
                          className="sr-only"
                        />

                        <Icon aria-hidden className="size-5" />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Full Name */}
            {isSignup && (
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>

                <div className="relative">
                  <User
                    aria-hidden
                    className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-white/50"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={80}
                    value={values.name ?? ""}
                    onChange={setField("name")}
                    placeholder="Jane Doe"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>

              <div className="relative">
                <Mail
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-white/50"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={setField("email")}
                  placeholder="you@example.com"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                {!isSignup && (
                  <Link
                    href="/forgot-password"
                    className="mb-2 text-xs text-[#8B85FF] transition-colors hover:text-white"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>

              <div className="relative">
                <Lock
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-white/50"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  required
                  minLength={8}
                  maxLength={72}
                  value={values.password}
                  onChange={setField("password")}
                  placeholder={
                    isSignup ? "At least 8 characters" : "Your password"
                  }
                  disabled={loading}
                  className={cn(inputClass, "pr-11")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/50 transition-colors hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden className="size-4" />
                  ) : (
                    <Eye aria-hidden className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-[48px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#5C53FE] text-base font-medium text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors hover:bg-[#7B74FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isSignup ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                copy.submitLabel
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <p className="mt-6 text-center text-sm text-white/70">
            {copy.footer}{" "}
            <Link
              href={copy.footerLinkHref}
              className="font-semibold text-[#8B85FF] transition-colors hover:text-white"
            >
              {copy.footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
