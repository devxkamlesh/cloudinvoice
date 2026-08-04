"use client";

import { useState, useTransition } from "react";
import { Loader2, ShieldMinus, ShieldPlus, UserCheck, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setPlatformRole, suspendUser, unsuspendUser } from "@/app/admin/actions";

type Pending = "suspend" | "restore" | "promote" | "demote";

/**
 * Per-user admin controls.
 *
 * Every state-changing option requires a second confirming click that names the
 * account and states the effect. The server re-validates all of it — self-suspension,
 * self-demotion, and last-admin demotion are refused there regardless of what this UI
 * allows — so this is a guard against slips, not the security boundary.
 */
export function UserRowActions({
  userId,
  name,
  isSelf,
  isAdmin,
  isSuspended
}: {
  userId: string;
  name: string;
  isSelf: boolean;
  isAdmin: boolean;
  isSuspended: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState<Pending>();
  const [error, setError] = useState<string>();

  // An admin cannot act on their own account at all, so nothing is offered.
  if (isSelf) {
    return <span className="text-xs text-muted-foreground">Your account</span>;
  }

  function run(action: Pending) {
    setError(undefined);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("userId", userId);

      let result: { error?: string; success?: boolean };
      if (action === "suspend") result = await suspendUser(formData);
      else if (action === "restore") result = await unsuspendUser(formData);
      else {
        formData.set("role", action === "promote" ? "ADMIN" : "USER");
        result = await setPlatformRole(formData);
      }

      if (result?.error) setError(result.error);
      setConfirm(undefined);
    });
  }

  const COPY: Record<Pending, { question: string; confirm: string }> = {
    suspend: { question: `Suspend ${name}?`, confirm: "Suspend" },
    restore: { question: `Restore access for ${name}?`, confirm: "Restore" },
    promote: { question: `Give ${name} full platform admin access?`, confirm: "Make admin" },
    demote: { question: `Remove platform admin access from ${name}?`, confirm: "Remove admin" }
  };

  if (confirm) {
    return (
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium">{COPY[confirm].question}</span>
        <Button size="sm" variant="destructive" disabled={pending} onClick={() => run(confirm)}>
          {pending && <Loader2 className="size-3 animate-spin" aria-hidden="true" />}
          {pending ? "Working…" : COPY[confirm].confirm}
        </Button>
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => setConfirm(undefined)}>Cancel</Button>
      </span>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {isSuspended ? (
        <Button size="sm" variant="outline" onClick={() => setConfirm("restore")}>
          <UserCheck className="size-3.5" aria-hidden="true" />Restore
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setConfirm("suspend")}>
          <UserMinus className="size-3.5" aria-hidden="true" />Suspend
        </Button>
      )}

      {isAdmin ? (
        <Button size="sm" variant="ghost" onClick={() => setConfirm("demote")}>
          <ShieldMinus className="size-3.5" aria-hidden="true" />Remove admin
        </Button>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => setConfirm("promote")}>
          <ShieldPlus className="size-3.5" aria-hidden="true" />Make admin
        </Button>
      )}

      {error && <span role="alert" className="basis-full text-xs text-red-600">{error}</span>}
    </span>
  );
}
