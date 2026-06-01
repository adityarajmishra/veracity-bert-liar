import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CodeSample } from "@/lib/apiDocs";
import { withBase } from "@/lib/apiDocs";
import { API_BASE } from "@/lib/site";

interface Props {
  samples: CodeSample[];
}

export default function CodeBlock({ samples }: Props) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const sample = samples[active];
  const code = withBase(sample.code, API_BASE);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1320]">
      {/* tabs + copy */}
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
        <div className="flex gap-1">
          {samples.map((s, i) => (
            <button
              key={s.lang}
              onClick={() => setActive(i)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                i === active
                  ? "bg-slate-700/70 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 hover:text-white transition"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed">
        <code className="font-mono text-slate-200">{code}</code>
      </pre>
    </div>
  );
}
