"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { invoiceSchema } from "@/lib/validations";
import { createInvoice, updateInvoice } from "@/app/(dashboard)/invoices/actions";

type FormValues = z.input<typeof invoiceSchema>;

/** Prefilled values when editing. Dates arrive as yyyy-mm-dd strings for date inputs. */
export type InvoiceFormDefaults = {
  id: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  taxMode: "INTRA_STATE" | "INTER_STATE";
  template: "classic" | "modern" | "midnight";
  notes: string;
  terms: string;
  items: { description: string; hsnSac?: string; quantity: number; unitPrice: number; discount: number; taxRate: number }[];
};

export function InvoiceForm({
  clients,
  defaultTaxMode,
  existing
}: {
  clients: { id: string; name: string }[];
  defaultTaxMode: "INTRA_STATE" | "INTER_STATE";
  existing?: InvoiceFormDefaults;
}) {
  const isEdit = Boolean(existing);
  const [error, setError] = useState<string>();

  const form = useForm<FormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: existing
      ? {
          clientId: existing.clientId,
          issueDate: existing.issueDate as unknown as Date,
          dueDate: existing.dueDate as unknown as Date,
          taxMode: existing.taxMode,
          template: existing.template,
          items: existing.items,
          notes: existing.notes,
          terms: existing.terms
        }
      : {
          clientId: clients[0]?.id ?? "",
          issueDate: new Date().toISOString().slice(0, 10) as unknown as Date,
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10) as unknown as Date,
          taxMode: defaultTaxMode,
          template: "classic",
          items: [{ description: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 18 }],
          notes: "",
          terms: "Payment due within 14 days."
        }
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const items = form.watch("items");
  const taxMode = form.watch("taxMode");

  const calculated = items.reduce((sum, item) => {
    const base = Math.max(0, Number(item.quantity || 0) * Number(item.unitPrice || 0) - Number(item.discount || 0));
    return { base: sum.base + base, tax: sum.tax + base * Number(item.taxRate || 0) / 100 };
  }, { base: 0, tax: 0 });

  async function submit(values: FormValues) {
    setError(undefined);
    try {
      // Both actions redirect on success, so nothing after this runs on the happy path.
      if (existing) await updateInvoice({ ...values, id: existing.id });
      else await createInvoice(values);
    } catch (cause) {
      // A redirect throws a control-flow error that must be rethrown, or navigation
      // would be swallowed and the user would see a spurious failure message.
      if (cause && typeof cause === "object" && "digest" in cause && String(cause.digest).startsWith("NEXT_REDIRECT")) throw cause;
      setError(cause instanceof Error ? cause.message : "Could not save this invoice.");
    }
  }

  if (!clients.length) {
    return <div className="surface rounded-2xl p-8 text-center">
      <p className="font-semibold">Add a client first</p>
      <p className="mt-1 text-sm text-muted-foreground">An invoice needs a billing recipient.</p>
      <Button asChild className="mt-5"><a href="/clients">Go to clients</a></Button>
    </div>;
  }

  return <form onSubmit={form.handleSubmit(submit)} className="grid gap-6 xl:grid-cols-[1fr_360px]">
    <div className="space-y-6">
      <section className="app-panel p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold tracking-[-0.01em]">Invoice details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Client, dates, and tax mode.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium sm:col-span-3">Bill to<select className="mt-1.5 h-10 w-full rounded-xl border bg-transparent px-3 text-sm" {...form.register("clientId")}><option value="">Select a client</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
          <label className="text-sm font-medium">Issue date<Input type="date" className="mt-1.5" {...form.register("issueDate")} /></label>
          <label className="text-sm font-medium">Due date<Input type="date" className="mt-1.5" {...form.register("dueDate")} /></label>
          <label className="text-sm font-medium">Tax type<select className="mt-1.5 h-10 w-full rounded-xl border bg-transparent px-3 text-sm" {...form.register("taxMode")}><option value="INTRA_STATE">Intra-state (CGST + SGST)</option><option value="INTER_STATE">Inter-state (IGST)</option></select></label>
          <label className="text-sm font-medium sm:col-span-3">Invoice template<select className="mt-1.5 h-10 w-full rounded-xl border bg-transparent px-3 text-sm" {...form.register("template")}><option value="classic">Classic - professional clarity</option><option value="modern">Modern - contemporary confidence</option><option value="midnight">Midnight - bold and memorable</option></select></label>
        </div>
        {form.formState.errors.clientId && <p className="mt-3 text-sm text-red-600">Select a client.</p>}
        {form.formState.errors.dueDate && <p className="mt-3 text-sm text-red-600">{form.formState.errors.dueDate.message}</p>}
      </section>

      <section className="surface overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-semibold">Line items</h2>
            <p className="mt-1 text-sm text-muted-foreground">Taxes are calculated per item.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 18 })}><Plus className="size-3.5" aria-hidden="true" />Add item</Button>
        </div>
        <div className="overflow-x-auto border-t">
          <div className="min-w-[780px] p-5 sm:p-6">
            <div className="grid grid-cols-[minmax(220px,1fr)_80px_110px_95px_75px_38px] gap-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"><span>Description</span><span>Qty</span><span>Rate</span><span>Discount</span><span>GST</span><span /></div>
            {fields.map((field, index) => <div key={field.id} className="grid grid-cols-[minmax(220px,1fr)_80px_110px_95px_75px_38px] gap-2 py-2">
              <Input aria-label="Item description" placeholder="Service or product" {...form.register(`items.${index}.description`)} />
              <Input aria-label="Quantity" type="number" min="0.01" step="0.01" {...form.register(`items.${index}.quantity`, { valueAsNumber: true })} />
              <Input aria-label="Unit price" type="number" min="0" step="0.01" {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })} />
              <Input aria-label="Discount" type="number" min="0" step="0.01" {...form.register(`items.${index}.discount`, { valueAsNumber: true })} />
              <Input aria-label="GST rate" type="number" min="0" max="100" step="0.01" {...form.register(`items.${index}.taxRate`, { valueAsNumber: true })} />
              <button type="button" disabled={fields.length === 1} onClick={() => remove(index)} className="grid place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:opacity-30" aria-label="Remove item"><Trash2 className="size-4" aria-hidden="true" /></button>
            </div>)}
            {form.formState.errors.items && <p className="mt-2 text-sm text-red-600">{form.formState.errors.items.message}</p>}
          </div>
        </div>
      </section>

      <section className="app-panel p-5 sm:p-6">
        <h2 className="font-semibold tracking-[-0.01em]">Notes and terms</h2>
        <p className="mt-1 text-sm text-muted-foreground">Additional context for your client.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Notes<Textarea className="mt-1.5" placeholder="Thanks for your business." {...form.register("notes")} /></label>
          <label className="text-sm font-medium">Payment terms<Textarea className="mt-1.5" {...form.register("terms")} /></label>
        </div>
      </section>
    </div>

    <aside className="app-panel sticky top-20 h-fit p-5 sm:p-6">
      <h2 className="font-semibold tracking-[-0.01em]">Invoice total</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>₹{calculated.base.toFixed(2)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">{taxMode === "INTRA_STATE" ? "CGST + SGST" : "IGST"}</dt><dd>₹{calculated.tax.toFixed(2)}</dd></div>
        <div className="border-t pt-4"><div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>₹{(calculated.base + calculated.tax).toFixed(2)}</dd></div></div>
      </dl>

      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <Button type="submit" className="mt-6 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Save changes" : "Create invoice")}
      </Button>
      <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
        {isEdit ? "Only drafts can be edited. Sending is a separate step." : "This starts as a draft. Review and email it when ready."}
      </p>
    </aside>
  </form>;
}
