"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";
import { authSignInSchema, authSignUpSchema } from "@/lib/validations";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

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
    <main className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <Link href="/" className="mb-8">
          <Logo />
        </Link>

        {/* Auth Card */}
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl p-8 shadow-2xl shadow-blue-500/10">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {mode === "signin" ? "Welcome back" : "Get started"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {mode === "signin"
                  ? "Sign in to your CloudInvoice workspace"
                  : "Create your account in seconds"}
              </p>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="mt-6 flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(undefined);
                  setValidationErrors({});
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  mode === "signin"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(undefined);
                  setValidationErrors({});
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  mode === "signup"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                submit(formData);
              }}
              className="mt-8 space-y-5"
            >
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Full name</label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className={`block w-full rounded-xl border ${
                        validationErrors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white"
                      } py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-2 text-xs text-red-600">{validationErrors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Email address</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={`block w-full rounded-xl border ${
                      validationErrors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-white"
                    } py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-2 text-xs text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  {mode === "signin" && (
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    className={`block w-full rounded-xl border ${
                      validationErrors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-white"
                    } py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-2 text-xs text-red-600">{validationErrors.password}</p>
                )}
                {mode === "signup" && !validationErrors.password && (
                  <p className="mt-2 text-xs text-gray-500">
                    At least 8 characters with uppercase, lowercase, and number
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Please wait...
                  </span>
                ) : (
                  <>
                    {mode === "signin" ? "Sign in" : "Create account"}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 transition hover:text-gray-900">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
