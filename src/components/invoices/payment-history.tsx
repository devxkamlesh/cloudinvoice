"use client";

import { useState, useTransition } from "react";
import { CreditCard, Landmark, Loader2, QrCode, Trash2, Wallet } from "lucide-react";
import { deletePayment } from "@/app/(dashboard)/invoices/actions";
import { formatDate, money } from "@/lib/utils";

// Serialisable shape. Prisma Decimal and Date cannot cross the server/client boundary,
// so the page converts them to string before passing them in.
export type PaymentRow = {
  id: string;
  amount: string;
  currency: string;
  method: string;
  status: string;
  reference: string | null;
  paidAt: string | null;
  createdAt: string;
};

const METHOD_META: Record<string, { label: string; icon: typeof Wallet }> = {
  STRIPE: { label: "Card via Stripe", icon: CreditCard },
  UPI: { label: "UPI", icon: QrCode },
  BANK_TRANSFER: { label: "Bank transfer", icon: Landmark },
  CASH: { label: "Cash", icon: Wallet },
  OTHER: { label: "Other", icon: Wallet }
};

export function PaymentHistory({ payments }: { payments: PaymentRow[] }) {
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string>();
  const [error, setError] = useState<string>();
  const [confirmId, setConfirmId] = useState<string>();

  function remove(id: string) {
    setBusyId(id);
    setError(undefined);
    startTransition(async () => {
      const result = await deletePayment(id);
      if (result?.error) setError(result.error);
      setBusyId(undefined);
      setConfirmId(undefined);
    });
  }

  if (payments.length === 0) {
    return <div className="border-t p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payments</p>
      <p className="mt-2 text-sm text-muted-foreground">
        No payments recorded yet. Card payments appear here automatically once confirmed; UPI, bank transfers, and cash need recording.
      </p>
    </div>;
  }

  return <div className="border-t p-6">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payments</p>

    <ul role="list" className="mt-3 divide-y">
      {payments.map((payment) => {
        const meta = METHOD_META[payment.method] ?? METHOD_META.OTHER;
        const Icon = meta.icon;
        const isStripe = payment.method === "STRIPE";
        const removing = pending && busyId === payment.id;

        return <li key={payment.id} className="flex flex-wrap items-center gap-3 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              {money(payment.amount, payment.currency)}
              <span className="ml-2 font-normal text-muted-foreground">{meta.label}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
              {payment.reference && <> · Ref {payment.reference}</>}
              {payment.status !== "SUCCEEDED" && <> · {payment.status.toLowerCase()}</>}
            </p>
          </div>

          {isStripe
            ? <span className="text-xs text-muted-foreground">Verified by webhook</span>
            : confirmId === payment.id
              ? <span className="flex items-center gap-2">
                  <button type="button" onClick={() => remove(payment.id)} disabled={removing} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
                    {removing && <Loader2 className="size-3 animate-spin" aria-hidden="true" />}
                    {removing ? "Removing…" : "Confirm"}
                  </button>
                  <button type="button" onClick={() => setConfirmId(undefined)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                    Cancel
                  </button>
                </span>
              : <button
                  type="button"
                  onClick={() => setConfirmId(payment.id)}
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${meta.label} payment of ${money(payment.amount, payment.currency)}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>}
        </li>;
      })}
    </ul>

    {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
  </div>;
}
