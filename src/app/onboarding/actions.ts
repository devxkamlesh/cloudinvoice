"use server";
import { MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/authz";

// The currency must be one of the values the product can actually format and, for INR,
// build a valid UPI URI for. It was previously taken straight from the form with no
// server-side check: an arbitrary string reached Intl.NumberFormat, which throws
// RangeError on an unknown code. Since the value is copied onto every invoice at
// creation, one crafted request could permanently break that workspace's dashboard,
// invoice list, and public payment pages.
const supportedCurrencies = [
  "INR", "USD", "EUR", "GBP", "CAD", "AUD", "SGD", "AED", 
  "JPY", "BRL", "MXN", "ZAR", "CHF", "SEK"
] as const;

const workspaceSchema = z.object({
  name: z.string().trim().min(2, "Enter a business name of at least 2 characters").max(120, "Business name is too long"),
  currency: z.enum(supportedCurrencies),
  country: z.string().length(2, "Invalid country code")
});

export async function createWorkspace(formData: FormData): Promise<void> {
  const user = await getAuthenticatedUser();

  const parsed = workspaceSchema.safeParse({
    name: formData.get("name") ?? "",
    currency: formData.get("currency") ?? "INR",
    country: formData.get("country") ?? "IN"
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check the workspace details.");

  const base = slugify(parsed.data.name) || "workspace";
  let slug = base;
  let number = 2;
  while (await prisma.organization.findUnique({ where: { slug }, select: { id: true } })) slug = `${base}-${number++}`;

  await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { 
        name: parsed.data.name, 
        slug, 
        currency: parsed.data.currency,
        country: parsed.data.country
      }
    });
    // The creator owns the workspace they just made. MemberRole.OWNER is now a typed
    // enum rather than the free-form "owner" string, so it can actually be compared.
    await tx.membership.create({
      data: { userId: user.id, organizationId: organization.id, role: MemberRole.OWNER }
    });
  });

  redirect("/dashboard");
}
