import { useEffect, useState } from "react";
import { Radar, Github, Sun, Moon } from "lucide-react";
import type { Theme } from "@/hooks/useTheme";
import { GITHUB_URL } from "@/lib/site";

interface NavbarProps {
  online: boolean;
  device?: string;
  theme: Theme;
  onToggleTheme: () => void;
  view: "home" | "docs";
  onNavigate: (view: "home" | "docs") => void;
}

// Translate the raw compute device into plain language.
function humanDevice(device: string): string {
  const d = device.toLowerCase();
  if (d.includes("cuda")) return "NVIDIA GPU";
  if (d.includes("mps")) return "Apple Silicon GPU";
  return "CPU";
}

export default function Navbar({ online, device, theme, onToggleTheme, view, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 dark:border-white/[0.08] bg-paper-50/90 dark:bg-ink-950/85 backdrop-blur-xl shadow-soft"
          : "border-b border-transparent bg-paper-50/70 dark:bg-ink-950/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-24 sm:h-28 flex items-center justify-between">
        {/* Brand — top left */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 sm:gap-4 text-left"
          aria-label="Go to home"
        >
          <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 shadow-glow">
            <Radar className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Veracity<span className="text-sky-500">.</span>ai
            </p>
            <p className="font-mono text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              misinformation detection · liar-bert
            </p>
          </div>
        </button>

        {/* Center nav tabs */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] p-1">
          <button
            onClick={() => onNavigate("home")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              view === "home"
                ? "bg-slate-900 text-white dark:bg-white dark:text-ink-950"
                : "text-slate-600 dark:text-slate-300 hover:text-sky-500"
            }`}
          >
            Detector
          </button>
          <button
            onClick={() => onNavigate("docs")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              view === "docs"
                ? "bg-slate-900 text-white dark:bg-white dark:text-ink-950"
                : "text-slate-600 dark:text-slate-300 hover:text-sky-500"
            }`}
          >
            API Docs
          </button>
        </div>

        {/* Controls — top right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-3 py-1.5"
            title={
              online
                ? `The AI model is loaded and ready to analyze statements${
                    device ? ` (running on ${humanDevice(device)})` : ""
                  }.`
                : "The model service is not reachable right now."
            }
          >
            <span className="relative flex h-2 w-2">
              {online && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  online ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
            </span>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              {online ? "Model ready" : "Model offline"}
            </span>
          </div>

          <button
            onClick={onToggleTheme}
            className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:text-sky-500 hover:border-sky-400 transition"
            aria-label="Toggle light or dark theme"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:text-sky-500 hover:border-sky-400 transition"
            aria-label="GitHub repository"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Mobile nav tabs */}
      <div className="md:hidden border-t border-slate-200/70 dark:border-white/[0.06] px-4 pb-2 pt-1 flex gap-1">
        <button
          onClick={() => onNavigate("home")}
          className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            view === "home"
              ? "bg-slate-900 text-white dark:bg-white dark:text-ink-950"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          Detector
        </button>
        <button
          onClick={() => onNavigate("docs")}
          className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            view === "docs"
              ? "bg-slate-900 text-white dark:bg-white dark:text-ink-950"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          API Docs
        </button>
      </div>
    </nav>
  );
}
