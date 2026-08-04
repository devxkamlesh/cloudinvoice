"use server";
import { slugify } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createWorkspace(formData: FormData): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");
  const name = String(formData.get("name") ?? "").trim();
  const currency = String(formData.get("currency") ?? "INR");
  if (name.length < 2 || name.length > 120) throw new Error("Enter a business name between 2 and 120 characters.");
  const base = slugify(name) || "workspace";
  let slug = base;
  let number = 2;
  while (await prisma.organization.findUnique({ where: { slug }, select: { id: true } })) slug = `${base}-${number++}`;
  await prisma.$transaction(async (tx) => { const organization = await tx.organization.create({ data: { name, slug, currency } }); await tx.membership.create({ data: { userId: session.user.id, organizationId: organization.id, role: "owner" } }); });
  redirect("/dashboard");
}
