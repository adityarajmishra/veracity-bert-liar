# Veracity API — Consumer Guide

The Veracity API is a free, open-source HTTP service that classifies the
veracity of a text statement using a fine-tuned BERT model. This guide shows
how to consume it from your own application.

- **Base URL (local):** `http://127.0.0.1:8000`
- **Base URL (production):** your Render URL, e.g. `https://veracity-api.onrender.com`
- **Interactive docs:** `<base>/docs` (Swagger UI)
- **Schema:** `<base>/openapi.json`
- **License:** MIT (open source)

## Authentication

None required. The API is open. Access is governed by **rate limits** and
**CORS** rather than keys:

- Browser apps may only call the API from allowed origins (the official
  frontend domain in production). Server-to-server calls are not origin-limited.
- All clients are subject to per-IP rate limits (see below).

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Liveness + whether the model is loaded |
| GET | `/api-info` | License, repo, rate limits, usage policy |
| GET | `/labels` | The six veracity classes |
| GET | `/examples` | Sample statements |
| GET | `/metrics` | Service metrics + model performance |
| POST | `/predict` | Classify a statement |

## `POST /predict`

**Request body**

```json
{
  "statement": "The unemployment rate is the lowest in 50 years.",
  "party": "republican",          // optional — enables metadata fusion
  "credit_history": [0,1,0,2,0]   // optional — [barely, false, half, mostly, pants]
}
```

**Response**

```json
{
  "prediction": "half-true",
  "prediction_display": "Half True",
  "confidence": 0.36,
  "probabilities": {
    "pants-fire": 0.05, "false": 0.18, "barely-true": 0.20,
    "half-true": 0.36, "mostly-true": 0.14, "true": 0.07
  },
  "model_used": "BERT + Metadata Fusion",
  "latency_ms": 12.4,
  "request_id": "1f3c…"
}
```

### Example — cURL

```bash
curl -X POST "$BASE/predict" \
  -H "Content-Type: application/json" \
  -d '{"statement":"Crime rose 500% in two years."}'
```

### Example — Python

```python
import requests
r = requests.post(f"{BASE}/predict", json={"statement": "..."})
r.raise_for_status()
print(r.json()["prediction_display"], r.json()["confidence"])
```

### Example — JavaScript (fetch)

```js
const res = await fetch(`${BASE}/predict`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ statement: "..." }),
});
const data = await res.json();
console.log(data.prediction_display, data.confidence);
```

## Rate Limits

| Scope | Limit |
| --- | --- |
| `POST /predict` | 30 requests / minute / IP |
| All other endpoints | 120 requests / minute / IP |

Exceeding a limit returns **HTTP 429** with a `Retry-After` header and a JSON
body describing the limit. Every response includes `X-RateLimit-Limit` and
`X-RateLimit-Remaining` headers so you can self-throttle.

## Usage Policy

- Free for research and educational use within the rate limits.
- Predictions are **probabilistic estimates, not authoritative fact-checks.**
- Do not use outputs to assert that an identifiable person has lied.
- Do not attempt to bypass rate limits or scrape in bulk.
- Attribution to the project repository is appreciated.

## Errors

| Status | Meaning |
| --- | --- |
| 422 | Invalid request (e.g. statement too short/long) |
| 429 | Rate limit exceeded — back off and retry after `Retry-After` |
| 500 | Internal error (a `request_id` is returned for debugging) |
| 503 | Model not loaded yet (cold start) — retry shortly |
