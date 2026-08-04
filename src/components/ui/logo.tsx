import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * CloudInvoice logo, now using the real horizontal wordmark instead of an icon.
 *
 * The horizontal version includes both the mark and the name, so it replaces the
 * previous icon-plus-text approach. The image is 512×117px, and Next.js Image
 * handles optimization and responsive sizing. Height is fixed; width adapts.
 *
 * In the dashboard and admin chrome, this sits in the sidebar where the old icon
 * lived. On marketing and auth pages, className="text-white" was being applied to
 * the wrapper span, but that did nothing to the icon. The new logo works in light,
 * dark, and coloured backgrounds without needing a text colour prop.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logos/cloudinvoice-horizontal.png"
      alt="CloudInvoice"
      width={140}
      height={32}
      className={cn("h-auto w-32", className)}
      priority
    />
  );
}
