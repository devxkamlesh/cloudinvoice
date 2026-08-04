"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/organization";

const schema = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().optional().or(z.literal("")), phone: z.string().trim().max(30).optional(), address: z.string().trim().max(500).optional(), gstin: z.string().trim().toUpperCase().regex(/^[0-9A-Z]{15}$/).optional().or(z.literal("")), stateCode: z.string().trim().regex(/^\d{2}$/).optional().or(z.literal("")), invoicePrefix: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{1,12}$/), upiId: z.string().trim().max(100).optional() });
export async function updateOrganization(formData: FormData) { const parsed = schema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your company settings." }; const organization = await requireOrganization(); await prisma.organization.update({ where: { id: organization.id }, data: { ...parsed.data, email: parsed.data.email || null, phone: parsed.data.phone || null, address: parsed.data.address || null, gstin: parsed.data.gstin || null, stateCode: parsed.data.stateCode || null, upiId: parsed.data.upiId || null } }); revalidatePath("/settings"); revalidatePath("/dashboard"); return { success: true }; }
