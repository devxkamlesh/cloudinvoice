"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ResetPasswordForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Redirect to sign in after 2 seconds
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-50 to-purple-50 p-5">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-8 shadow-xl text-center">
          <h1 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h1>
          <p className="mt-3 text-sm text-gray-600">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="mt-6 inline-block">
            <Button>Request New Reset Link</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-50 to-purple-50 p-5">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Password reset successfully!</h1>
            <p className="mt-3 text-sm text-gray-600">
              Your password has been changed. Redirecting to sign in...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-50 to-purple-50 p-5">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Set new password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={isLoading}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={isLoading}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
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
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
