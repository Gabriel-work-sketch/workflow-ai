import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signIn } from "@/lib/settings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Sign in to the AI Workplace Productivity Assistant to generate professional emails, summarize meeting notes and chat with your AI work assistant.",
      },
      { property: "og:title", content: "Sign In | AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate workplace tasks with AI: smart emails, meeting summaries and a productivity chatbot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and a password of at least 4 characters.");
      return;
    }
    setError("");
    setLoading(true);
    const name = (email.split("@")[0] ?? "there")
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    signIn({ name, email });
    setTimeout(() => navigate({ to: "/dashboard" }), 350);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -top-40 -left-32 size-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-40 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="mb-6 flex items-center gap-3">
            <span className="brand-gradient flex size-11 items-center justify-center rounded-2xl text-primary-foreground">
              <Sparkles className="size-6" />
            </span>
            <span className="text-lg font-semibold">AI Workplace Productivity Assistant</span>
          </div>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight">
            Do your best work, with <span className="text-primary">AI on your team</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Draft professional emails, turn long meeting notes into clear action items and get instant answers from an
            assistant built for the workplace.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {["Smart Email Generator", "Meeting Notes Summarizer", "AI Workplace Chatbot"].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card rounded-2xl p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="brand-gradient flex size-10 items-center justify-center rounded-xl text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <span className="font-semibold">AI Workplace</span>
          </div>
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your workspace.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                Remember me
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo workspace — use any email and password to explore the platform.
          </p>
        </section>
      </div>
    </main>
  );
}
