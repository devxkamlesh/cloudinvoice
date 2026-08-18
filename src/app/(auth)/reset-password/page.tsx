"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { resetPasswordSchema } from "@/lib/validations";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Review the password fields."); return; }
    if (!token) { setError("This reset link is missing its token."); return; }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, newPassword: password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to reset the password.");
      setIsSuccess(true); setTimeout(() => router.push("/sign-in"), 1800);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to reset the password."); }
    finally { setIsLoading(false); }
  }

  const passwordInput = (id: string, label: string, value: string, setValue: (value: string) => void, shown: boolean, setShown: (value: boolean) => void) => <div><label htmlFor={id} className="text-sm font-medium">{label}</label><div className="relative mt-1.5"><LockKeyhole className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id={id} type={shown ? "text" : "password"} value={value} onChange={(event) => setValue(event.target.value)} autoComplete="new-password" required disabled={isLoading} className="h-11 w-full rounded-lg border bg-card px-10 pe-11 text-sm outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-2 focus:ring-primary/10" placeholder={label} /><button type="button" onClick={() => setShown(!shown)} aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute end-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">{shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>;

  let panel;
  if (!token) panel = <><span className="grid size-12 place-items-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300"><KeyRound className="size-6" /></span><p className="mt-7 font-mono text-xs font-semibold uppercase tracking-[.14em] text-primary">Invalid reset link</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em]">Request a new password link.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">This link is missing its reset token. Request a new link from the account recovery page.</p><Link href="/forgot-password" className="mt-7 inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-white">Request new link <ArrowRight className="size-4" /></Link></>;
  else if (isSuccess) panel = <><span className="grid size-12 place-items-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="size-6" /></span><p className="mt-7 font-mono text-xs font-semibold uppercase tracking-[.14em] text-primary">Password updated</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em]">Your new password is ready.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">The reset link has been used and cannot be reused. Redirecting to sign in.</p></>;
  else panel = <><p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-primary">Set new password</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em]">Choose a strong account password.</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Use at least eight characters with an uppercase letter, lowercase letter, and number.</p><form onSubmit={handleSubmit} className="mt-8 space-y-4">{passwordInput("new-password","New password",password,setPassword,showPassword,setShowPassword)}{passwordInput("confirm-password","Confirm password",confirmPassword,setConfirmPassword,showConfirmPassword,setShowConfirmPassword)}{error && <div role="alert" className="rounded-lg border border-red-500/25 bg-red-500/[.07] p-3 text-sm text-red-700 dark:text-red-300">{error}</div>}<button type="submit" disabled={isLoading} className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-white transition-[opacity,transform] hover:opacity-85 active:scale-[.96] disabled:opacity-60">{isLoading ? "Updating..." : "Update password"}<ArrowRight className="size-4" /></button></form><Link href="/sign-in" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to sign in</Link></>;

  return <main className="min-h-screen bg-background text-foreground"><header className="flex h-16 items-center justify-between border-b px-4 sm:px-6 lg:px-8"><Link href="/" aria-label="CloudInvoice home"><Logo /></Link><ThemeToggle /></header><div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[.8fr_1.2fr]"><section className="hidden border-e bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14"><div><p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-white/65">Secure password update</p><h1 className="mt-7 max-w-lg font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.03] tracking-[-.045em]">One link. One password change.</h1><p className="mt-6 max-w-lg leading-8 text-white/72">A valid reset link is time-limited and removed after use. The new password is stored as a secure hash, not as readable text.</p></div><ul className="space-y-4 text-sm">{["The reset link is single use", "Existing account data remains unchanged", "Support never receives the new password"].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-sm bg-white text-primary"><Check className="size-3.5" /></span>{item}</li>)}</ul></section><section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12"><div className="w-full max-w-md">{panel}</div></section></div></main>;
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Loading reset form...</main>}><ResetPasswordContent /></Suspense>;
}
