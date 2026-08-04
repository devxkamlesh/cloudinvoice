"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireOrganizationOwner } from "@/lib/authz";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(500).optional(),
  gstin: z.string().trim().toUpperCase().regex(/^[0-9A-Z]{15}$/).optional().or(z.literal("")),
  stateCode: z.string().trim().regex(/^\d{2}$/).optional().or(z.literal("")),
  invoicePrefix: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{1,12}$/),
  upiId: z.string().trim().max(100).optional()
});

/**
 * Update the workspace's own details.
 *
 * Owner-only. These fields print on every invoice and identify the business for tax
 * purposes, so they are a different class of change from adding a client. Previously
 * this used requireOrganization(), which authenticated but never checked the role, so
 * any member of a workspace could rewrite its GSTIN or invoice numbering.
 */
export async function updateOrganization(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your company settings." };

  const access = await requireOrganizationOwner();
  if (!access.ok) return { error: access.error };

  await prisma.organization.update({
    where: { id: access.organization.id },
    data: {
      ...parsed.data,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      address: parsed.data.address || null,
      gstin: parsed.data.gstin || null,
      stateCode: parsed.data.stateCode || null,
      upiId: parsed.data.upiId || null
    }
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
