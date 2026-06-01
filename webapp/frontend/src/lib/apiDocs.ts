// Structured API documentation data, rendered as a Stripe-style docs page.
// Each endpoint carries multi-language code samples and request/response shapes.

export type HttpMethod = "GET" | "POST";

export interface CodeSample {
  lang: "curl" | "python" | "javascript";
  label: string;
  code: string;
}

export interface Endpoint {
  id: string;
  method: HttpMethod;
  path: string;
  title: string;
  description: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  responseExample: string;
  samples: CodeSample[];
}

export interface DocSection {
  id: string;
  title: string;
  endpoints: Endpoint[];
}

const BASE_PLACEHOLDER = "$BASE";

export const DOC_GROUPS: DocSection[] = [
  {
    id: "inference",
    title: "Inference",
    endpoints: [
      {
        id: "predict",
        method: "POST",
        path: "/predict",
        title: "Classify a statement",
        description:
          "Returns the predicted veracity class and the full probability distribution across all six levels. Supply optional speaker metadata to use the fusion model.",
        params: [
          { name: "statement", type: "string", required: true, description: "The claim to classify (3–2000 characters)." },
          { name: "party", type: "string", required: false, description: "Speaker party affiliation. Enables the metadata-fusion model." },
          { name: "credit_history", type: "number[5]", required: false, description: "[barely_true, false, half_true, mostly_true, pants_on_fire] prior counts." },
        ],
        responseExample: `{
  "prediction": "half-true",
  "prediction_display": "Half True",
  "confidence": 0.36,
  "probabilities": {
    "pants-fire": 0.05, "false": 0.18, "barely-true": 0.20,
    "half-true": 0.36, "mostly-true": 0.14, "true": 0.07
  },
  "model_used": "BERT + Metadata Fusion",
  "latency_ms": 12.4,
  "request_id": "1f3c8a..."
}`,
        samples: [
          {
            lang: "curl",
            label: "cURL",
            code: `curl -X POST "${BASE_PLACEHOLDER}/predict" \\
  -H "Content-Type: application/json" \\
  -d '{"statement":"Crime rose 500% in two years."}'`,
          },
          {
            lang: "python",
            label: "Python",
            code: `import requests

resp = requests.post(
    "${BASE_PLACEHOLDER}/predict",
    json={"statement": "Crime rose 500% in two years.", "party": "republican"},
    timeout=30,
)
resp.raise_for_status()
data = resp.json()
print(data["prediction_display"], round(data["confidence"], 3))`,
          },
          {
            lang: "javascript",
            label: "JavaScript",
            code: `const res = await fetch("${BASE_PLACEHOLDER}/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ statement: "Crime rose 500% in two years." }),
});
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const data = await res.json();
console.log(data.prediction_display, data.confidence);`,
          },
        ],
      },
    ],
  },
  {
    id: "metadata",
    title: "Metadata",
    endpoints: [
      {
        id: "labels",
        method: "GET",
        path: "/labels",
        title: "List veracity labels",
        description: "Returns the six ordered veracity classes with display names.",
        responseExample: `[
  { "id": "pants-fire", "display": "Pants on Fire" },
  { "id": "false", "display": "False" },
  { "id": "barely-true", "display": "Barely True" },
  { "id": "half-true", "display": "Half True" },
  { "id": "mostly-true", "display": "Mostly True" },
  { "id": "true", "display": "True" }
]`,
        samples: [
          { lang: "curl", label: "cURL", code: `curl "${BASE_PLACEHOLDER}/labels"` },
          { lang: "python", label: "Python", code: `import requests\nprint(requests.get("${BASE_PLACEHOLDER}/labels").json())` },
          { lang: "javascript", label: "JavaScript", code: `const labels = await (await fetch("${BASE_PLACEHOLDER}/labels")).json();` },
        ],
      },
      {
        id: "examples",
        method: "GET",
        path: "/examples",
        title: "Sample statements",
        description: "Returns a small set of example statements suitable for demos.",
        responseExample: `[
  { "statement": "The unemployment rate ...", "party": "republican" },
  { "statement": "Our state spends ...", "party": "democrat" }
]`,
        samples: [
          { lang: "curl", label: "cURL", code: `curl "${BASE_PLACEHOLDER}/examples"` },
          { lang: "python", label: "Python", code: `import requests\nprint(requests.get("${BASE_PLACEHOLDER}/examples").json())` },
          { lang: "javascript", label: "JavaScript", code: `const ex = await (await fetch("${BASE_PLACEHOLDER}/examples")).json();` },
        ],
      },
    ],
  },
  {
    id: "system",
    title: "System",
    endpoints: [
      {
        id: "health",
        method: "GET",
        path: "/health",
        title: "Health check",
        description: "Liveness probe; reports whether the model is loaded and the compute device.",
        responseExample: `{
  "status": "ok",
  "service": "Veracity API — Misinformation Detection",
  "version": "1.0.0",
  "environment": "production",
  "model_loaded": true,
  "device": "cuda"
}`,
        samples: [
          { lang: "curl", label: "cURL", code: `curl "${BASE_PLACEHOLDER}/health"` },
          { lang: "python", label: "Python", code: `import requests\nprint(requests.get("${BASE_PLACEHOLDER}/health").json())` },
          { lang: "javascript", label: "JavaScript", code: `const h = await (await fetch("${BASE_PLACEHOLDER}/health")).json();` },
        ],
      },
      {
        id: "api-info",
        method: "GET",
        path: "/api-info",
        title: "API info & policy",
        description: "Open-source metadata: license, repository, rate limits, and usage policy.",
        responseExample: `{
  "service": "Veracity API — Misinformation Detection",
  "version": "1.0.0",
  "license": "MIT",
  "repository": "https://github.com/.../veracity-bert-liar",
  "rate_limits": { "predict": "30/minute", "default": "120/minute" },
  "usage_policy": "Free for research and educational use ..."
}`,
        samples: [
          { lang: "curl", label: "cURL", code: `curl "${BASE_PLACEHOLDER}/api-info"` },
          { lang: "python", label: "Python", code: `import requests\nprint(requests.get("${BASE_PLACEHOLDER}/api-info").json())` },
          { lang: "javascript", label: "JavaScript", code: `const info = await (await fetch("${BASE_PLACEHOLDER}/api-info")).json();` },
        ],
      },
      {
        id: "metrics",
        method: "GET",
        path: "/metrics",
        title: "Service metrics",
        description: "Uptime, request counts, average latency, and published model performance.",
        responseExample: `{
  "uptime_seconds": 3821.4,
  "total_requests": 1042,
  "total_predictions": 869,
  "error_count": 0,
  "avg_latency_ms": 13.8,
  "model_metrics": { "bert_text_only": { "macro_f1": 0.284, "accuracy": 0.284 } }
}`,
        samples: [
          { lang: "curl", label: "cURL", code: `curl "${BASE_PLACEHOLDER}/metrics"` },
          { lang: "python", label: "Python", code: `import requests\nprint(requests.get("${BASE_PLACEHOLDER}/metrics").json())` },
          { lang: "javascript", label: "JavaScript", code: `const m = await (await fetch("${BASE_PLACEHOLDER}/metrics")).json();` },
        ],
      },
    ],
  },
];

// Replace the $BASE placeholder with the live API base at render time.
export function withBase(code: string, base: string): string {
  return code.split(BASE_PLACEHOLDER).join(base);
}
