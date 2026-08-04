"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";
import { authSignInSchema, authSignUpSchema } from "@/lib/validations";
import { ArrowRight } from "lucide-react";

type ValidationErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string>();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [busy, setBusy] = useState(false);

  // Validates against the shared Zod schemas rather than a hand-rolled copy. The
  // previous inline checks only tested password length, so sign-up silently accepted
  // passwords the declared schema was written to reject.
  function validateForm(input: { name?: string; email: string; password: string }): boolean {
    const result = mode === "signup"
      ? authSignUpSchema.safeParse({ name: input.name ?? "", email: input.email, password: input.password })
      : authSignInSchema.safeParse({ email: input.email, password: input.password });

    if (result.success) {
      setValidationErrors({});
      return true;
    }

    const errors: ValidationErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "password") {
        errors[field] ??= issue.message;
      }
    }
    setValidationErrors(errors);
    return false;
  }

  async function submit(form: FormData) {
    setBusy(true);
    setError(undefined);
    setValidationErrors({});
    
    const input = {
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
      name: String(form.get("name") || "").trim(),
    };
    
    if (!validateForm(input)) {
      setBusy(false);
      return;
    }
    
    const result =
      mode === "signin"
        ? await authClient.signIn.email({ email: input.email, password: input.password })
        : await authClient.signUp.email(input);
    
    setBusy(false);
    if (result.error) return setError(result.error.message ?? "We could not sign you in.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen bg-black">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <Link href="/" className="mb-12">
          <Logo className="text-white" />
        </Link>

        {/* Auth Card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">
                {mode === "signin" ? "Welcome back" : "Create account"}
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                {mode === "signin"
                  ? "Sign in to your CloudInvoice workspace"
                  : "Start managing invoices in minutes"}
              </p>
            </div>

            <form
              action={submit}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                submit(formData);
              }}
              className="mt-8 space-y-4"
            >
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-medium text-zinc-300">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className={`mt-2 block w-full rounded-lg border ${
                      validationErrors.name
                        ? "border-red-500 bg-red-500/10"
                        : "border-zinc-700 bg-zinc-800"
                    } px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600`}
                  />
                  {validationErrors.name && (
                    <p className="mt-1.5 text-xs text-red-400">{validationErrors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-zinc-300">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={`mt-2 block w-full rounded-lg border ${
                    validationErrors.email
                      ? "border-red-500 bg-red-500/10"
                      : "border-zinc-700 bg-zinc-800"
                  } px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600`}
                />
                {validationErrors.email && (
                  <p className="mt-1.5 text-xs text-red-400">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label className="text-sm font-medium text-zinc-300">Password</label>
                  {mode === "signin" && (
                    <Link href="/forgot-password" className="text-xs font-medium text-zinc-400 transition hover:text-white">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  className={`mt-2 block w-full rounded-lg border ${
                    validationErrors.password
                      ? "border-red-500 bg-red-500/10"
                      : "border-zinc-700 bg-zinc-800"
                  } px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600`}
                />
                {validationErrors.password && (
                  <p className="mt-1.5 text-xs text-red-400">{validationErrors.password}</p>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-100 hover:scale-105 disabled:pointer-events-none disabled:opacity-60"
              >
                {busy ? (
                  "Please wait..."
                ) : mode === "signin" ? (
                  <>
                    Sign in
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-400">
                {mode === "signin" ? "Don\u2019t have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setError(undefined);
                    setValidationErrors({});
                  }}
                  className="font-semibold text-white transition hover:text-zinc-300"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-400">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
