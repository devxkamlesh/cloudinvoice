import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "CloudInvoice — invoices that get paid", template: "%s | CloudInvoice" },
  description: "Create GST-ready invoices, get paid online, and understand your cash flow.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  robots: { index: true, follow: true },
  applicationName: "CloudInvoice",
  category: "Business software",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={cn(geistSans.variable, geistMono.variable, "font-sans antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
