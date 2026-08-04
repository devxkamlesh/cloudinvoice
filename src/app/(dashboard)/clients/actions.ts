"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/organization";
import { clientSchema } from "@/lib/validations";

export async function createClient(formData: FormData) {
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please review the client details." };
  const organization = await requireOrganization();
  await prisma.client.create({ data: { ...parsed.data, organizationId: organization.id, email: parsed.data.email || null, phone: parsed.data.phone || null, billingAddress: parsed.data.billingAddress || null, gstin: parsed.data.gstin || null, stateCode: parsed.data.stateCode || null, notes: parsed.data.notes || null } });
  revalidatePath("/clients");
  return { success: true };
}
