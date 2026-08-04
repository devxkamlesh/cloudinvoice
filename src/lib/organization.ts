import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getCurrentMembership = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" }
  });
  if (!membership) redirect("/onboarding");
  return { session, membership };
});

export async function requireOrganization() {
  const { membership } = await getCurrentMembership();
  return membership.organization;
}
