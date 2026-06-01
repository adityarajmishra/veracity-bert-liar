import { FileText, Boxes, GitMerge } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    tag: "01 · tokenize",
    title: "WordPiece encoding",
    body: "The statement is normalized and split into WordPiece tokens, capped at 128 to match the LIAR length distribution.",
  },
  {
    icon: Boxes,
    tag: "02 · encode",
    title: "BERT self-attention",
    body: "A fine-tuned bert-base-uncased runs 12 bidirectional attention layers; the [CLS] token aggregates context into a 768-d vector.",
  },
  {
    icon: GitMerge,
    tag: "03 · classify",
    title: "Softmax & fusion",
    body: "A linear head maps the embedding to six logits. With metadata, a fusion branch adds party and credit-history signals.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mt-16">
      <div className="text-center">
        <span className="font-mono text-[11px] uppercase tracking-widest text-sky-500">
          pipeline
        </span>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          From text to veracity in three stages
        </h2>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.tag}
            className="group rounded-2xl surface surface-hover p-6"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-sky-500/15 to-teal-500/15 border border-slate-200 dark:border-white/10">
                <s.icon className="h-5 w-5 text-sky-600 dark:text-sky-300" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                {s.tag}
              </span>
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
