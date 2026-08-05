"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email,
          redirectTo: "/reset-password",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-50 to-purple-50 p-5">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <Mail className="size-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
            <p className="mt-3 text-sm text-gray-600">
              We&apos;ve sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <Link href="/sign-in" className="mt-6">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="size-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-50 to-purple-50 p-5">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Sign In
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forgot password?</h1>
          <p className="mt-2 text-sm text-gray-600">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send reset instructions"}
          </Button>
        </form>
      </div>
    </main>
  );
}
