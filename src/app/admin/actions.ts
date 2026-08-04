"use server";

import { PlatformRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";

/**
 * Platform administration actions.
 *
 * Every export re-runs requireAdmin() rather than trusting that the layout already
 * did. Server actions are independently addressable HTTP endpoints — a layout guard
 * does not protect them, so each one checks for itself.
 *
 * Two rules run through all of this:
 *
 *   1. Nothing here deletes a user, an organization, or an invoice. Suspension is
 *      reversible; deletion of a tenant's financial records is not, and no support
 *      task justifies that being one click away.
 *   2. An admin can never reduce their own access, and the last admin can never be
 *      demoted. Both would lock the platform out of its own administration.
 */

const userIdSchema = z.object({ userId: z.string().min(1) });

const roleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum([PlatformRole.USER, PlatformRole.ADMIN])
});

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

/**
 * Suspend an account. Sets suspendedAt, which getAuthenticatedUser checks on every
 * request, so the effect is immediate rather than waiting for the session to expire.
 * No data is touched.
 */
export async function suspendUser(formData: FormData) {
  const admin = await requireAdmin();

  const parsed = userIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Invalid request." };

  // Self-suspension would immediately lock this admin out of the panel that could
  // undo it.
  if (parsed.data.userId === admin.id) {
    return { error: "You cannot suspend your own account." };
  }

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, suspendedAt: true, platformRole: true }
  });
  if (!target) return { error: "User not found." };
  if (target.suspendedAt) return { error: "That account is already suspended." };

  // Suspending a fellow admin is an escalation move between peers. Demote first, so
  // the intent is explicit and recorded as two deliberate steps.
  if (target.platformRole === PlatformRole.ADMIN) {
    return { error: "Remove platform admin access first, then suspend the account." };
  }

  await prisma.user.update({ where: { id: target.id }, data: { suspendedAt: new Date() } });
  revalidateAdmin();
  return { success: true };
}

/** Restore a suspended account by clearing suspendedAt. */
export async function unsuspendUser(formData: FormData) {
  await requireAdmin();

  const parsed = userIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Invalid request." };

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, suspendedAt: true }
  });
  if (!target) return { error: "User not found." };
  if (!target.suspendedAt) return { error: "That account is not suspended." };

  await prisma.user.update({ where: { id: target.id }, data: { suspendedAt: null } });
  revalidateAdmin();
  return { success: true };
}

/**
 * Grant or remove platform admin access.
 *
 * Guards against the two ways this could lock everyone out: an admin demoting
 * themselves, and demoting the only remaining admin. The count is taken inside a
 * transaction so two concurrent demotions cannot both pass the check and leave zero
 * admins behind.
 */
export async function setPlatformRole(formData: FormData) {
  const admin = await requireAdmin();

  const parsed = roleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Invalid request." };
  const { userId, role } = parsed.data;

  if (userId === admin.id) {
    return { error: "You cannot change your own platform role. Ask another admin." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, platformRole: true, suspendedAt: true }
  });
  if (!target) return { error: "User not found." };
  if (target.platformRole === role) return { error: "That user already has this role." };

  // A suspended account should not be handed platform access.
  if (role === PlatformRole.ADMIN && target.suspendedAt) {
    return { error: "Restore the account before granting admin access." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (role === PlatformRole.USER) {
        const admins = await tx.user.count({ where: { platformRole: PlatformRole.ADMIN } });
        if (admins <= 1) throw new Error("LAST_ADMIN");
      }
      await tx.user.update({ where: { id: userId }, data: { platformRole: role } });
    });
  } catch (cause) {
    if (cause instanceof Error && cause.message === "LAST_ADMIN") {
      return { error: "This is the only platform admin. Promote someone else first." };
    }
    throw cause;
  }

  revalidateAdmin();
  return { success: true };
}
