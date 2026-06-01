# syntax=docker/dockerfile:1
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    APP_ENVIRONMENT=production \
    APP_JSON_LOGS=true

WORKDIR /app

# Install dependencies first for better layer caching
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy application code
COPY app ./app

# Model weights are mounted or copied into /models at deploy time
ENV APP_MODELS_DIR=/models

EXPOSE 8000

# Single worker: the model is large; scale horizontally with more instances.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
