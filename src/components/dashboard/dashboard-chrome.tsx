"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BarChart3, Building2, CircleHelp, FileText, LayoutDashboard, LogOut, Menu, Plus, Settings, ShieldCheck, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/clients", label: "Clients", icon: Building2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 }
];

/**
 * Authenticated app chrome: sidebar, header, and mobile drawer.
 *
 * A client component because the active-nav state comes from usePathname. The previous
 * implementation read an `x-pathname` request header that nothing ever set, so the
 * highlight could never appear. Deriving it here removes the hidden dependency.
 *
 * Sidebar and header live together so the header's menu button and the drawer can share
 * one piece of state instead of coordinating across a server boundary.
 */
export function DashboardChrome({
  children,
  userName,
  userEmail,
  organizationName,
  isAdmin
}: {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  organizationName: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Prefix match so /invoices/new and /invoices/[id] keep the Invoices item lit.
  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  const navLinks = (onNavigate?: () => void) => NAV.map(({ href, label, icon: Icon }) => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        data-active={active}
        aria-current={active ? "page" : undefined}
        className={cn(
          "app-nav-item flex h-10 items-center gap-3 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          active ? "" : "font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />{label}
      </Link>
    );
  });

  const footerLinks = (onNavigate?: () => void) => (
    <>
      <Link
        href="/settings"
        onClick={onNavigate}
        data-active={isActive("/settings")}
        aria-current={isActive("/settings") ? "page" : undefined}
        className={cn(
          "app-nav-item flex h-10 items-center gap-3 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          isActive("/settings") ? "" : "font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        )}
      >
        <Settings className="size-4 shrink-0" aria-hidden="true" />Settings
      </Link>
      <Link
        href="/faq"
        onClick={onNavigate}
        className="app-nav-item flex h-10 items-center gap-3 px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <CircleHelp className="size-4 shrink-0" aria-hidden="true" />Help & terms
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex h-10 items-center gap-3 rounded-[.625rem] px-3 text-sm font-medium text-amber-700 transition hover:bg-amber-500/10 dark:text-amber-300"
        >
          <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />Admin
        </Link>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-card px-3 py-4 lg:flex">
        <Link href="/dashboard" className="mb-6 px-2 py-1" aria-label="CloudInvoice dashboard"><Logo /></Link>
        <div className="mb-5 rounded-xl border bg-background/65 p-3">
          <p className="truncate text-sm font-semibold">{organizationName}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{userEmail}</p>
        </div>
        <Link
          href="/invoices/new"
          className="mb-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-[opacity,transform] duration-150 hover:opacity-85 active:scale-[.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Plus className="size-4" aria-hidden="true" />New invoice
        </Link>
        <p className="app-eyebrow mb-2 px-3">Workspace</p>
        <nav aria-label="Main" className="space-y-1">{navLinks()}</nav>
        <div className="mt-auto space-y-1 pt-5">{footerLinks()}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div aria-hidden="true" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/35 lg:hidden" />
          <div
            id="dashboard-drawer"
            ref={drawerRef}
            className="fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e bg-card p-4 shadow-2xl lg:hidden"
          >
            <div className="mb-8 flex items-center justify-between px-2">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-1.5 hover:bg-muted">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <Link
              href="/invoices/new"
              onClick={() => setOpen(false)}
              className="mb-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background active:scale-[.96]"
            >
              <Plus className="size-4" aria-hidden="true" />New invoice
            </Link>
            <p className="app-eyebrow mb-2 px-3">Workspace</p>
            <nav aria-label="Main" className="space-y-1">{navLinks(() => setOpen(false))}</nav>
            <div className="mt-auto space-y-1 border-t pt-4">{footerLinks(() => setOpen(false))}</div>
          </div>
        </>
      )}

      <div className="app-canvas flex min-w-0 flex-1 flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="dashboard-drawer"
              className="grid size-10 shrink-0 place-items-center rounded-lg border transition-colors duration-150 hover:bg-muted lg:hidden"
            >
              <Menu className="size-4" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{organizationName}</p>
              <p className="text-xs text-muted-foreground">CloudInvoice workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{userName}</p>
              <p className="text-xs leading-tight text-muted-foreground">{userEmail}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
              <span className="sr-only sm:hidden">Sign out</span>
            </Button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
