import { ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
export function Logo({ className }: { className?: string }) { return <span className={cn("inline-flex items-center gap-2 font-bold tracking-tight", className)}><span className="grid size-8 place-items-center rounded-lg bg-primary text-white"><ReceiptText className="size-4" /></span>CloudInvoice</span>; }
