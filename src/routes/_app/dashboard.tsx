import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Mail, MessageSquare, NotebookPen, TrendingUp, Gauge, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Track emails generated, summaries created, AI conversations and your productivity score.",
      },
      { property: "og:title", content: "Dashboard | AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Your AI productivity workspace at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Emails Generated", value: "128", delta: "+12 this week", icon: Mail },
  { label: "Summaries Created", value: "46", delta: "+5 this week", icon: FileText },
  { label: "AI Conversations", value: "312", delta: "+38 this week", icon: MessageSquare },
  { label: "Productivity Score", value: "87%", delta: "+4 pts", icon: Gauge },
];

const activity = [
  { title: "Client follow-up email", meta: "Smart Email Generator · 2h ago" },
  { title: "Q3 planning meeting summary", meta: "Meeting Notes Summarizer · 5h ago" },
  { title: "Agenda ideas for standup", meta: "AI Chatbot · Yesterday" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Good to see you again</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here is how your workspace is performing this week.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="surface-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-semibold">{s.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-success">
              <TrendingUp className="size-3" /> {s.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card rounded-xl p-5 lg:col-span-2">
          <h2 className="text-base font-semibold">Quick actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Jump straight into your most used AI tools.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Button asChild size="lg" className="justify-start">
              <Link to="/email-generator">
                <Mail /> Generate Email
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="justify-start">
              <Link to="/meeting-notes">
                <NotebookPen /> Summarize Notes
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="justify-start">
              <Link to="/assistant">
                <Bot /> Open AI Assistant
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Weekly productivity goal</span>
              <span className="text-muted-foreground">87 / 100</span>
            </div>
            <Progress value={87} className="mt-3" />
          </div>
        </div>

        <div className="surface-card rounded-xl p-5">
          <h2 className="text-base font-semibold">Recent activity</h2>
          <ul className="mt-4 space-y-4">
            {activity.map((a) => (
              <li key={a.title} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.meta}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
