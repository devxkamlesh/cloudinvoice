"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

// Breakpoints here are deliberately paired: the desktop nav appears at `lg` and the
// mobile trigger disappears at `lg`. Previously the nav was `xl:flex` while the
// trigger was `sm:hidden`, which left every viewport between 640px and 1280px — most
// tablets and small laptops — with no navigation affordance at all.
const NAV = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/integrations", label: "Integrations" },
  { href: "/security", label: "Security" },
  { href: "/mission", label: "Company" }
];

// Shown only inside the mobile sheet, where there is room for the full set.
const SECONDARY = [
  { href: "/faq", label: "FAQ" },
  { href: "/status", label: "Service status" },
  { href: "/contact", label: "Contact" }
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on navigation. Without this the sheet stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus(); // return focus where the user left it
      }
    }

    // Prevent the page scrolling behind the open sheet.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    // Move focus into the sheet so keyboard and screen-reader users land there.
    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/94 backdrop-blur-xl dark:bg-background/96">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="CloudInvoice home" className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
              {isActive(link.href) && <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-px bg-primary" />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/sign-in"
            className="hidden items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-[opacity,transform] duration-150 hover:opacity-85 active:scale-[.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
          >
            Get started <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <ThemeToggle />

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-lg border text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
        <motion.div key="mobile-menu-layer" className="lg:hidden">
          {/* Backdrop. Click to dismiss; the button above is the labelled control. */}
          <motion.div aria-hidden="true" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16, ease: "easeOut" }} className="fixed inset-0 top-16 z-40 bg-black/35" />
          <motion.div
            id="site-mobile-menu"
            ref={sheetRef}
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b bg-card shadow-[0_30px_80px_rgba(0,0,0,.18)] dark:shadow-[0_30px_80px_rgba(0,0,0,.55)]"
          >
            <nav aria-label="Site" className="mx-auto max-w-7xl px-5 py-5">
              <p className="px-1 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Product</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {NAV.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        isActive(link.href) ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-5 px-1 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">More</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {SECONDARY.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        isActive(link.href) ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-3 border-t pt-5 sm:grid-cols-2">
                <Link href="/sign-in" className="rounded-xl border bg-card px-4 py-3 text-center text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                  Sign in
                </Link>
                <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-[opacity,transform] duration-150 hover:opacity-85 active:scale-[.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                  Get started <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </nav>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
