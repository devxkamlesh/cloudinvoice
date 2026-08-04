"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, FileText, LayoutDashboard, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: UsersRound },
  { href: "/admin/organizations", label: "Workspaces", icon: Building2 },
  { href: "/admin/invoices", label: "Invoices", icon: FileText }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="mx-auto max-w-7xl px-5">
      <ul role="list" className="-mb-px flex gap-1 overflow-x-auto">
        {LINKS.map(({ href, label, icon: Icon }) => {
          // Exact match for the overview, prefix match for sections, so a detail page
          // still highlights its parent tab.
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />{label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
