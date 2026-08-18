import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "CloudInvoice — invoices that get paid", template: "%s | CloudInvoice" },
  description: "Create GST-ready invoices, get paid online, and understand your cash flow.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  robots: { index: true, follow: true },
  applicationName: "CloudInvoice",
  category: "Business software",
  openGraph: { siteName: "CloudInvoice", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CloudInvoice online invoice generator" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={cn(geistSans.variable, geistMono.variable, playfair.variable, "font-sans antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
