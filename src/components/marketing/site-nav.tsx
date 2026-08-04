"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

// Breakpoints here are deliberately paired: the desktop nav appears at `lg` and the
// mobile trigger disappears at `lg`. Previously the nav was `xl:flex` while the
// trigger was `sm:hidden`, which left every viewport between 640px and 1280px — most
// tablets and small laptops — with no navigation affordance at all.
const NAV = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/templates", label: "Templates" },
  { href: "/integrations", label: "Integrations" },
  { href: "/customers", label: "Customers" },
  { href: "/changelog", label: "Changelog" }
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
    <header className="sticky top-0 z-50 border-b border-white/[.07] bg-[#050505]/85 backdrop-blur-xl">
      {/* Hairline accent. Purely decorative, so hidden from assistive tech. */}
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-violet-400/25 to-transparent" />

      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-5">
        <Link href="/" aria-label="CloudInvoice home" className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
          <Logo className="text-white" />
        </Link>

        <nav aria-label="Primary" className="ml-2 hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
                isActive(link.href) ? "text-white" : "text-zinc-400 hover:bg-white/[.05] hover:text-white"
              )}
            >
              {link.label}
              {isActive(link.href) && <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-px bg-violet-300" />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 lg:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/sign-in"
            className="hidden items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] sm:inline-flex"
          >
            Get started <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-lg border border-white/10 text-zinc-200 transition hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <>
          {/* Backdrop. Click to dismiss; the button above is the labelled control. */}
          <div aria-hidden="true" onClick={() => setOpen(false)} className="fixed inset-0 top-[4.5rem] z-40 bg-black/60 lg:hidden" />
          <div
            id="site-mobile-menu"
            ref={sheetRef}
            className="absolute inset-x-0 top-full z-50 max-h-[calc(100vh-4.5rem)] overflow-y-auto border-b border-white/[.09] bg-[#08080a] shadow-[0_30px_80px_rgba(0,0,0,.6)] lg:hidden"
          >
            <nav aria-label="Site" className="mx-auto max-w-7xl px-5 py-5">
              <p className="px-1 text-[10px] font-bold uppercase tracking-[.16em] text-zinc-600">Product</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {NAV.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
                        isActive(link.href) ? "bg-white/[.08] text-white" : "text-zinc-300 hover:bg-white/[.06] hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-5 px-1 text-[10px] font-bold uppercase tracking-[.16em] text-zinc-600">More</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {SECONDARY.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
                        isActive(link.href) ? "bg-white/[.08] text-white" : "text-zinc-400 hover:bg-white/[.06] hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-2 border-t border-white/[.08] pt-5 sm:grid-cols-2">
                <Link href="/sign-in" className="rounded-xl border border-white/[.12] bg-white/[.04] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/[.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
                  Sign in
                </Link>
                <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
                  Get started <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
