<div align="center">

# 🛰️ Veracity.ai

### Fine-grained misinformation detection with transformer language models

*Can a machine tell how true a political statement is? This project finds out — and explains exactly why it can only go so far.*

<p>
  <img alt="Python" src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white">
  <img alt="PyTorch" src="https://img.shields.io/badge/PyTorch-2.x-EE4C2C?logo=pytorch&logoColor=white">
  <img alt="Transformers" src="https://img.shields.io/badge/🤗%20Transformers-BERT%20%7C%20RoBERTa-FFD21E">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-22c55e">
</p>

<p>
  <a href="#-live-demo">Live Demo</a> ·
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-api">API</a> ·
  <a href="#-results">Results</a> ·
  <a href="#-key-findings">Key Findings</a> ·
  <a href="#-report">Report</a>
</p>

</div>

---

## ✨ What is this?

**Veracity.ai** classifies the truthfulness of a short political or news statement across **six ordinal levels** — from `True` to `Pants on Fire` — using a fine-tuned **BERT** model trained on the **LIAR** benchmark (Wang 2017).

It is a complete, end-to-end project:

- 🧠 **Four models** benchmarked: TF-IDF + Logistic Regression, fine-tuned BERT, a BERT + speaker-metadata fusion network, and RoBERTa.
- 🌐 **A production-grade web app** — a typed React frontend backed by a monitored, rate-limited FastAPI service.
- 📊 **A rigorous 30-page analysis** that turns a "modest" accuracy number into a defensible scientific finding.
- 🔓 **Fully open source** under the MIT license.

> **Responsible-AI note.** Predictions are *probabilistic estimates, not authoritative fact-checks.* The model classifies **text, not people**, and is built as a human-in-the-loop triage aid.

---

## 🎯 The problem

Most "fake news" research solves the easy binary problem (*real* vs. *fake*). This project tackles the harder, more honest one: **six-level veracity**, mirroring how professional fact-checkers actually reason. That choice surfaces three deep challenges:

| Challenge | Why it's hard |
|---|---|
| **Ordinal label ambiguity** | The line between `half-true` and `mostly-true` is editorial judgment — irreducible label noise that caps any model's ceiling. |
| **Short text** | LIAR statements average **under 20 tokens**, starving the model of context. |
| **Class imbalance** | The critical `pants-fire` class has ~⅕ the examples of the majority classes. |

---

## 🏗️ Architecture

```
                          ┌─────────────────────────────┐
   "Crime rose 500%..."   │   Frontend — React + TS      │
        │                 │   Vite · Tailwind · Recharts │
        ▼                 │   (deployed on Vercel)       │
   ┌─────────┐  HTTPS      └──────────────┬──────────────┘
   │ Browser │ ───────────────────────────┤  POST /predict
   └─────────┘                            ▼
                          ┌─────────────────────────────┐
                          │   Backend — FastAPI          │
                          │   rate-limit · logging ·     │
                          │   metrics · security headers │
                          │   (deployed on Render)       │
                          └──────────────┬──────────────┘
                                         ▼
              ┌───────────────────────────────────────────────┐
              │  Text  → BERT [CLS] (768-d) ─┐                  │
              │                              ├─ fuse → 6 classes│
              │  Meta  → FFN (128-d) ────────┘                  │
              └───────────────────────────────────────────────┘
```

The **dual-stream fusion** model encodes the statement through BERT and the
speaker's party + credit-history through a parallel feedforward branch, then
concatenates both before the classification head.

---

## 📊 Results

Test-set performance on the **LIAR** benchmark (six-class) and **WELFake** (binary):

| Model | Accuracy | Macro-F1 |
|---|:---:|:---:|
| TF-IDF + Logistic Regression | 0.227 | 0.218 |
| **🏆 BERT (text-only)** | **0.284** | **0.284** |
| BERT + Metadata Fusion | 0.277 | 0.274 |
| RoBERTa | 0.278 | 0.270 |
| Wang (2017) baseline | 0.274 | — |
| BERT on WELFake (binary) | **0.988** | **0.988** |

Fine-tuned BERT beats the lexical baseline by ~25% relative and clears the published benchmark, sitting far above the 0.167 random-choice floor.

---

## 💡 Key Findings

> The headline number isn't the story — **the error structure is.**

- 🎯 **44.5% of all errors are between *adjacent* veracity levels** (e.g. `half-true` → `mostly-true`); gross five-step errors are just **2%**. The model learned the latent truth *scale* and only stumbles on boundaries humans dispute.
- 🔬 **The ceiling is data-driven, not model-driven.** The *same* BERT scores **0.988** on clean binary WELFake but **0.284** on ambiguous six-class LIAR. Same code, same encoder — only the data differ.
- 🧩 **Metadata fusion slightly *hurt*.** Speaker history separates classes in aggregate yet adds variance faster than signal at the instance level — a lesson on the gap between exploratory correlation and predictive value.
- ⚙️ **RoBERTa didn't help** either: when a task is *label-limited* rather than *representation-limited*, a stronger encoder can't move the bound.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+ · Node 20+ · ~2 GB free disk for model weights

