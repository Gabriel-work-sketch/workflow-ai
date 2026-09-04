import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OutputPanel } from "@/components/OutputPanel";
import { generateEmail } from "@/lib/ai.functions";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/_app/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content: "Generate professional workplace emails with AI by choosing a purpose, recipient, key details and tone.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace Assistant" },
      { property: "og:description", content: "Write clear, professional business emails in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailGenerator,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailGenerator() {
  const { settings } = useSettings();
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyInfo, setKeyInfo] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");

  useEffect(() => setTone(settings.defaultTone), [settings.defaultTone]);

  const fn = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: () =>
      fn({ data: { purpose, recipient, keyInfo, tone, length: settings.responseLength } }),
    onSuccess: (res) => setOutput(res.content),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <section className="surface-card rounded-xl p-5">
        <h1 className="text-lg font-semibold">Smart Email Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe what you need and the assistant will draft a polished workplace email.
        </p>

        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Input
              id="purpose"
              placeholder="Invite the team to a project update meeting"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="Project team / Sarah from Acme Ltd."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyinfo">Key information</Label>
            <Textarea
              id="keyinfo"
              rows={5}
              placeholder="Friday 10:00 AM, discuss progress, challenges and upcoming milestones"
              value={keyInfo}
              onChange={(e) => setKeyInfo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!purpose.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {mutation.isPending ? "Generating…" : "Generate email"}
          </Button>
        </div>
      </section>

      <section className="surface-card rounded-xl p-5">
        <h2 className="text-lg font-semibold">Generated email</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">Edit the draft before you send it.</p>
        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={mutation.isPending}
          placeholder="Your generated email will appear here."
          downloadName="email.txt"
        />
      </section>
    </div>
  );
}
