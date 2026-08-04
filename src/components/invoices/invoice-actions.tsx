"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Ban, Check, Copy, Mail, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteInvoice, sendInvoice, voidInvoice } from "@/app/(dashboard)/invoices/actions";
import { PrintInvoice } from "@/components/invoices/print-invoice";
import { RecordPayment } from "@/components/invoices/record-payment";

type Confirm = "void" | "delete";

export function InvoiceActions({
  id,
  publicToken,
  balance,
  currency,
  status
}: {
  id: string;
  publicToken: string;
  balance: number;
  currency: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const [confirm, setConfirm] = useState<Confirm>();
  // Set only when both copy paths fail, so the link can still be copied manually.
  const [shareUrl, setShareUrl] = useState<string>();

  const isDraft = status === "DRAFT";
  const isVoid = status === "VOID";

  /**
   * Copy the client payment link.
   *
   * navigator.clipboard only exists in a secure context. This deployment is served over
   * plain HTTP on an IP address, so the modern API is simply undefined and the previous
   * implementation threw on click with no visible result. Falls back to the legacy
   * execCommand path, and if that is unavailable too, reveals the URL so it can be
   * copied by hand rather than failing silently.
   */
  const share = async () => {
    const url = `${window.location.origin}/pay/${publicToken}`;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setShareUrl(undefined);
        setMessage("Payment link copied");
        return;
      } catch {
        // Permission denied or blocked — drop through to the fallback.
      }
    }

    try {
      const field = document.createElement("textarea");
      field.value = url;
      // Keep it off-screen but still selectable; display:none would break the copy.
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(field);
      if (copied) {
        setShareUrl(undefined);
        setMessage("Payment link copied");
        return;
      }
    } catch {
      // Fall through to showing the link.
    }

    setMessage(undefined);
    setShareUrl(url);
  };

  const send = () => startTransition(async () => {
    const result = await sendInvoice(id);
    setMessage(result?.error ?? (result?.success ? "Invoice emailed" : "Could not send invoice"));
  });

  const doVoid = () => startTransition(async () => {
    const result = await voidInvoice(id);
    setMessage(result?.error ?? "Invoice voided");
    setConfirm(undefined);
  });

  // deleteInvoice does not redirect, so navigation is handled here after it resolves.
  const doDelete = () => startTransition(async () => {
    const result = await deleteInvoice(id);
    if (result?.error) {
      setMessage(result.error);
      setConfirm(undefined);
      return;
    }
    window.location.assign("/invoices");
  });

  // Nothing left to collect on a settled or cancelled invoice, so the entry point is
  // hidden rather than shown and then rejected by the server.
  const canRecordPayment = balance > 0 && !isVoid;

  // Intl gives us the locale-correct symbol instead of assuming a rupee sign, which
  // would be wrong for a workspace billing in another currency.
  const currencySymbol = new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 })
    .formatToParts(0)
    .find((part) => part.type === "currency")?.value ?? "";

  if (confirm) {
    const voiding = confirm === "void";
    return <div className="w-full max-w-md rounded-xl border border-amber-300 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">{voiding ? "Void this invoice?" : "Delete this draft?"}</p>
      <p className="mt-1 text-sm text-amber-800">
        {voiding
          ? "The invoice and its number are kept for your records, and the client payment page stops accepting payment. This cannot be undone."
          : "The draft and its line items are removed permanently. Sent invoices are voided instead so the record survives."}
      </p>
      <div className="mt-4 flex gap-2">
        <Button variant="destructive" disabled={pending} onClick={voiding ? doVoid : doDelete}>
          {pending ? "Working…" : voiding ? "Void invoice" : "Delete draft"}
        </Button>
        <Button variant="outline" disabled={pending} onClick={() => setConfirm(undefined)}>Cancel</Button>
      </div>
    </div>;
  }

  return <div className="flex flex-wrap gap-2">
    <PrintInvoice />
    <Button variant="outline" onClick={share}>
      {message === "Payment link copied" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      Share link
    </Button>

    {isDraft && <Button variant="outline" asChild>
      <Link href={`/invoices/${id}/edit`}><Pencil className="size-4" aria-hidden="true" />Edit</Link>
    </Button>}

    {canRecordPayment && <RecordPayment invoiceId={id} balance={balance} currencySymbol={currencySymbol} />}

    {!isVoid && <Button variant="outline" onClick={() => setConfirm("void")}>
      <Ban className="size-4" aria-hidden="true" />Void
    </Button>}

    {isDraft && <Button variant="outline" onClick={() => setConfirm("delete")}>
      <Trash2 className="size-4" aria-hidden="true" />Delete
    </Button>}

    {!isVoid && <Button disabled={pending} onClick={send}>
      <Mail className="size-4" aria-hidden="true" />{pending ? "Sending…" : "Send invoice"}
    </Button>}

    {message && <span aria-live="polite" className="basis-full text-xs text-muted-foreground">{message}</span>}

    {shareUrl && (
      <div className="basis-full rounded-xl border bg-muted/40 p-3">
        <label htmlFor="share-url" className="text-xs font-medium text-muted-foreground">
          Your browser blocked automatic copying. Select and copy this link:
        </label>
        <input
          id="share-url"
          readOnly
          value={shareUrl}
          onFocus={(event) => event.currentTarget.select()}
          className="mt-1.5 w-full rounded-lg border bg-card px-3 py-2 font-mono text-xs"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Clipboard access needs HTTPS, which this address does not use yet.
        </p>
      </div>
    )}
  </div>;
}
