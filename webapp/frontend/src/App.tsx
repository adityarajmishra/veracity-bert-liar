import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Analyzer from "@/components/Analyzer";
import ResultPanel from "@/components/ResultPanel";
import MetricsStrip from "@/components/MetricsStrip";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import LegalModal from "@/components/LegalModal";
import ApiDocs from "@/components/ApiDocs";
import { useTheme } from "@/hooks/useTheme";
import { getHealth, getMetrics, getExamples, predict, ApiError } from "@/lib/api";
import { FALLBACK_EXAMPLES } from "@/lib/constants";
import type {
  ExampleItem,
  HealthResponse,
  MetricsResponse,
  PredictResponse,
} from "@/types";

type View = "home" | "docs";

export default function App() {
  const { theme, toggle } = useTheme();
  const [view, setView] = useState<View>("home");
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [examples, setExamples] = useState<ExampleItem[]>(FALLBACK_EXAMPLES);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [legalDoc, setLegalDoc] = useState<string | null>(null);

  useEffect(() => {
    getHealth().then(setHealth).catch(() => setHealth(null));
    getMetrics().then(setMetrics).catch(() => {});
    getExamples()
      .then((ex) => ex.length && setExamples(ex))
      .catch(() => {});
  }, []);

  function navigate(next: View) {
    setView(next);
    // Always land at the top when switching views.
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  async function handleAnalyze(statement: string, party: string | null) {
    if (!statement.trim() || statement.trim().length < 3) {
      setError("Please enter a statement of at least three characters.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await predict(statement, party);
      setResult(res);
      getMetrics().then(setMetrics).catch(() => {});
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? `API error: ${e.message}`
          : "Could not reach the model API. Make sure the backend is running.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <Background />
      <Navbar
        online={!!health?.model_loaded}
        device={health?.device}
        theme={theme}
        onToggleTheme={toggle}
        view={view}
        onNavigate={navigate}
      />

      {/* Spacer to offset the fixed navbar.
          mobile: 96px bar + 48px tab row = 144px (h-36)
          sm:    112px bar + 48px tab row = 160px (h-40)
          md+:   112px bar, tab row hidden (h-28) */}
      <div aria-hidden className="h-36 sm:h-40 md:h-28" />

      {view === "home" ? (
        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
          <Hero />

          <div className="space-y-6">
            <Analyzer
              onAnalyze={handleAnalyze}
              loading={loading}
              error={error}
              examples={examples}
            />

            <AnimatePresence mode="wait">
              {result && <ResultPanel key={result.request_id} result={result} />}
            </AnimatePresence>

            <MetricsStrip metrics={metrics} />
          </div>

          <Reveal>
            <HowItWorks />
          </Reveal>

          <Reveal>
            <Footer onOpenLegal={setLegalDoc} />
          </Reveal>
        </main>
      ) : (
        <main>
          <ApiDocs />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
            <Footer onOpenLegal={setLegalDoc} />
          </div>
        </main>
      )}

      <LegalModal docId={legalDoc} onClose={() => setLegalDoc(null)} />
    </div>
  );
}
