// Single source of truth for public contact addresses.
//
// These are on the CloudInvoice domain so every touchpoint matches the product,
// rather than borrowing another project's domain. The values are intentionally
// plain constants with an env override: they are not secrets, and hardcoding a
// correct default avoids the build-time inlining trap where a NEXT_PUBLIC_* var
// that is absent during `docker build` bakes in as undefined.
//
// These addresses require the domain's MX records to be in place before mail
// actually arrives. Keep that in mind when the registrar hold clears.

// `||` rather than `??` on purpose. docker-compose expands an unset variable to an
// empty string, not undefined, so `??` would keep the empty value and render a blank
// address. `||` falls back for both cases.
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@cloudinvoice.co.in";
export const SECURITY_EMAIL = process.env.NEXT_PUBLIC_SECURITY_EMAIL || "security@cloudinvoice.co.in";

export function mailto(address: string, subject: string) {
  return `mailto:${address}?subject=${encodeURIComponent(subject)}`;
}
