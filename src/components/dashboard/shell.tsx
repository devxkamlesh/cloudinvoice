import { DashboardChrome } from "@/components/dashboard/dashboard-chrome";
import { getCurrentMembership } from "@/lib/organization";
import { isPlatformAdmin } from "@/lib/authz";

/**
 * Server wrapper for the authenticated app.
 *
 * Resolves the user, workspace, and admin flag, then hands plain serialisable values to
 * the client chrome. The old version also read an `x-pathname` header for the active nav
 * item; nothing set that header, so it has been dropped in favour of usePathname inside
 * the chrome.
 */
export async function DashboardShell({ children }: { children: React.ReactNode }) {
  const [{ membership, user }, admin] = await Promise.all([getCurrentMembership(), isPlatformAdmin()]);

  return (
    <DashboardChrome
      userName={user.name}
      userEmail={user.email}
      organizationName={membership.organization.name}
      isAdmin={admin}
    >
      {children}
    </DashboardChrome>
  );
}
