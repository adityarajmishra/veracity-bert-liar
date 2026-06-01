import { useMemo, useState } from "react";
import { Search, Terminal, ShieldCheck, Code2, BookOpen } from "lucide-react";
import { DOC_GROUPS } from "@/lib/apiDocs";
import type { Endpoint } from "@/lib/apiDocs";
import { API_BASE, API_DOCS_URL, GITHUB_URL } from "@/lib/site";
import CodeBlock from "@/components/CodeBlock";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
  POST: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",
};

function MethodPill({ method }: { method: string }) {
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${METHOD_COLORS[method]}`}
    >
      {method}
    </span>
  );
}

export default function ApiDocs() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>("overview");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DOC_GROUPS;
    return DOC_GROUPS.map((g) => ({
      ...g,
      endpoints: g.endpoints.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.path.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      ),
    })).filter((g) => g.endpoints.length > 0);
  }, [query]);

  function scrollTo(id: string) {
    setActiveId(id);
    const el = document.getElementById(`doc-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
      {/* Header band */}
      <div className="rounded-2xl surface ring-gradient p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-300">
          <Code2 className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-widest">
            open-source REST API · MIT
          </span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Veracity API Reference
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          Consume the misinformation-detection model from your own app. No API
          key required — access is governed by fair-use rate limits. All
          endpoints return JSON.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <code className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
            Base URL: {API_BASE}
          </code>
          <a
            href={API_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-300 hover:underline"
          >
            <Terminal className="h-3.5 w-3.5" /> Interactive Swagger UI
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-300 hover:underline"
          >
            <BookOpen className="h-3.5 w-3.5" /> Source on GitHub
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
        {/* Sidebar — stays pinned while the endpoint content scrolls */}
        <aside className="lg:sticky lg:top-32 self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto pr-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search endpoints…"
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>

          <nav className="mt-4 space-y-4">
            <button
              onClick={() => scrollTo("overview")}
              className={`block w-full text-left text-sm font-medium transition ${
                activeId === "overview"
                  ? "text-sky-600 dark:text-sky-300"
                  : "text-slate-600 dark:text-slate-400 hover:text-sky-500"
              }`}
            >
              Overview
            </button>
            {filtered.map((group) => (
              <div key={group.id}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  {group.title}
                </p>
                <ul className="mt-2 space-y-1">
                  {group.endpoints.map((e) => (
                    <li key={e.id}>
                      <button
                        onClick={() => scrollTo(e.id)}
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${
                          activeId === e.id
                            ? "bg-sky-500/10 text-sky-600 dark:text-sky-300"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        <MethodPill method={e.method} />
                        <span className="truncate">{e.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 space-y-12">
          {/* Overview / auth */}
          <section id="doc-overview" className="scroll-mt-28">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Authentication &amp; rate limits
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              The API is open and requires no authentication. To keep it
              available for everyone and prevent abuse, requests are rate-limited
              per client IP. Browser apps may only call the API from the official
              frontend origin; server-to-server calls are unrestricted by origin.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl surface p-4">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-semibold">Rate limits</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><code className="font-mono">POST /predict</code> — 30 / min / IP</li>
                  <li>All other endpoints — 120 / min / IP</li>
                  <li>429 responses include a <code className="font-mono">Retry-After</code> header</li>
                </ul>
              </div>
              <div className="rounded-xl surface p-4">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Code2 className="h-4 w-4 text-sky-500" />
                  <span className="text-sm font-semibold">Conventions</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>JSON request and response bodies</li>
                  <li>UTF-8; <code className="font-mono">Content-Type: application/json</code></li>
                  <li>Every response carries an <code className="font-mono">X-Request-ID</code></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Endpoints */}
          {filtered.map((group) =>
            group.endpoints.map((e) => (
              <EndpointBlock key={e.id} endpoint={e} />
            ))
          )}

          {filtered.length === 0 && (
            <p className="text-sm text-slate-500">
              No endpoints match “{query}”.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EndpointBlock({ endpoint }: { endpoint: Endpoint }) {
  return (
    <section id={`doc-${endpoint.id}`} className="scroll-mt-28">
      <div className="flex flex-wrap items-center gap-3">
        <MethodPill method={endpoint.method} />
        <code className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
          {endpoint.path}
        </code>
      </div>
      <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
        {endpoint.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {endpoint.description}
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Left: params + response */}
        <div className="space-y-5">
          {endpoint.params && endpoint.params.length > 0 && (
            <div className="rounded-xl surface p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Body parameters
              </p>
              <ul className="mt-3 space-y-3">
                {endpoint.params.map((p) => (
                  <li key={p.name} className="text-sm">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-slate-800 dark:text-slate-200">
                        {p.name}
                      </code>
                      <span className="font-mono text-[11px] text-slate-400">
                        {p.type}
                      </span>
                      {p.required ? (
                        <span className="rounded bg-rose-500/15 px-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-300">
                          required
                        </span>
                      ) : (
                        <span className="rounded bg-slate-500/15 px-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          optional
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                      {p.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Response · 200
            </p>
            <pre className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-4 text-[12.5px] leading-relaxed">
              <code className="font-mono text-slate-700 dark:text-slate-300">
                {endpoint.responseExample}
              </code>
            </pre>
          </div>
        </div>

        {/* Right: code samples */}
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            Request
          </p>
          <CodeBlock samples={endpoint.samples} />
        </div>
      </div>
    </section>
  );
}
