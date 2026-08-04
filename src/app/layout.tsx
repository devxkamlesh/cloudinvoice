import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "CloudInvoice — invoices that get paid", template: "%s | CloudInvoice" },
  description: "Create GST-ready invoices, get paid online, and understand your cash flow.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  robots: { index: true, follow: true },
  applicationName: "CloudInvoice",
  category: "Business software"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${geist.variable} ${mono.variable} font-sans antialiased`}><Providers>{children}</Providers></body></html>;
}
