import { ImageResponse } from "next/og";

export const runtime = "nodejs";

// Derived from NEXT_PUBLIC_APP_URL so the card never advertises a domain we do not
// own. Falls back to the registered domain rather than a hardcoded wrong one.
const displayDomain = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://cloudinvoice.co.in").host.replace(/^www\./, "");
  } catch {
    return "cloudinvoice.co.in";
  }
})();
export const alt = "CloudInvoice — GST-ready invoicing and payment collection";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)", color: "#172033" }}><div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: 30, fontWeight: 700 }}><div style={{ width: 50, height: 50, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#2855d9", color: "white" }}>C</div>CloudInvoice</div><div style={{ display: "flex", flexDirection: "column", gap: "20px" }}><div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 700, letterSpacing: "-4px", maxWidth: 950 }}>Invoices that get paid.</div><div style={{ fontSize: 30, color: "#52617b" }}>GST-ready invoicing, payments, and revenue clarity for independent businesses.</div></div><div style={{ fontSize: 24, color: "#2855d9", fontWeight: 700 }}>{displayDomain}</div></div>, size);
}
