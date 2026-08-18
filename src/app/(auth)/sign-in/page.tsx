"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { authSignInSchema, authSignUpSchema } from "@/lib/validations";

const benefits = ["Create GST-ready invoices", "Save client billing details", "Download PDFs or share private links"];

type Mode = "signin" | "signup";
type ValidationErrors = { name?: string; email?: string; password?: string };

function GoogleMark() {
  return <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.38l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.39 13.92A6.02 6.02 0 0 1 6.08 12c0-.67.11-1.32.31-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.53l3.35-2.61Z"/><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z"/></svg>;
}

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const oauthError = searchParams.get("error");
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState<string | undefined>(oauthError ? "Google sign-in could not be completed. Try again or use email and password." : undefined);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getProviders()
      .then((providers) => setGoogleAvailable(Boolean(providers?.google)))
      .catch(() => setGoogleAvailable(false));
  }, []);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError(undefined);
    setValidationErrors({});
  }

  function validateForm(input: { name?: string; email: string; password: string }) {
    const result = mode === "signup"
      ? authSignUpSchema.safeParse({ name: input.name ?? "", email: input.email, password: input.password })
      : authSignInSchema.safeParse({ email: input.email, password: input.password });
    if (result.success) { setValidationErrors({}); return true; }
    const errors: ValidationErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "password") errors[field] ??= issue.message;
    }
    setValidationErrors(errors);
    return false;
  }

  async function submit(form: FormData) {
    setBusy(true); setError(undefined); setValidationErrors({});
    const input = { email: String(form.get("email")).trim(), password: String(form.get("password")), name: String(form.get("name") || "").trim() };
    if (!validateForm(input)) { setBusy(false); return; }
    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
        const data = await response.json();
        if (!response.ok) { setBusy(false); setError(data.error || "Unable to create the account."); return; }
      }
      const result = await signIn("credentials", { email: input.email, password: input.password, redirect: false, callbackUrl });
      if (result?.error) { setBusy(false); setError("The email or password is incorrect."); return; }
      window.location.assign(result?.url || callbackUrl);
    } catch {
      setBusy(false); setError("The request could not be completed. Please try again.");
    }
  }

  async function continueWithGoogle() {
    setGoogleBusy(true); setError(undefined);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      setGoogleBusy(false); setError("Google sign-in is not available right now. Use email and password instead.");
    }
  }

  const inputClass = (invalid?: string) => `h-11 w-full rounded-lg border bg-card px-10 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/10 ${invalid ? "border-red-500" : "border-border"}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="CloudInvoice home"><Logo /></Link>
        <div className="flex items-center gap-2"><span className="hidden text-xs text-muted-foreground sm:inline">Free during early access</span><ThemeToggle /></div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[.92fr_1.08fr]">
        <section className="hidden border-e bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="max-w-xl"><p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-white/65">CloudInvoice workspace</p><h1 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.02] tracking-[-.045em] xl:text-6xl">Create the invoice. Keep the payment clear.</h1><p className="mt-6 max-w-lg text-base leading-8 text-white/72">Set up your business once, create GST-ready invoices, and give each client a private page to review and pay.</p></div>
          <div className="max-w-lg border-t border-white/25 pt-8"><ul className="space-y-4">{benefits.map((benefit) => <li key={benefit} className="flex items-center gap-3 text-sm"><span className="grid size-6 place-items-center rounded-sm bg-white text-primary"><Check className="size-3.5" /></span>{benefit}</li>)}</ul><p className="mt-9 text-xs leading-6 text-white/55">CloudInvoice is an MSME registered in India. Udyam Registration No. UDYAM-RJ-17-0675217.</p></div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-primary">{mode === "signin" ? "Welcome back" : "Create your workspace"}</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em]">{mode === "signin" ? "Sign in to CloudInvoice" : "Start invoicing for free"}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{mode === "signin" ? "Open your invoices, clients, and payment overview." : "Create the account first. Business details come next during onboarding."}</p>

            <div className="mt-8 grid grid-cols-2 border-b" role="tablist" aria-label="Authentication mode">
              {(["signin", "signup"] as const).map((value) => <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => switchMode(value)} className={`relative min-h-11 px-4 text-sm font-semibold transition-colors duration-150 ${mode === value ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{value === "signin" ? "Sign in" : "Create account"}{mode === value && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}</button>)}
            </div>

            {googleAvailable && <><button type="button" onClick={continueWithGoogle} disabled={googleBusy || busy} className="mt-7 flex h-11 w-full items-center justify-center gap-3 rounded-lg border bg-card text-sm font-semibold transition-[background-color,transform] duration-150 hover:bg-muted active:scale-[.96] disabled:pointer-events-none disabled:opacity-60"><GoogleMark />{googleBusy ? "Opening Google..." : mode === "signin" ? "Continue with Google" : "Sign up with Google"}</button><div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-border" /><span className="text-[11px] uppercase tracking-[.12em] text-muted-foreground">or use email</span><span className="h-px flex-1 bg-border" /></div></>}

            <form onSubmit={(event) => { event.preventDefault(); submit(new FormData(event.currentTarget)); }} className="space-y-4">
              {mode === "signup" && <div><label htmlFor="auth-name" className="text-sm font-medium">Full name</label><div className="relative mt-1.5"><UserRound className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id="auth-name" name="name" type="text" autoComplete="name" required placeholder="Your name" className={inputClass(validationErrors.name)} /></div>{validationErrors.name && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{validationErrors.name}</p>}</div>}
              <div><label htmlFor="auth-email" className="text-sm font-medium">Email address</label><div className="relative mt-1.5"><Mail className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id="auth-email" name="email" type="email" autoComplete="email" required placeholder="name@company.com" className={inputClass(validationErrors.email)} /></div>{validationErrors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{validationErrors.email}</p>}</div>
              <div><div className="flex items-center justify-between"><label htmlFor="auth-password" className="text-sm font-medium">Password</label>{mode === "signin" && <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>}</div><div className="relative mt-1.5"><LockKeyhole className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id="auth-password" name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} required placeholder="Enter your password" className={`${inputClass(validationErrors.password)} pe-11`} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute end-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>{validationErrors.password ? <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{validationErrors.password}</p> : mode === "signup" && <p className="mt-1.5 text-xs text-muted-foreground">Use 8 or more characters with uppercase, lowercase, and a number.</p>}</div>

              {error && <div role="alert" className="rounded-lg border border-red-500/25 bg-red-500/[.07] p-3 text-sm text-red-700 dark:text-red-300">{error}</div>}

              <button type="submit" disabled={busy || googleBusy} className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-white transition-[opacity,transform] duration-150 hover:opacity-85 active:scale-[.96] disabled:pointer-events-none disabled:opacity-60">{busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}{!busy && <ArrowRight className="size-4" />}</button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">By continuing, you agree to the <Link href="/terms" className="text-foreground underline underline-offset-4">Terms</Link> and acknowledge the <Link href="/privacy" className="text-foreground underline underline-offset-4">Privacy Policy</Link>.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Loading sign in...</main>}><SignInContent /></Suspense>;
}
