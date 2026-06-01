import { Radar, Github, BookOpen, Database, Cpu, Code2, Scale } from "lucide-react";
import {
  GITHUB_URL,
  REPORT_URL,
  LIAR_PAPER_URL,
  LICENSE,
  LICENSE_URL,
} from "@/lib/site";

interface Props {
  onOpenLegal: (docId: string) => void;
}

export default function Footer({ onOpenLegal }: Props) {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-white/[0.08] pt-12">
      <div className="grid gap-10 md:grid-cols-4">
        {/* Brand column */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 shadow-glow">
              <Radar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                Veracity<span className="text-sky-500">.</span>ai
              </p>
              <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                misinformation detection · liar-bert
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            A free and open-source research project that classifies the veracity
            of political and news statements across six levels, fine-tuned on the
            LIAR benchmark with optional speaker-metadata fusion.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noreferrer"
              className="chip border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono hover:border-emerald-400 transition"
            >
              <Code2 className="h-3 w-3" /> Open Source · {LICENSE}
            </a>
            <span className="chip border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono">
              <Cpu className="h-3 w-3" /> BERT-base
            </span>
            <span className="chip border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono">
              <Database className="h-3 w-3" /> LIAR · WELFake
            </span>
          </div>
        </div>

        {/* Project column */}
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
            Project
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <a
                href={REPORT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-sky-500 transition"
              >
                <BookOpen className="h-3.5 w-3.5 text-sky-500" /> Final Report (PDF)
              </a>
            </li>
            <li>
              <a
                href={LIAR_PAPER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-sky-500 transition"
              >
                <Database className="h-3.5 w-3.5 text-sky-500" /> LIAR Benchmark (Wang 2017)
              </a>
            </li>
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-sky-500 transition"
              >
                <Github className="h-3.5 w-3.5" /> Source Code
              </a>
            </li>
          </ul>
        </div>

        {/* Legal column */}
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
            Legal
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <button onClick={() => onOpenLegal("terms")} className="inline-flex items-center gap-2 hover:text-sky-500 transition">
                <Scale className="h-3.5 w-3.5 text-sky-500" /> Terms &amp; Conditions
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal("privacy")} className="hover:text-sky-500 transition">
                Privacy &amp; Cookies Policy
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal("api")} className="hover:text-sky-500 transition">
                API Consumption Policy
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal("disclaimer")} className="hover:text-sky-500 transition">
                Legal Disclaimer
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Author + meta strip */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 border-t border-slate-200 dark:border-white/[0.06] pt-6">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Rahul Mishra
          </span>{" "}
          · MS Data Science, Northwestern University
          <br />
          <span className="text-xs">AI and Natural Language Processing</span>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-500 sm:text-right">
          <p className="font-mono text-[11px]">
            © {new Date().getFullYear()} Veracity.ai · educational use only
          </p>
          <p className="font-mono text-[11px]">
            built with FastAPI · React · TypeScript · PyTorch
          </p>
        </div>
      </div>

      <p className="mt-6 mb-2 text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-600">
        Predictions are probabilistic estimates, not authoritative fact-checks.
        This tool classifies text, not people, and must not be used to assert
        that any individual has lied or acted wrongfully.
      </p>
    </footer>
  );
}
