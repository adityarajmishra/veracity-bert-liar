import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { Gauge, Cpu, Timer } from "lucide-react";
import type { PredictResponse } from "@/types";
import { LABELS, LABEL_MAP } from "@/lib/constants";

interface Props {
  result: PredictResponse;
}

interface TooltipPayloadEntry {
  payload: { name: string; value: number; color: string };
}

// Readable, theme-agnostic custom tooltip with a solid high-contrast surface.
function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}) {
  if (!active || !payload || !payload.length) return null;
  const { name, value, color } = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-900 px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs font-medium text-slate-100">{name}</span>
      </div>
      <p className="mt-1 font-mono text-sm font-bold text-white">
        {value}
        <span className="text-slate-400">% probability</span>
      </p>
    </div>
  );
}

export default function ResultPanel({ result }: Props) {
  const winner = LABEL_MAP[result.prediction];
  const chartData = LABELS.map((l) => ({
    name: l.label,
    value: +(result.probabilities[l.id] * 100).toFixed(1),
    color: l.color,
    isWinner: l.id === result.prediction,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mt-6 grid gap-5 lg:grid-cols-5"
    >
      {/* Verdict gauge */}
      <div className="lg:col-span-2 rounded-2xl surface ring-gradient p-6 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <Gauge className="h-3.5 w-3.5" /> verdict
        </div>

        <div className="relative mt-5 h-44 w-44">
          <svg className="h-44 w-44 -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={winner.color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={winner.color} />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-white/[0.06]"
              strokeWidth="7"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 42 * (1 - result.confidence),
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 6px ${winner.color}66)` }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <p className="font-mono text-4xl font-bold text-slate-900 dark:text-white">
                {(result.confidence * 100).toFixed(0)}
                <span className="text-lg text-slate-400">%</span>
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                confidence
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-2xl font-extrabold" style={{ color: winner.color }}>
          {result.prediction_display}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="chip border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300">
            <Cpu className="h-3 w-3" />
            {result.model_used}
          </span>
          <span className="chip border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 font-mono">
            <Timer className="h-3 w-3" />
            {result.latency_ms.toFixed(0)}ms
          </span>
        </div>
      </div>

      {/* Distribution chart */}
      <div className="lg:col-span-3 rounded-2xl surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Class probability distribution
          </h3>
          <span className="font-mono text-[10px] text-slate-400">softmax</span>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 26, right: 8, left: -12, bottom: 28 }}
            barCategoryGap="22%"
          >
            <defs>
              {chartData.map((d, i) => (
                <linearGradient
                  key={i}
                  id={`barGrad-${i}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={d.color} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={d.color} stopOpacity={0.35} />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-slate-500 dark:text-slate-400"
              interval={0}
              angle={-18}
              textAnchor="end"
              height={48}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-slate-400"
              unit="%"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltip />}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v: number) => `${v}%`}
                className="fill-slate-500 dark:fill-slate-300"
                style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
              />
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={`url(#barGrad-${i})`}
                  stroke={entry.isWinner ? entry.color : "transparent"}
                  strokeWidth={entry.isWinner ? 1.5 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
