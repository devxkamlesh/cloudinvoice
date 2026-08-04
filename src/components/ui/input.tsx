import { cn } from "@/lib/utils";

// React.ComponentProps rather than InputHTMLAttributes so `ref` is part of the type.
// React 19 forwards ref to function components directly; the older attribute types
// omit it, which made these impossible to focus programmatically.
export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn("flex h-10 w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/25", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("flex min-h-24 w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/25", className)} {...props} />;
}
