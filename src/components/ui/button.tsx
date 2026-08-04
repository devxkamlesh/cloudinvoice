import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variants = cva("inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-primary text-white hover:opacity-90", secondary: "bg-muted text-foreground hover:opacity-80", outline: "border bg-transparent hover:bg-muted", ghost: "hover:bg-muted", destructive: "bg-red-600 text-white hover:bg-red-700" }, size: { default: "h-10 px-4", sm: "h-8 px-3 text-xs", lg: "h-12 px-5" } }, defaultVariants: { variant: "default", size: "default" } });

export function Button({ className, variant, size, asChild = false, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof variants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(variants({ variant, size }), className)} {...props} />;
}
