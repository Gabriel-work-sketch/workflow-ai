import { useEffect, useState } from "react";
import { Copy, Download, Eraser } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/AiDisclaimer";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  downloadName?: string;
  loading?: boolean;
};

export function OutputPanel({ value, onChange, placeholder, downloadName, loading }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName ?? "output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={loading ? "Generating with AI…" : placeholder}
        className="min-h-[320px] flex-1 resize-none bg-background/40 font-mono text-sm leading-relaxed"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={copy} disabled={!value}>
          <Copy /> {copied ? "Copied" : "Copy"}
        </Button>
        {downloadName ? (
          <Button variant="secondary" size="sm" onClick={download} disabled={!value}>
            <Download /> Download
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" onClick={() => onChange("")} disabled={!value}>
          <Eraser /> Clear
        </Button>
      </div>
      <AiDisclaimer />
    </div>
  );
}
