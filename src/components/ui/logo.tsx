import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * CloudInvoice logo — square mark plus text wordmark.
 *
 * The horizontal PNG is too wide for sidebar use, so this component pairs the square
 * icon with the product name. The icon is 96×96px and works at all scales. On
 * marketing pages where className="text-white" was applied, the text colour now
 * respects that; the icon itself is full-colour and doesn't need a filter.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-bold tracking-tight", className)}>
      <Image
        src="/logos/logo-96.png"
        alt=""
        width={32}
        height={32}
        className="size-8"
        aria-hidden="true"
      />
      CloudInvoice
    </span>
  );
}
