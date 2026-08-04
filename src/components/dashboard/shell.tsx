import { headers } from "next/headers";
import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { getCurrentMembership } from "@/lib/organization";

export async function DashboardShell({ children }: { children: React.ReactNode }) { const [{ membership, session }, headerList] = await Promise.all([getCurrentMembership(), headers()]); const pathname = headerList.get("x-pathname") ?? ""; return <div className="flex min-h-screen"><Sidebar pathname={pathname} /><div className="min-w-0 flex-1"><DashboardHeader name={session.user.name} organizationName={membership.organization.name} />{children}</div></div>; }
