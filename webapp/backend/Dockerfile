# syntax=docker/dockerfile:1
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    APP_ENVIRONMENT=production \
    APP_JSON_LOGS=true

WORKDIR /app

# Install CPU-only PyTorch first (avoids pulling ~2 GB of CUDA/GPU libraries
# that are useless on a CPU instance and inflate the image and memory).
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir torch==2.2.2 --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app

# Model weights are downloaded from the Hugging Face Hub on first boot.
ENV APP_MODELS_DIR=/models \
    APP_MODEL_MODE=lite \
    OMP_NUM_THREADS=1

EXPOSE 8000

# Single worker: the model is large; scale horizontally with more instances.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
