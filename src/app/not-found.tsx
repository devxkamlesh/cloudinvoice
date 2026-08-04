import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="grid min-h-screen place-items-center p-6 text-center"><div><p className="text-sm font-semibold text-primary">404</p><h1 className="mt-2 text-3xl font-semibold">That page is not here.</h1><p className="mt-2 text-muted-foreground">It may have moved or the link may no longer be valid.</p><Button asChild className="mt-6"><Link href="/dashboard">Back to dashboard</Link></Button></div></main>; }
