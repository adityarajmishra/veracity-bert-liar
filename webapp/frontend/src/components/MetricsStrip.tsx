import { Target, TrendingUp, Layers, Newspaper } from "lucide-react";
import type { MetricsResponse } from "@/types";

interface Props {
  metrics: MetricsResponse | null;
}

function pct(v?: number) {
  return v != null ? `${(v * 100).toFixed(1)}` : "—";
}

export default function MetricsStrip({ metrics }: Props) {
  const m = metrics?.model_metrics;
  const cards = [
    {
      icon: Target,
      label: "BERT macro-F1",
      value: pct(m?.bert_text_only?.macro_f1),
      unit: "%",
      hint: "LIAR · 6-class",
      accent: "from-sky-500/20 to-sky-500/5",
    },
    {
      icon: TrendingUp,
      label: "BERT accuracy",
      value: pct(m?.bert_text_only?.accuracy),
      unit: "%",
      hint: "vs Wang '17: 27%",
      accent: "from-cyan-500/20 to-cyan-500/5",
    },
    {
      icon: Layers,
      label: "Fusion macro-F1",
      value: pct(m?.bert_metadata_fusion?.macro_f1),
      unit: "%",
      hint: "text + metadata",
      accent: "from-teal-500/20 to-teal-500/5",
    },
    {
      icon: Newspaper,
      label: "WELFake acc",
      value: pct(m?.welfake_bert?.accuracy),
      unit: "%",
      hint: "binary · cross-domain",
      accent: "from-emerald-500/20 to-emerald-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="relative overflow-hidden rounded-2xl surface surface-hover p-4"
        >
          <div
            className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${c.accent} blur-2xl`}
          />
          <div className="relative">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <c.icon className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-wide">
                {c.label}
              </span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
              {c.value}
              <span className="text-sm text-slate-400">{c.unit}</span>
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {c.hint}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
