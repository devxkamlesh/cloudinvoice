import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWorkspace } from "./actions";

export default function OnboardingPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted p-5">
      <section className="surface w-full max-w-xl rounded-2xl p-7 sm:p-10">
        <Logo />
        <div className="mt-10">
          <p className="text-sm font-semibold text-primary">LET&apos;S SET UP YOUR WORKSPACE</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Tell us about your business.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This information appears on your invoices. You can fine-tune it later in settings.
          </p>
        </div>

        <form action={createWorkspace} className="mt-8 space-y-5">
          <label className="block text-sm font-medium">
            Business name
            <Input
              required
              name="name"
              minLength={2}
              maxLength={120}
              className="mt-1.5"
              placeholder="Studio North"
            />
          </label>

          <label className="block text-sm font-medium">
            Country
            <select
              name="country"
              className="mt-1.5 h-10 w-full rounded-xl border bg-background px-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="IN">🇮🇳 India</option>
              <option value="US">🇺🇸 United States</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="AU">🇦🇺 Australia</option>
              <option value="SG">🇸🇬 Singapore</option>
              <option value="AE">🇦🇪 United Arab Emirates</option>
              <option value="DE">🇩🇪 Germany</option>
              <option value="FR">🇫🇷 France</option>
              <option value="JP">🇯🇵 Japan</option>
              <option value="BR">🇧🇷 Brazil</option>
              <option value="MX">🇲🇽 Mexico</option>
              <option value="ZA">🇿🇦 South Africa</option>
              <option value="NG">🇳🇬 Nigeria</option>
              <option value="KE">🇰🇪 Kenya</option>
              <option value="NL">🇳🇱 Netherlands</option>
              <option value="ES">🇪🇸 Spain</option>
              <option value="IT">🇮🇹 Italy</option>
              <option value="CH">🇨🇭 Switzerland</option>
              <option value="SE">🇸🇪 Sweden</option>
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Used for phone number formatting and regional settings
            </p>
          </label>

          <label className="block text-sm font-medium">
            Default currency
            <select
              name="currency"
              className="mt-1.5 h-10 w-full rounded-xl border bg-background px-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">Pound Sterling (£)</option>
              <option value="CAD">Canadian Dollar (C$)</option>
              <option value="AUD">Australian Dollar (A$)</option>
              <option value="SGD">Singapore Dollar (S$)</option>
              <option value="AED">UAE Dirham (د.إ)</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="BRL">Brazilian Real (R$)</option>
              <option value="MXN">Mexican Peso (MX$)</option>
              <option value="ZAR">South African Rand (R)</option>
              <option value="CHF">Swiss Franc (CHF)</option>
              <option value="SEK">Swedish Krona (kr)</option>
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Default currency for your invoices
            </p>
          </label>

          <Button size="lg" className="w-full">
            Create workspace
          </Button>
        </form>
      </section>
    </main>
  );
}
