"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/lib/validations";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  // Better Auth appends the token to the redirect target it was given.
  const token = params.get("token");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true);
    setError(undefined);

    // Same rules the sign-up schema declares, so a reset cannot be used to set a
    // weaker password than registration would have allowed.
    const parsed = resetPasswordSchema.safeParse({
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? "")
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the password.");
      setBusy(false);
      return;
    }
    if (!token) {
      setError("This reset link is missing its token. Request a new link.");
      setBusy(false);
      return;
    }

    const result = await authClient.resetPassword({ newPassword: parsed.data.password, token });
    setBusy(false);

    if (result.error) {
      setError(result.error.message ?? "This reset link is no longer valid. Request a new one.");
      return;
    }
    setDone(true);
  }

  if (!token) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl border border-amber-500/25 bg-amber-500/10">
          <ShieldAlert className="size-6 text-amber-300" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-white">This link is not usable</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Password reset links carry a one-time token. This one has none, which usually means it was truncated by an email client or already used.
        </p>
        <Link href="/forgot-password" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-zinc-300">
          Request a new link <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl border border-emerald-500/25 bg-emerald-500/10">
          <CheckCircle2 className="size-6 text-emerald-300" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-white">Password updated</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">You can now sign in with your new password.</p>
        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition hover:bg-zinc-100"
        >
          Go to sign in <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Choose a new password</h1>
        <p className="mt-2 text-sm text-zinc-400">At least 8 characters, with an uppercase letter, a lowercase letter, and a number.</p>
      </div>

      <form
        onSubmit={(event) => { event.preventDefault(); submit(new FormData(event.currentTarget)); }}
        className="mt-8 space-y-4"
      >
        <div>
          <label htmlFor="password" className="text-sm font-medium text-zinc-300">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            autoFocus
            placeholder="••••••••"
            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-300">Confirm new password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
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
          {busy ? "Updating…" : <>Update password <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <Link href="/" className="mb-12"><Logo className="text-white" /></Link>
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
            {/* useSearchParams needs a Suspense boundary to avoid opting the whole
                route out of static rendering. */}
            <Suspense fallback={<p className="text-center text-sm text-zinc-400">Loading…</p>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
