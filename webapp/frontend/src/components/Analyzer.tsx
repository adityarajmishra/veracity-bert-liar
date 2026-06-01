import { useState } from "react";
import { Wand2, Loader2, ChevronDown, AlertCircle, CornerDownLeft } from "lucide-react";
import type { ExampleItem } from "@/types";
import { PARTIES } from "@/lib/constants";

interface Props {
  onAnalyze: (statement: string, party: string | null) => void;
  loading: boolean;
  error: string | null;
  examples: ExampleItem[];
}

export default function Analyzer({ onAnalyze, loading, error, examples }: Props) {
  const [statement, setStatement] = useState("");
  const [party, setParty] = useState("none");
  const [useMetadata, setUseMetadata] = useState(false);

  function submit() {
    onAnalyze(statement, useMetadata ? party : null);
  }

  function loadExample(ex: ExampleItem) {
    setStatement(ex.statement);
    if (ex.party) {
      setParty(ex.party);
      setUseMetadata(ex.party !== "none");
    }
  }

  return (
    <div className="rounded-2xl surface ring-gradient p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Input statement
        </label>
        <span className="font-mono text-[10px] text-slate-400">
          {statement.length}/2000
        </span>
      </div>

      <textarea
        value={statement}
        onChange={(e) => setStatement(e.target.value.slice(0, 2000))}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
        }}
        rows={4}
        placeholder="e.g. The unemployment rate has dropped to the lowest level in 50 years."
        className="w-full resize-none rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-4 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setUseMetadata((v) => !v)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
              useMetadata
                ? "bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/40"
                : "border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            <span
              className={`grid h-3.5 w-3.5 place-items-center rounded border ${
                useMetadata
                  ? "bg-sky-500 border-sky-500"
                  : "border-slate-400 dark:border-slate-500"
              }`}
            >
              {useMetadata && <span className="h-1.5 w-1.5 rounded-sm bg-white" />}
            </span>
            Metadata fusion
          </button>

          {useMetadata && (
            <div className="relative">
              <select
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="appearance-none rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 pl-3 pr-9 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                {PARTIES.map((p) => (
                  <option key={p} value={p} className="bg-white dark:bg-ink-900">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          )}
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4 transition group-hover:rotate-12" />
          )}
          {loading ? "Analyzing…" : "Analyze"}
          {!loading && (
            <kbd className="ml-1 hidden sm:flex items-center gap-0.5 rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px]">
              <CornerDownLeft className="h-2.5 w-2.5" />
            </kbd>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {examples.length > 0 && (
        <div className="mt-5 border-t border-slate-100 dark:border-white/[0.06] pt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-2">
            samples
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.slice(0, 4).map((ex, i) => (
              <button
                key={i}
                onClick={() => loadExample(ex)}
                className="max-w-xs truncate rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-left text-xs text-slate-500 dark:text-slate-400 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition"
                title={ex.statement}
              >
                {ex.statement}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
