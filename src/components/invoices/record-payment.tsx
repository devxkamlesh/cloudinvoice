"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { BanknoteArrowUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recordPayment } from "@/app/(dashboard)/invoices/actions";

// Mirrors manualPaymentMethods in lib/validations.ts. STRIPE is absent by design:
// card payments are only ever created by the verified webhook.
const METHODS = [
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" }
] as const;

const REFERENCE_HINT: Record<string, string> = {
  UPI: "UPI reference or UTR number",
  BANK_TRANSFER: "Bank reference or NEFT/RTGS number",
  CASH: "Receipt number, if you issued one",
  OTHER: "Any reference that identifies this payment"
};

export function RecordPayment({ invoiceId, balance, currencySymbol }: { invoiceId: string; balance: number; currencySymbol: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [method, setMethod] = useState<string>("UPI");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // Escape to dismiss, focus into the first field on open, focus back to the trigger
  // on close. A modal that traps a keyboard user is worse than no modal.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    amountRef.current?.focus();
    amountRef.current?.select();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    setError(undefined);
    triggerRef.current?.focus();
  }

  /**
   * onSubmit with preventDefault rather than the `action` prop: React resets an
   * uncontrolled form once a form action resolves, including when it returns a
   * validation error. With `action={...}` a rejected amount also erased the payment
   * date and reference the user had already filled in.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await recordPayment(formData);
      if (result?.error) {
        setError(result.error);
        return; // Keep what was typed.
      }
      setError(undefined);
      form.reset();
      setOpen(false);
      triggerRef.current?.focus();
    });
  }

  if (!open) {
    return <Button ref={triggerRef} variant="outline" onClick={() => setOpen(true)}>
      <BanknoteArrowUp className="size-4" aria-hidden="true" />Record payment
    </Button>;
  }

  return <div role="dialog" aria-modal="true" aria-labelledby="record-payment-title" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
    <form onSubmit={onSubmit} className="surface w-full max-w-lg rounded-2xl p-6">
      <input type="hidden" name="invoiceId" value={invoiceId} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="record-payment-title" className="text-lg font-semibold">Record a payment</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            For money received outside card checkout — UPI, bank transfer, or cash. Card payments are recorded automatically.
          </p>
        </div>
        <button type="button" onClick={close} className="rounded-lg p-1.5 hover:bg-muted" aria-label="Close">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Amount received
          <Input
            ref={amountRef}
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={balance}
            defaultValue={balance.toFixed(2)}
            required
            className="mt-1.5"
            aria-describedby="amount-hint"
          />
          <span id="amount-hint" className="mt-1.5 block text-xs font-normal text-muted-foreground">
            {currencySymbol}{balance.toFixed(2)} outstanding. You cannot record more than this.
          </span>
        </label>

        <label className="text-sm font-medium">
          Payment date
          <Input name="paidAt" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="mt-1.5" />
        </label>

        <label className="text-sm font-medium">
          Method
          <select
            name="method"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            className="mt-1.5 h-10 w-full rounded-xl border bg-transparent px-3 text-sm"
          >
            {METHODS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label className="text-sm font-medium">
          Reference <span className="font-normal text-muted-foreground">(optional)</span>
          <Input name="reference" className="mt-1.5" placeholder={REFERENCE_HINT[method]} aria-describedby="reference-hint" />
          <span id="reference-hint" className="mt-1.5 block text-xs font-normal text-muted-foreground">
            The only audit trail a manual payment has. Worth filling in.
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error} <span className="text-red-600">Your entries have been kept.</span>
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={close}>Cancel</Button>
        <Button disabled={pending}>{pending ? "Recording…" : "Record payment"}</Button>
      </div>
    </form>
  </div>;
}
