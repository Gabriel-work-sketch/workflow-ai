import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/_app/help")({
  head: () => ({
    meta: [
      { title: "Help & Guides | AI Workplace Assistant" },
      {
        name: "description",
        content: "Learn how to use the Smart Email Generator, Meeting Notes Summarizer and AI Workplace Chatbot.",
      },
      { property: "og:title", content: "Help & Guides | AI Workplace Assistant" },
      { property: "og:description", content: "Guides and answers for getting the most from the assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How does the Smart Email Generator work?",
    a: "Enter the purpose of your email, who it is for, any key details and a tone. The assistant drafts a complete email with a subject line, greeting, clear body and closing. You can edit, copy or clear the draft before sending.",
  },
  {
    q: "What does the Meeting Notes Summarizer produce?",
    a: "Paste raw notes or a transcript and you get a structured output with a summary, key discussion points, decisions made, action items and next steps. The summary is editable and can be copied or downloaded.",
  },
  {
    q: "What can I ask the AI Chatbot?",
    a: "Anything workplace related: drafting client emails, summarizing reports, creating meeting agendas, improving business messages or generating ideas. It replies in clear, concise business language.",
  },
  {
    q: "Where are my preferences stored?",
    a: "Settings such as default tone, accent and AI response length are saved locally on your device and applied across the tools.",
  },
  {
    q: "Is AI output always accurate?",
    a: "No. Always review AI-generated content before sending it to colleagues or clients, especially when it contains dates, figures or commitments.",
  },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Help &amp; guides</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything you need to get productive quickly.</p>
      </div>

      <section className="surface-card rounded-xl px-5 py-2">
        <Accordion type="single" collapsible>
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <AiDisclaimer />
    </div>
  );
}
