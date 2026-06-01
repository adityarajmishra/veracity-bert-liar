import type { LabelMeta, VeracityId } from "@/types";

// Veracity classes ordered from most false to most true.
// Eye-soothing engineering palette (muted, not neon).
export const LABELS: LabelMeta[] = [
  { id: "pants-fire", label: "Pants on Fire", color: "#e11d48", bg: "#fff1f2", ring: "#fb7185" },
  { id: "false", label: "False", color: "#f43f5e", bg: "#fff1f2", ring: "#fda4af" },
  { id: "barely-true", label: "Barely True", color: "#f59e0b", bg: "#fffbeb", ring: "#fcd34d" },
  { id: "half-true", label: "Half True", color: "#eab308", bg: "#fefce8", ring: "#fde047" },
  { id: "mostly-true", label: "Mostly True", color: "#22c55e", bg: "#f0fdf4", ring: "#86efac" },
  { id: "true", label: "True", color: "#10b981", bg: "#ecfdf5", ring: "#6ee7b7" },
];

export const LABEL_MAP: Record<VeracityId, LabelMeta> = Object.fromEntries(
  LABELS.map((l) => [l.id, l])
) as Record<VeracityId, LabelMeta>;

export const PARTIES = [
  "none",
  "democrat",
  "republican",
  "independent",
  "libertarian",
  "green",
  "organization",
  "journalist",
  "talk-show-host",
];

export const FALLBACK_EXAMPLES = [
  {
    statement: "The unemployment rate has dropped to the lowest level in 50 years.",
    party: "republican",
  },
  {
    statement: "Our state spends more per student on education than any country in the world.",
    party: "democrat",
  },
  {
    statement: "Crime has increased by 500 percent in the last two years across the country.",
    party: "republican",
  },
  {
    statement: "Ninety percent of scientists agree that the new policy will help the economy.",
    party: "democrat",
  },
];
