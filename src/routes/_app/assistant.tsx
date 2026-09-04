import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Bot, Loader2, SendHorizontal, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { chatWithAssistant } from "@/lib/ai.functions";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/_app/assistant")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content: "Chat with a professional AI assistant for drafting emails, agendas, summaries and workplace ideas.",
      },
      { property: "og:title", content: "AI Chatbot | AI Workplace Assistant" },
      { property: "og:description", content: "Your always-on workplace productivity assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Assistant,
});

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Draft a client email",
  "Summarize this report",
  "Create a meeting agenda",
  "Improve this business message",
  "Generate workplace ideas",
];

function Assistant() {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fn = useServerFn(chatWithAssistant);
  const mutation = useMutation({
    mutationFn: (next: Message[]) => fn({ data: { messages: next, length: settings.responseLength } }),
    onSuccess: (res) => setMessages((prev) => [...prev, { role: "assistant", content: res.content }]),
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || mutation.isPending) return;
    const next: Message[] = [...messages, { role: "user", content: value }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-4xl flex-col">
      <div className="surface-card flex min-h-0 flex-1 flex-col rounded-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="brand-gradient flex size-8 items-center justify-center rounded-lg text-primary-foreground">
              <Bot className="size-4" />
            </span>
            <div>
              <div className="text-sm font-semibold">AI Workplace Chatbot</div>
              <div className="text-xs text-muted-foreground">Professional, concise, productivity focused</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMessages([])} disabled={!messages.length}>
            <Trash2 /> Clear
          </Button>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <h1 className="text-lg font-semibold">How can I help you work faster today?</h1>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these to get started.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" ? (
                  <span className="brand-gradient mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-primary-foreground">
                    <Bot className="size-4" />
                  </span>
                ) : null}
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" ? (
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <User className="size-4" />
                  </span>
                ) : null}
              </div>
            ))
          )}
          {mutation.isPending ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          ) : null}
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask the assistant anything about your work…"
              className="max-h-40 min-h-11 flex-1 resize-none bg-background/40"
            />
            <Button size="icon" className="size-11" onClick={() => send(input)} disabled={!input.trim() || mutation.isPending}>
              <SendHorizontal />
            </Button>
          </div>
          <AiDisclaimer className="mt-3" />
        </div>
      </div>
    </div>
  );
}
