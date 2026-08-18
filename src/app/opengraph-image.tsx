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
export const alt = "CloudInvoice free online invoice generator for GST billing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "linear-gradient(135deg, #ffffff 0%, #eef0ff 100%)", color: "#33374a", borderTop: "18px solid #0000f2" }}><div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: 30, fontWeight: 700 }}><div style={{ width: 50, height: 50, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", background: "#0000f2", color: "white" }}>C</div>CloudInvoice</div><div style={{ display: "flex", flexDirection: "column", gap: "20px" }}><div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 700, letterSpacing: "-3px", maxWidth: 1020 }}>Create a GST-ready invoice online for free.</div><div style={{ fontSize: 28, color: "#626982" }}>Professional invoices, private client links, and payment tracking for independent businesses.</div></div><div style={{ fontSize: 24, color: "#0000f2", fontWeight: 700 }}>{displayDomain}</div></div>, size);
}
