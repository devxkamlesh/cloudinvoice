"use client";

import { IndianRupee, ShieldCheck } from "lucide-react";
import { RazorpayCheckoutButton } from "./razorpay-checkout-button";

export function PaymentOptions({ token, currency }: { token: string; currency: string }) {
  if (currency !== "INR") {
    return <div className="rounded-xl border border-amber-300/40 bg-amber-50 p-5 text-sm leading-6 text-amber-900">Online checkout is currently available for INR invoices through Razorpay. Contact the invoice sender for another payment method.</div>;
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-[0_16px_40px_-34px_rgba(15,23,42,.45)] sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><IndianRupee className="size-5" /></span>
        <div><h3 className="font-semibold">Pay securely with Razorpay</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Choose UPI, an Indian card, or NetBanking in Razorpay Checkout.</p></div>
      </div>
      <div className="mt-5"><RazorpayCheckoutButton token={token} /></div>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" />Payment details are entered on Razorpay Checkout.</p>
    </div>
  );
}