### 1. Get model weights
The trained `.pt` files (~1.7 GB) are not committed. Generate them by running
the notebook in `notebook/`, or place existing weights in `models/`.

### 2. Run the full stack (one command)

```bash
cd webapp
npm run install:all     # installs root + frontend + backend deps
npm run dev             # backend :8000 AND frontend :5173, together
```

Open **http://localhost:5173**. The header status pill turns green once the
model has loaded.

| Script | What it does |
|---|---|
| `npm run dev` | Run backend + frontend concurrently |
| `npm run dev:backend` | Backend only (uvicorn :8000) |
| `npm run dev:frontend` | Frontend only (Vite :5173) |
| `npm run build` | Production build of the frontend |
| `npm run test:backend` | Run the backend pytest suite |

---

## 🔌 API

No API key required — access is governed by fair-use rate limits. Full guide in
[`webapp/API.md`](webapp/API.md); interactive docs live at `/docs`.

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"statement":"Crime rose 500% in two years."}'
```

```json
{
  "prediction": "pants-fire",
  "prediction_display": "Pants on Fire",
  "confidence": 0.79,
  "probabilities": { "pants-fire": 0.79, "false": 0.09, "...": "..." },
  "model_used": "BERT (text-only)",
  "latency_ms": 11.5,
  "request_id": "1f3c…"
}
```

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict` | Classify a statement (optional speaker metadata) |
| `GET` | `/health` | Liveness + model status |
| `GET` | `/labels` | The six veracity classes |
| `GET` | `/examples` | Sample statements |
| `GET` | `/metrics` | Uptime, request counts, latency, model metrics |
| `GET` | `/api-info` | License, repo, rate limits, usage policy |

**Built-in protections:** per-IP rate limiting (30/min on `/predict`), CORS
locked to the official frontend in production, security headers, and Pydantic
input validation.

---

## 🗂️ Repository Layout

```
.
├── report/          📄 Final report (PDF + HTML) and figures
├── notebook/        📓 Executed Jupyter notebook (.ipynb + .html)
├── models/          🧠 Model config + metrics (weights regenerated via notebook)
├── datasets/        📦 LIAR benchmark (+ instructions for WELFake)
├── figures/         📈 All generated charts and confusion matrices
└── webapp/          🌐 Monorepo
    ├── backend/     ⚡ FastAPI service (app/, tests/, Dockerfile)
    └── frontend/    🎨 React + TypeScript SPA
```

---

## 🧪 Tech Stack

**ML** — PyTorch · 🤗 Transformers (BERT, RoBERTa) · scikit-learn · pandas
**Backend** — FastAPI · Uvicorn · Pydantic · pytest
**Frontend** — React 18 · TypeScript · Vite · Tailwind CSS · Recharts · Framer Motion
**Deploy** — Vercel (frontend) · Render (backend) · Hugging Face Hub (weights)

---

## 📄 Report

The full **30-page analysis** is in [`report/Rahul_Mishra_453_P4_Final_Report.pdf`](report/Rahul_Mishra_453_P4_Final_Report.pdf) —
problem framing, literature review, mechanistic algorithm explanations, results,
in-depth interpretation, and a concrete future-work agenda (ordinal-aware loss,
calibrated fusion, uncertainty-aware deferral).

---

## 📚 References

1. **Devlin, J., et al.** (2019). *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding.* NAACL-HLT. [DOI](https://doi.org/10.18653/v1/N19-1423)
2. **Liu, Y., et al.** (2019). *RoBERTa: A Robustly Optimized BERT Pretraining Approach.* [arXiv:1907.11692](https://doi.org/10.48550/arXiv.1907.11692)
3. **Shu, K., et al.** (2017). *Fake News Detection on Social Media: A Data Mining Perspective.* ACM SIGKDD Explorations. [DOI](https://doi.org/10.1145/3137597.3137600)
4. **Verma, P. K., et al.** (2021). *WELFake: Word Embedding over Linguistic Features for Fake News Detection.* IEEE TCSS. [DOI](https://doi.org/10.1109/TCSS.2021.3068519)
5. **Wang, W. Y.** (2017). *"Liar, Liar Pants on Fire": A New Benchmark Dataset for Fake News Detection.* ACL. [DOI](https://doi.org/10.18653/v1/P17-2067)

---

## 📜 License & Disclaimer

Released under the **MIT License** — see [`LICENSE`](LICENSE).

This is an academic, open-source research demonstration. It is **not** a
fact-checking authority and is not affiliated with PolitiFact or the dataset
authors. Veracity predictions are statistical estimates and must not be used to
assert that any identifiable person has lied or acted wrongfully.

<div align="center">

---

**Rahul Mishra** · MS Data Science, Northwestern University
*AI and Natural Language Processing*

⭐ Star this repo if you find it useful

</div>
