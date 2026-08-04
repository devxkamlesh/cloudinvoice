"use client";
import { Bell, LogOut, Menu } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader({ name, organizationName }: { name: string; organizationName: string }) { return <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-7"><div className="flex items-center gap-3"><Menu className="size-5 lg:hidden" /><div><p className="text-sm font-semibold">{organizationName}</p><p className="text-xs text-muted-foreground">Workspace</p></div></div><div className="flex items-center gap-2"><ThemeToggle /><Button variant="ghost" size="sm" aria-label="Notifications"><Bell className="size-4" /></Button><span className="hidden text-sm text-muted-foreground sm:inline">{name}</span><Button variant="ghost" size="sm" aria-label="Sign out" onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => window.location.assign("/") } })}><LogOut className="size-4" /></Button></div></header>; }
