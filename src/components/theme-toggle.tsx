"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() { const [dark, setDark] = useState(false); useEffect(() => { const saved = localStorage.getItem("cloudinvoice-theme"); const initial = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.classList.toggle("dark", initial); document.documentElement.classList.toggle("light", !initial); setDark(initial); }, []); function toggle() { const next = !dark; document.documentElement.classList.toggle("dark", next); document.documentElement.classList.toggle("light", !next); localStorage.setItem("cloudinvoice-theme", next ? "dark" : "light"); setDark(next); } return <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle color theme">{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</Button>; }
