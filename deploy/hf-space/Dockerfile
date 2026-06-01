# syntax=docker/dockerfile:1
# Hugging Face Space (Docker SDK). Serves the Veracity API on port 7860.
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    APP_ENVIRONMENT=production \
    APP_JSON_LOGS=true \
    APP_MODEL_MODE=full \
    APP_HF_REPO_ID=adityarajmishra/veracity-bert-liar \
    APP_ALLOWED_ORIGINS=https://veracity-bert-liar.vercel.app \
    APP_MODELS_DIR=/tmp/models \
    HF_HOME=/tmp/hf \
    OMP_NUM_THREADS=1

WORKDIR /app

# CPU-only PyTorch (avoids ~2 GB of CUDA GPU libraries).
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir torch==2.2.2 --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

COPY app ./app

# HF Spaces route external traffic to port 7860.
EXPOSE 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1"]
