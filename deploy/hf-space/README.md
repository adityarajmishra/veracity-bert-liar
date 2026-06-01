---
title: Veracity API
emoji: 🛰️
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# Veracity API — Misinformation Detection

FastAPI backend serving a fine-tuned BERT veracity classifier (LIAR benchmark).
Model weights are downloaded from the Hugging Face Hub repo
[`adityarajmishra/veracity-bert-liar`](https://huggingface.co/adityarajmishra/veracity-bert-liar)
on startup.

- **Interactive docs:** `/docs`
- **Health:** `/health`
- **Predict:** `POST /predict` with `{"statement": "..."}`

This Space hosts the API for the open-source
[Veracity.ai](https://github.com/adityarajmishra/veracity-bert-liar) project.

## Configuration (Space Variables)

| Variable | Value |
| --- | --- |
| `APP_ENVIRONMENT` | `production` |
| `APP_MODEL_MODE` | `full` (Spaces has 16 GB RAM) |
| `APP_HF_REPO_ID` | `adityarajmishra/veracity-bert-liar` |
| `APP_ALLOWED_ORIGINS` | your Vercel domain, e.g. `https://veracity-bert-liar.vercel.app` |
