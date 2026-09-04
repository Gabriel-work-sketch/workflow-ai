import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OutputPanel } from "@/components/OutputPanel";
import { summarizeNotes } from "@/lib/ai.functions";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/_app/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content: "Turn long meeting notes into a clear summary with key points, decisions, action items and next steps.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | AI Workplace Assistant" },
      { property: "og:description", content: "Concise, structured meeting summaries in one click." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingNotes;
});

function MeetingNotes() {
  const { settings } = useSettings();
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");

  const fn = useServerFn(summarizeNotes);
  const mutation = useMutation({
    mutationFn: () => fn({ data: { notes, length: settings.responseLength } }),
    onSuccess: (res) => setOutput(res.content),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <section className="surface-card rounded-xl p-5">
        <h1 className="text-lg font-semibold">Meeting Notes Summarizer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste your raw notes or transcript and get a structured business summary.
        </p>
        <div className="mt-5 space-y-2">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes here…"
            className="min-h-[340px] resize-none bg-background/40 text-sm leading-relaxed"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1"
            size="lg"
            disabled={notes.trim().length < 10 || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {mutation.isPending ? "Summarizing…" : "Summarize notes"}
          </Button>
          <Button variant="ghost" size="lg" onClick={() => setNotes("")} disabled={!notes}>
            Clear
          </Button>
        </div>
      </section>

      <section className="surface-card rounded-xl p-5">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">Edit, copy or download the summary.</p>
        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={mutation.isPending}
          placeholder="Your meeting summary will appear here."
          downloadName="meeting-summary.txt"
        />
      </section>
    </div>
  );
}
