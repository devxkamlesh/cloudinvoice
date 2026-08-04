import { SettingsForm } from "@/components/settings/settings-form";
import { requireOrganization } from "@/lib/organization";

export default async function SettingsPage() {
  const organization = await requireOrganization();

  return (
    <main className="mx-auto w-full max-w-4xl p-5 sm:p-7">
      <div>
        <p className="app-eyebrow">Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em]">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure your business details, GST information, and payment preferences.
        </p>
      </div>

      <div className="mt-7">
        <SettingsForm organization={organization} />
      </div>
    </main>
  );
}
