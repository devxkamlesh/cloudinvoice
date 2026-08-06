"use client";
import { useMutation } from "@tanstack/react-query";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ token }: { token: string }) {
  const checkout = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url)
        throw new Error(data.error ?? "Could not start secure checkout.");
      return data.url;
    },
    onSuccess: (url) => window.location.assign(url),
  });

  return (
    <>
      <Button
        className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
        size="lg"
        onClick={() => checkout.mutate()}
        disabled={checkout.isPending}
      >
        {checkout.isPending ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="size-4 mr-2" />
            Pay with Card
            <CreditCard className="size-4 ml-2" />
          </>
        )}
      </Button>
      {checkout.error && (
        <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3">
          <p role="alert" className="text-sm text-red-700 text-center">
            {checkout.error.message}
          </p>
        </div>
      )}
    </>
  );
}
