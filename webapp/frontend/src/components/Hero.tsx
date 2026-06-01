import { motion } from "framer-motion";
import { Cpu, Activity, Code2 } from "lucide-react";
import { GITHUB_URL } from "@/lib/site";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <motion.header
      variants={container}
      initial="hidden"
      animate="show"
      className="relative pt-12 sm:pt-20 pb-10 text-center"
    >
      <div className="mx-auto max-w-3xl px-2">
        <motion.div variants={item} className="flex flex-wrap justify-center gap-2">
          <span className="chip border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-sky-600 dark:text-sky-300">
            <Activity className="h-3.5 w-3.5" />
            <span className="font-mono">transformer · 110M params · LIAR benchmark</span>
          </span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="chip border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:border-emerald-400 transition"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span className="font-mono">open source · MIT</span>
          </a>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-7 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          Is that statement
          <br className="hidden sm:block" />{" "}
          <span className="text-gradient">true?</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl mx-auto"
        >
          Paste any political or news claim — from a headline, a speech, or a
          social post — and an AI language model estimates how truthful it is
          across six levels, from <span className="font-medium text-emerald-600 dark:text-emerald-400">True</span> to{" "}
          <span className="font-medium text-rose-600 dark:text-rose-400">Pants&nbsp;on&nbsp;Fire</span>.
          Free, open source, and built on the LIAR research benchmark.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-mono text-xs sm:text-[13px] text-slate-500 dark:text-slate-400"
        >
          <span className="inline-flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5" /> POST /predict
          </span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>softmax over 6 classes</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>~12ms inference</span>
        </motion.div>
      </div>
    </motion.header>
  );
}
