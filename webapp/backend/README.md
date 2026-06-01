# Backend — Misinformation Detection API

A FastAPI service that serves the fine-tuned BERT veracity classifier.

## Architecture

```
backend/
├── app/
│   ├── main.py            # App factory, lifespan (loads model on startup)
│   ├── dependencies.py    # Singleton predictor injection
│   ├── middleware.py      # Request-id correlation, access logging, timing
│   ├── schemas.py         # Pydantic request/response models
│   ├── api/routes.py      # Endpoint definitions
│   ├── core/
│   │   ├── config.py      # Env-driven settings (APP_* variables)
│   │   ├── logging_config.py  # Structured (human/JSON) logging
│   │   └── metrics.py     # In-process metrics store
│   └── services/
│       ├── models.py      # BERT + fusion architectures
│       └── predictor.py   # Model loading + inference
└── tests/test_api.py      # pytest smoke tests against the live model
```

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Service info |
| GET | `/health` | Health + model-loaded + device |
| GET | `/labels` | The six veracity labels |
| GET | `/examples` | Sample statements for the UI |
| GET | `/metrics` | Uptime, request counts, latency, model metrics |
| POST | `/predict` | Classify a statement (optional speaker metadata) |

### `POST /predict`

```json
Request:  { "statement": "...", "party": "republican" }
Response: {
  "prediction": "pants-fire",
  "prediction_display": "Pants on Fire",
  "confidence": 0.79,
  "probabilities": { "pants-fire": 0.79, "false": 0.09, ... },
  "model_used": "BERT + Metadata Fusion",
  "latency_ms": 11.5,
  "request_id": "..."
}
```

## Run locally

```bash
pip install -r requirements.txt
# from the webapp/ root, the monorepo script runs this for you:
python3 -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

The service loads `bert_text_only.pt` and `bert_metadata_fusion.pt` from the
project `models/` directory at startup. Generate those weights by running the
notebook if they are not present.

## Configuration (environment variables)

All variables are prefixed `APP_` (see `.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_ENVIRONMENT` | development | development / production |
| `APP_ALLOWED_ORIGINS` | * | CORS origins (set to your Vercel domain in prod) |
| `APP_LOG_LEVEL` | INFO | Log verbosity |
| `APP_JSON_LOGS` | false | Emit structured JSON logs |
| `APP_MODELS_DIR` | ../../models | Path to trained weights |

## Tests

```bash
python3 -m pytest -q
```
