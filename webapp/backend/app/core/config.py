"""
Centralized application configuration.

Settings are read from environment variables with sensible defaults so the same
image runs locally and in production (Render, Railway, etc.). Using pydantic
BaseSettings gives us validation and typed access throughout the codebase.
"""
from __future__ import annotations

import os
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_", extra="ignore")

    # --- Service metadata ---
    app_name: str = "Veracity API — Misinformation Detection"
    version: str = "1.0.0"
    environment: str = "development"  # development | production
    debug: bool = True
    license: str = "MIT"
    repo_url: str = "https://github.com/rahulmishra/veracity-bert-liar"

    # --- Server ---
    host: str = "0.0.0.0"
    port: int = 8000

    # --- CORS ---
    # Comma-separated list of allowed origins; "*" allows all (dev only).
    # In production set this to your Vercel domain(s) so only the official
    # frontend can call the API from a browser.
    allowed_origins: str = "*"

    # --- Rate limiting (abuse prevention) ---
    # Per-client limits applied to the public prediction endpoint.
    rate_limit_predict: str = "30/minute"
    rate_limit_default: str = "120/minute"
    # Max statement length accepted (characters) — a cheap DoS guard.
    max_statement_chars: int = 2000

    # --- Logging ---
    log_level: str = "INFO"
    json_logs: bool = False  # set True in production for structured logs

    # --- Model ---
    # Directory holding the trained .pt weights + model_config.json.
    # Defaults to the P.4/models directory relative to this file.
    models_dir: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "models")
    )
    max_sequence_length: int = 128
    base_encoder: str = "bert-base-uncased"

    # --- Hugging Face Hub (production weight hosting) ---
    # When weights are absent locally (e.g. a fresh Render instance), download
    # them from this Hub repo on startup. Leave empty to require local files.
    hf_repo_id: str = "adityarajmishra/veracity-bert-liar"  # e.g. "adityarajmishra/veracity-bert-liar"
    hf_token: str = ""    # only needed for private repos

    # --- Memory mode ---
    # On tiny instances (e.g. Render free 512 MB) loading two BERT models will
    # OOM. "lite" loads only the text-only model; "full" also loads fusion.
    model_mode: str = "lite"  # lite | full

    @property
    def lite_mode(self) -> bool:
        return self.model_mode.lower() == "lite"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    """Cached singleton accessor for application settings."""
    return Settings()
