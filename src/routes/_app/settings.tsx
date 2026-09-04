import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings, defaultSettings, type AppSettings } from "@/lib/settings";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Workplace Assistant" },
      {
        name: "description",
        content: "Customize your default email tone, theme preference, notifications and AI response length.",
      },
      { property: "og:title", content: "Settings | AI Workplace Assistant" },
      { property: "og:description", content: "Tune the assistant to match how your team works." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Label className="text-sm font-medium">{title}</Label>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="sm:w-56">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const { settings, update } = useSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preferences are saved automatically on this device.</p>
      </div>

      <section className="surface-card rounded-xl px-5 py-2">
        <Row title="Default email tone" description="Used as the starting tone in the Smart Email Generator.">
          <Select value={settings.defaultTone} onValueChange={(v) => update({ defaultTone: v as AppSettings["defaultTone"] })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
              <SelectItem value="Persuasive">Persuasive</SelectItem>
            </SelectContent>
          </Select>
        </Row>

        <Row title="Theme accent" description="Choose the highlight colour used across the workspace.">
          <Select value={settings.accent} onValueChange={(v) => update({ accent: v as AppSettings["accent"] })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">Light blue (default)</SelectItem>
              <SelectItem value="teal">Teal</SelectItem>
              <SelectItem value="violet">Violet</SelectItem>
            </SelectContent>
          </Select>
        </Row>

        <Row title="AI response length" description="Controls how detailed generated content and answers are.">
          <Select
            value={settings.responseLength}
            onValueChange={(v) => update({ responseLength: v as AppSettings["responseLength"] })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>
        </Row>

        <Row title="In-app notifications" description="Show alerts when AI tasks complete.">
          <div className="sm:flex sm:justify-end">
            <Switch checked={settings.notifications} onCheckedChange={(v) => update({ notifications: v })} />
          </div>
        </Row>

        <Row title="Weekly productivity digest" description="Email summary of your workspace activity.">
          <div className="sm:flex sm:justify-end">
            <Switch checked={settings.emailDigest} onCheckedChange={(v) => update({ emailDigest: v })} />
          </div>
        </Row>
      </section>

      <Button
        variant="secondary"
        onClick={() => {
          update(defaultSettings);
          toast.success("Settings reset to defaults");
        }}
      >
        Reset to defaults
      </Button>
    </div>
  );
}
