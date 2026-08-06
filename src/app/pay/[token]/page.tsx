import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { PaymentOptions } from "@/components/payments/payment-options";
import { Logo } from "@/components/ui/logo";
import { formatDate, money } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PayInvoicePage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ payment?: string }> }) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  
  const invoice = await prisma.invoice.findUnique({
    where: { publicToken: token },
    include: { organization: true, client: true, items: true }
  });

  if (!invoice) notFound();

  // Mark as viewed
  if (!invoice.viewedAt && invoice.status === "SENT") {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: "VIEWED", viewedAt: new Date() }
    });
  }

  const balance = Number(invoice.total) - Number(invoice.amountPaid);
  const paid = balance <= 0;

  // Generate UPI QR code
  const upi = invoice.organization.upiId
    ? `upi://pay?pa=${encodeURIComponent(invoice.organization.upiId)}&pn=${encodeURIComponent(invoice.organization.name)}&am=${balance.toFixed(2)}&cu=${invoice.currency}&tn=${encodeURIComponent(invoice.invoiceNumber)}`
    : null;

  const upiQr = upi
    ? await QRCode.toDataURL(upi, {
        width: 200,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" }
      })
    : null;

  const templateClass =
    invoice.template === "midnight"
      ? "bg-slate-950 text-slate-50 border-slate-700"
      : invoice.template === "modern"
      ? "border-primary/25 shadow-xl shadow-primary/5"
      : "";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 p-4 shadow-sm">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-200">
              <ShieldCheck className="size-3.5" />
              Secure Payment
            </span>
          </div>
        </div>

        {/* Success Message */}
        {query.payment === "success" && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-100 p-2">
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">Payment Successful!</h3>
                <p className="mt-1 text-sm text-emerald-700">
                  Your payment has been processed. You will receive a confirmation email shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled Message */}
        {query.payment === "cancelled" && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 shadow-sm">
            <p className="text-sm text-amber-800">
              Payment was cancelled. Your invoice is still available below.
            </p>
          </div>
        )}

        {/* Main Invoice Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-200/60">
          {/* Invoice Header */}
          <div className={`p-6 sm:p-9 ${templateClass}`}>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Invoice from
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  {invoice.organization.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                  <span>•</span>
                  <span>Due {formatDate(invoice.dueDate)}</span>
                </div>
              </div>

              {paid ? (
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-white shadow-md">
                  <CheckCircle2 className="size-5" />
                  <span className="font-semibold">Paid in Full</span>
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">Amount Due</p>
                  <p className="mt-1 text-4xl font-bold text-primary">
                    {money(balance, invoice.currency)}
                  </p>
                </div>
              )}
            </div>

            {/* Invoice Items */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="space-y-3">
                {invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-muted-foreground">
                        Qty: {item.quantity.toString()} × {money(item.unitPrice.toString(), invoice.currency)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {money(item.total.toString(), invoice.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between border-t-2 border-slate-300 pt-5">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold">
                {money(invoice.total.toString(), invoice.currency)}
              </span>
            </div>
          </div>

          {/* Payment Section */}
          {!paid && (
            <div className="bg-gradient-to-b from-slate-50 to-white p-6 sm:p-9 border-t border-slate-200">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold">Complete Your Payment</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose your preferred secure payment method
                </p>
              </div>

              <PaymentOptions token={token} currency={invoice.currency} />

              {/* UPI QR Code */}
              {upiQr && (
                <div className="mt-8 rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center">
                  <h3 className="font-semibold text-slate-900">
                    Scan & Pay with UPI
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Use any UPI app to scan and pay instantly
                  </p>
                  <Image
                    className="mx-auto mt-4 rounded-lg border-2 border-slate-200 bg-white p-2 shadow-sm"
                    src={upiQr}
                    alt={`UPI QR code to pay ${invoice.organization.name}`}
                    width={200}
                    height={200}
                    unoptimized
                  />
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Amount: {money(balance, invoice.currency)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Questions about this invoice?{" "}
            <a
              href={`mailto:${invoice.organization.email || "support@cloudinvoice.co.in"}`}
              className="font-medium text-primary hover:underline"
            >
              Contact {invoice.organization.email || invoice.organization.name}
            </a>
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Powered by <span className="font-semibold">CloudInvoice</span> • Secure
            Payment Processing
          </p>
        </div>
      </div>
    </main>
  );
}
