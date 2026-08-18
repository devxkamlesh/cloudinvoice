import { z } from "zod";

const optionalText = z.string().trim().max(500).optional().or(z.literal(""));
export const clientSchema = z.object({
  name: z.string().trim().min(2, "Enter a client name").max(120),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: optionalText, billingAddress: optionalText,
  gstin: z.string().trim().toUpperCase().regex(/^[0-9A-Z]{15}$/, "Enter a valid 15-character GSTIN").optional().or(z.literal("")),
  stateCode: z.string().trim().regex(/^\d{2}$/, "Use a two digit state code").optional().or(z.literal("")), notes: optionalText
});

// Kept as a bare object so the edit schema can extend it. Applying .refine() produces
// a wrapped schema that can no longer be extended, so the refinement is applied to
// each exported variant instead of to the shared base.
const invoiceBase = z.object({
  clientId: z.string().cuid(), issueDate: z.coerce.date(), dueDate: z.coerce.date(),
  taxMode: z.enum(["INTRA_STATE", "INTER_STATE"]), template: z.enum(["classic", "modern", "midnight", "editorial", "ledger"]), notes: optionalText, terms: optionalText,
  items: z.array(z.object({ description: z.string().trim().min(1).max(500), hsnSac: z.string().trim().max(20).optional(), quantity: z.coerce.number().positive(), unitPrice: z.coerce.number().nonnegative(), discount: z.coerce.number().nonnegative().default(0), taxRate: z.coerce.number().min(0).max(100) })).min(1)
});

const dueDateNotBeforeIssue = (data: { issueDate: Date; dueDate: Date }) => data.dueDate >= data.issueDate;
// Built fresh per call rather than shared as a const: Zod expects a mutable path array,
// so a shared `as const` object is rejected as readonly.
const dueDateMessage = () => ({ message: "Due date cannot be before issue date", path: ["dueDate"] });

export const invoiceSchema = invoiceBase.refine(dueDateNotBeforeIssue, dueDateMessage());

// Editing reuses the create shape and adds the invoice id. The server additionally
// restricts editing to DRAFT invoices — a sent invoice is a document a client already
// holds, so silently changing its amounts would be worse than refusing.
export const updateInvoiceSchema = invoiceBase
  .extend({ id: z.string().cuid() })
  .refine(dueDateNotBeforeIssue, dueDateMessage());

// Manual payment entry. STRIPE is deliberately excluded: a Stripe payment may only
// ever be created by the verified webhook, never by hand, or the "payment state is
// earned" guarantee stops meaning anything.
export const manualPaymentMethods = ["UPI", "BANK_TRANSFER", "CASH", "OTHER"] as const;

export const recordPaymentSchema = z.object({
  invoiceId: z.string().cuid(),
  // Coerced because it arrives from a FormData string. Positive, so a zero-value
  // payment cannot be logged as if something happened.
  amount: z.coerce.number().positive("Enter an amount greater than zero").max(99_999_999),
  method: z.enum(manualPaymentMethods),
  // A UPI UTR, cheque number, or bank reference. Optional, but strongly encouraged
  // because it is the only audit trail a manual payment has.
  reference: z.string().trim().max(120).optional().or(z.literal("")),
  paidAt: z.coerce.date().refine((value) => value.getTime() <= Date.now() + 86_400_000, {
    message: "Payment date cannot be in the future"
  })
});

export const authSignUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const authSignInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Reuses the sign-up password rules so a reset cannot set a weaker password than
// registration would have permitted.
export const resetPasswordSchema = z.object({
  password: authSignUpSchema.shape.password,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Both passwords must match",
  path: ["confirmPassword"]
});

