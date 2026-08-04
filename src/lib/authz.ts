import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { MemberRole, PlatformRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Authorization guards.
 *
 * Two separate axes, kept apart on purpose:
 *
 *   PlatformRole  — may this account operate the service itself
 *   MemberRole    — what may this account do inside one workspace
 *
 * Collapsing them would mean an escalation bug in workspace handling could hand out
 * platform access. Every guard here fails closed: if anything is missing or ambiguous
 * the caller is redirected or refused rather than allowed through.
 */

/**
 * Resolve the signed-in account, including platform role and suspension state.
 *
 * `cache` deduplicates this within a single render pass, so a layout and the page it
 * wraps can both call a guard without issuing duplicate queries.
 *
 * Reads the role from the database rather than the session. A role change or a
 * suspension then takes effect on the next request instead of waiting out a
 * fourteen-day session.
 */
export const getAuthenticatedUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, platformRole: true, suspendedAt: true, createdAt: true }
  });

  // The session referenced a user that no longer exists. Treat as unauthenticated.
  if (!user) redirect("/sign-in");

  // Suspension is enforced here, at the single point every authenticated surface
  // passes through, rather than being repeated per route where one omission would
  // leave a hole.
  if (user.suspendedAt) redirect("/suspended");

  return user;
});

/** True when the signed-in account may operate the platform. */
export async function isPlatformAdmin() {
  const user = await getAuthenticatedUser();
  return user.platformRole === PlatformRole.ADMIN;
}

/**
 * Require platform admin. Call at the top of every admin layout, page, and action.
 *
 * Responds with a 404 rather than a 403 on purpose: a non-admin gets no confirmation
 * that an admin area exists at all. `notFound()` is also stable, whereas `forbidden()`
 * needs the experimental authInterrupts flag, and an authorization guard is the last
 * place to depend on an experimental API.
 */
export async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (user.platformRole !== PlatformRole.ADMIN) notFound();
  return user;
}

/**
 * Require an owner of the current workspace.
 *
 * For changes to the workspace itself — company details, tax identifiers, invoice
 * numbering — as distinct from creating business records inside it. Membership.role
 * existed before this but was never read, so every member held owner rights.
 *
 * Returns a discriminated result instead of throwing, because callers are server
 * actions that already report failures back to the UI. A silent redirect there would
 * leave the user staring at an unchanged form with no explanation.
 */
export async function requireOrganizationOwner() {
  const user = await getAuthenticatedUser();

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" }
  });
  if (!membership) redirect("/onboarding");

  if (membership.role !== MemberRole.OWNER) {
    return { ok: false as const, error: "Only a workspace owner can change these settings." };
  }

  return { ok: true as const, user, membership, organization: membership.organization };
}
