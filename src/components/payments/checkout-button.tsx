"use client";
import { useMutation } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ token }: { token: string }) { const checkout = useMutation({ mutationFn: async () => { const response = await fetch("/api/payments/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }); const data = await response.json() as { url?: string; error?: string }; if (!response.ok || !data.url) throw new Error(data.error ?? "Could not start secure checkout."); return data.url; }, onSuccess: (url) => window.location.assign(url) }); return <><Button className="mt-5 w-full" size="lg" onClick={() => checkout.mutate()} disabled={checkout.isPending}><CreditCard className="size-4" />{checkout.isPending ? "Opening secure checkout…" : "Pay securely by card"}</Button>{checkout.error && <p role="alert" className="mt-3 text-center text-sm text-red-600">{checkout.error.message}</p>}</>; }
