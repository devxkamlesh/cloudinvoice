import { z } from "zod";

const optionalText = z.string().trim().max(500).optional().or(z.literal(""));
export const clientSchema = z.object({
  name: z.string().trim().min(2, "Enter a client name").max(120),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: optionalText, billingAddress: optionalText,
  gstin: z.string().trim().toUpperCase().regex(/^[0-9A-Z]{15}$/, "Enter a valid 15-character GSTIN").optional().or(z.literal("")),
  stateCode: z.string().trim().regex(/^\d{2}$/, "Use a two digit state code").optional().or(z.literal("")), notes: optionalText
});

export const invoiceSchema = z.object({
  clientId: z.string().cuid(), issueDate: z.coerce.date(), dueDate: z.coerce.date(),
  taxMode: z.enum(["INTRA_STATE", "INTER_STATE"]), template: z.enum(["classic", "modern", "midnight"]), notes: optionalText, terms: optionalText,
  items: z.array(z.object({ description: z.string().trim().min(1).max(500), hsnSac: z.string().trim().max(20).optional(), quantity: z.coerce.number().positive(), unitPrice: z.coerce.number().nonnegative(), discount: z.coerce.number().nonnegative().default(0), taxRate: z.coerce.number().min(0).max(100) })).min(1)
}).refine((data) => data.dueDate >= data.issueDate, { message: "Due date cannot be before issue date", path: ["dueDate"] });

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

