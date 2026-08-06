"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Theme toggle with a radial wipe animation from the trigger position.
 *
 * Uses the View Transitions API when supported; degrades to instant toggle otherwise.
 * The clip-path is computed from the button center to the furthest corner, creating a
 * circular reveal that originates from wherever the toggle sits on screen.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cloudinvoice-theme");
    // Default to light mode. Only go dark if explicitly saved as "dark".
    const initial = saved === "dark";
    document.documentElement.classList.toggle("dark", initial);
    document.documentElement.classList.toggle("light", !initial);
    setDark(initial);
  }, []);

  async function toggle() {
    const next = !dark;

    // Fallback for browsers without View Transitions support.
    if (!document.startViewTransition || !buttonRef.current) {
      document.documentElement.classList.toggle("dark", next);
      document.documentElement.classList.toggle("light", !next);
      localStorage.setItem("cloudinvoice-theme", next ? "dark" : "light");
      setDark(next);
      return;
    }

    // Compute the circle radius from trigger center to furthest corner.
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark", next);
      document.documentElement.classList.toggle("light", !next);
      localStorage.setItem("cloudinvoice-theme", next ? "dark" : "light");
      setDark(next);
    });

    await transition.ready;
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
      { duration: 520, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
    );
  }

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
    >
      {dark ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
    </Button>
  );
}
