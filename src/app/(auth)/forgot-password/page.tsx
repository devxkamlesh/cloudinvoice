"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true);
    setError(undefined);

    const email = String(formData.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setBusy(false);
      return;
    }

    const result = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setBusy(false);

    // Deliberately show the same confirmation whether or not the address exists.
    // Reporting "no such account" would turn this form into a way to discover which
    // email addresses are registered.
    if (result.error) {
      setError(result.error.message ?? "Could not start a password reset. Please try again.");
      return;
    }
    setSent(true);
  }

  return (
    <main className="relative min-h-screen bg-black">
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <Link href="/" className="mb-12"><Logo className="text-white" /></Link>

        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
            {sent ? (
              <div className="text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-xl border border-emerald-500/25 bg-emerald-500/10">
                  <MailCheck className="size-6 text-emerald-300" aria-hidden="true" />
                </span>
                <h1 className="mt-5 text-2xl font-bold text-white">Check your email</h1>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  If an account uses that address, a reset link is on its way. The link works once and expires in an hour.
                </p>
                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  Nothing arrived? Check spam, then confirm you used the address you signed up with.
                </p>
                <Link href="/sign-in" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-zinc-300">
                  <ArrowLeft className="size-4" aria-hidden="true" />Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-white">Reset your password</h1>
                  <p className="mt-2 text-sm text-zinc-400">
                    Enter the email address on your account and we will send a link to set a new password.
                  </p>
                </div>

                <form
                  onSubmit={(event) => { event.preventDefault(); submit(new FormData(event.currentTarget)); }}
                  className="mt-8 space-y-4"
                >
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      autoFocus
                      placeholder="you@company.com"
                      className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600"
                    />
                  </div>

                  {error && (
                    <div role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-60"
                  >
                    {busy ? "Sending…" : <>Send reset link <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-400">
                  Remembered it? <Link href="/sign-in" className="font-semibold text-white hover:text-zinc-300">Sign in</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
