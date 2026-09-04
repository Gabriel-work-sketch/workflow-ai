import { ShieldAlert } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`mt-4 flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <span>
        AI-generated content may contain inaccuracies and should be reviewed before use. This tool is designed to assist
        workplace productivity and should not replace professional judgment.
      </span>
    </p>
  );
}
