import { TaxMode } from "@prisma/client";

export type InvoiceLineInput = { description: string; hsnSac?: string; quantity: number; unitPrice: number; discount?: number; taxRate: number };

export function calculateInvoice(lines: InvoiceLineInput[], taxMode: TaxMode) {
  const normalized = lines.map((line) => {
    const base = Math.max(0, line.quantity * line.unitPrice - (line.discount ?? 0));
    const tax = base * (line.taxRate / 100);
    return { ...line, base, tax, total: base + tax, cgst: taxMode === "INTRA_STATE" ? tax / 2 : 0, sgst: taxMode === "INTRA_STATE" ? tax / 2 : 0, igst: taxMode === "INTER_STATE" ? tax : 0 };
  });
  return {
    lines: normalized,
    subtotal: normalized.reduce((sum, line) => sum + line.base, 0),
    taxAmount: normalized.reduce((sum, line) => sum + line.tax, 0),
    total: normalized.reduce((sum, line) => sum + line.total, 0)
  };
}
