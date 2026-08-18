"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Mail, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); setIsLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send reset instructions.");
      setIsSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to send reset instructions.");
    } finally { setIsLoading(false); }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6 lg:px-8"><Link href="/" aria-label="CloudInvoice home"><Logo /></Link><ThemeToggle /></header>
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[.8fr_1.2fr]">
        <section className="hidden border-e bg-muted/55 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div><p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-primary">Account recovery</p><h1 className="mt-7 max-w-lg font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.03] tracking-[-.045em]">A reset link, sent only to your account email.</h1><p className="mt-6 max-w-lg leading-8 text-muted-foreground">The link expires after one hour and can be used once. CloudInvoice never asks you to send a password through email or support.</p></div>
          <ul className="space-y-4 text-sm">{["One-hour link expiry", "Single-use verification token", "The response does not reveal whether an account exists"].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-sm bg-primary text-white"><Check className="size-3.5" /></span>{item}</li>)}</ul>
        </section>
        <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link href="/sign-in" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to sign in</Link>
            {isSuccess ? <div className="mt-10"><span className="grid size-12 place-items-center rounded-lg bg-primary/10 text-primary"><Mail className="size-6" /></span><p className="mt-7 font-mono text-xs font-semibold uppercase tracking-[.14em] text-primary">Check your inbox</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em]">If the account exists, the reset email is on its way.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">We sent instructions to <span className="font-semibold text-foreground">{email}</span> when it matched a CloudInvoice account. Check spam before requesting another link.</p><Link href="/sign-in" className="mt-7 inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-white">Return to sign in <ArrowRight className="size-4" /></Link></div> : <><div className="mt-10"><p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-primary">Forgot password</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em]">Request a secure reset link.</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Enter the email used for your CloudInvoice account. For privacy, the result is the same whether or not the address is registered.</p></div><form onSubmit={handleSubmit} className="mt-8"><label htmlFor="recovery-email" className="text-sm font-medium">Account email</label><div className="relative mt-1.5"><Mail className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required disabled={isLoading} placeholder="name@company.com" className="h-11 w-full rounded-lg border bg-card px-10 text-sm outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-2 focus:ring-primary/10" /></div>{error && <div role="alert" className="mt-4 rounded-lg border border-red-500/25 bg-red-500/[.07] p-3 text-sm text-red-700 dark:text-red-300">{error}</div>}<button type="submit" disabled={isLoading} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-white transition-[opacity,transform] hover:opacity-85 active:scale-[.96] disabled:opacity-60">{isLoading ? "Sending..." : "Send reset link"}<ArrowRight className="size-4" /></button></form><p className="mt-6 flex gap-2 text-xs leading-6 text-muted-foreground"><ShieldCheck className="mt-1 size-4 shrink-0 text-primary" />Support will never ask for your password or reset token.</p></>}
          </div>
        </section>
      </div>
    </main>
  );
}
