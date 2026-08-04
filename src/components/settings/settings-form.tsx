"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { updateOrganization } from "@/app/(dashboard)/settings/actions";

type Org = {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  gstin: string | null;
  stateCode: string | null;
  invoicePrefix: string;
  upiId: string | null;
};

export function SettingsForm({ organization }: { organization: Org }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const [failed, setFailed] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateOrganization(data);
      setFailed(Boolean(result?.error));
      setMessage(result?.error ?? "Settings saved.");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="app-panel p-5 sm:p-6">
        <div>
          <h2 className="font-semibold tracking-[-0.01em]">Business details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Displayed to clients on invoices and payment pages.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">
            Business name
            <Input name="name" required defaultValue={organization.name} className="mt-1.5" />
          </label>
          <label className="text-sm font-medium">
            Billing email
            <Input name="email" type="email" defaultValue={organization.email ?? ""} className="mt-1.5" />
          </label>
          <label className="text-sm font-medium">
            Phone
            <Input name="phone" defaultValue={organization.phone ?? ""} className="mt-1.5" />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Business address
            <Textarea name="address" defaultValue={organization.address ?? ""} className="mt-1.5" />
          </label>
        </div>
      </section>

      <section className="app-panel p-5 sm:p-6">
        <div>
          <h2 className="font-semibold tracking-[-0.01em]">Tax and payments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            GST registration and UPI details for client payments.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            GSTIN
            <Input
              name="gstin"
              defaultValue={organization.gstin ?? ""}
              className="mt-1.5"
              placeholder="27ABCDE1234F1Z5"
            />
            <span className="mt-1.5 block text-xs font-normal text-muted-foreground">
              15 characters. Leave blank if unregistered for GST.
            </span>
          </label>
          <label className="text-sm font-medium">
            State code
            <Input
              name="stateCode"
              defaultValue={organization.stateCode ?? ""}
              maxLength={2}
              className="mt-1.5"
              placeholder="27"
              inputMode="numeric"
            />
            <span className="mt-1.5 block text-xs font-normal text-muted-foreground">
              2 digits. Used to determine CGST+SGST vs IGST.
            </span>
          </label>
          <label className="text-sm font-medium">
            Invoice prefix
            <Input
              name="invoicePrefix"
              required
              defaultValue={organization.invoicePrefix}
              className="mt-1.5"
            />
            <span className="mt-1.5 block text-xs font-normal text-muted-foreground">
              Prepended to all invoice numbers, like INV-00042.
            </span>
          </label>
          <label className="text-sm font-medium">
            UPI ID
            <Input
              name="upiId"
              defaultValue={organization.upiId ?? ""}
              className="mt-1.5"
              placeholder="business@upi"
            />
            <span className="mt-1.5 block text-xs font-normal text-muted-foreground">
              Displayed as a QR code on client payment pages.
            </span>
          </label>
        </div>
      </section>

      {message && (
        failed ? (
          <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-200">
            {message} <span className="text-red-600 dark:text-red-300">Your edits have been kept.</span>
          </p>
        ) : (
          <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-200">
            {message}
          </p>
        )
      )}

      <Button disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
    </form>
  );
}
