"use client";
import { useState, useTransition } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendInvoice } from "@/app/(dashboard)/invoices/actions";
import { PrintInvoice } from "@/components/invoices/print-invoice";

export function InvoiceActions({ id, publicToken }: { id: string; publicToken: string }) { const [pending, startTransition] = useTransition(); const [message, setMessage] = useState<string>(); const share = async () => { await navigator.clipboard.writeText(`${window.location.origin}/pay/${publicToken}`); setMessage("Payment link copied"); }; const send = () => startTransition(async () => { const result = await sendInvoice(id); setMessage(result?.error ?? (result?.success ? "Invoice emailed" : "Could not send invoice")); }); return <div className="flex flex-wrap gap-2"><PrintInvoice /><Button variant="outline" onClick={share}>{message === "Payment link copied" ? <Check className="size-4" /> : <Copy className="size-4" />}Share link</Button><Button disabled={pending} onClick={send}><Mail className="size-4" />{pending ? "Sending…" : "Send invoice"}</Button>{message && <span aria-live="polite" className="basis-full text-xs text-muted-foreground">{message}</span>}</div>; }
