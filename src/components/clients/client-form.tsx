"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createClient } from "@/app/(dashboard)/clients/actions";

export function ClientForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    firstFieldRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    setError(undefined);
    triggerRef.current?.focus();
  }

  /**
   * Submitted via onSubmit with preventDefault rather than the `action` prop.
   *
   * React resets an uncontrolled form once a form action resolves, which happens even
   * when the action returns a validation error. With `action={...}` a rejected GSTIN or
   * state code wiped every field and the user had to retype the whole client. Handling
   * the submit ourselves means the form is only cleared on success.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const result = await createClient(data);
      if (result?.error) {
        setError(result.error);
        return; // Values stay exactly as typed.
      }
      setError(undefined);
      form.reset();
      setOpen(false);
      triggerRef.current?.focus();
    });
  }

  return <>
    <Button ref={triggerRef} onClick={() => setOpen(true)}>
      <Plus className="size-4" aria-hidden="true" />New client
    </Button>

    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-client-title"
        className="surface max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="new-client-title" className="text-lg font-semibold">Add a client</h2>
            <p className="mt-1 text-sm text-muted-foreground">Their details can be reused on every invoice.</p>
          </div>
          <button type="button" onClick={close} className="rounded-lg p-1.5 hover:bg-muted" aria-label="Close">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">
            Client name
            <Input ref={firstFieldRef} name="name" required className="mt-1.5" />
          </label>
          <label className="text-sm font-medium">
            Email
            <Input name="email" type="email" className="mt-1.5" />
          </label>
          <label className="text-sm font-medium">
            Phone
            <Input name="phone" className="mt-1.5" />
          </label>
          <label className="text-sm font-medium">
            GSTIN
            <Input name="gstin" className="mt-1.5" placeholder="27ABCDE1234F1Z5" aria-describedby="gstin-hint" />
            <span id="gstin-hint" className="mt-1.5 block text-xs font-normal text-muted-foreground">
              15 characters. Leave blank if the client is unregistered.
            </span>
          </label>
          <label className="text-sm font-medium">
            State code
            <Input name="stateCode" className="mt-1.5" placeholder="27" maxLength={2} inputMode="numeric" />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Billing address
            <Textarea name="billingAddress" className="mt-1.5" />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Internal notes
            <Textarea name="notes" className="mt-1.5" />
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error} <span className="text-red-600">Your entries have been kept.</span>
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={close}>Cancel</Button>
          <Button disabled={pending}>{pending ? "Saving…" : "Save client"}</Button>
        </div>
      </form>
    </div>}
  </>;
}
