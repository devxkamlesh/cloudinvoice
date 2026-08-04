import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/authz";

/**
 * Resolve the signed-in user and their current workspace.
 *
 * Delegates authentication to getAuthenticatedUser so the suspension check lives in
 * exactly one place. Previously this called the session API directly, which meant a
 * suspended account would still have reached every dashboard route.
 *
 * Note the known limitation: this picks the oldest membership, so a user belonging to
 * more than one workspace can only reach the first. There is no workspace switcher yet.
 */
export const getCurrentMembership = cache(async () => {
  const user = await getAuthenticatedUser();

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" }
  });
  if (!membership) redirect("/onboarding");

  return { user, membership };
});

export async function requireOrganization() {
  const { membership } = await getCurrentMembership();
  return membership.organization;
}
