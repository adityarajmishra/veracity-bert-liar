"""
Dependency providers.

Holds the singleton predictor instance created at application startup and
injected into routes via FastAPI's dependency system.
"""
from __future__ import annotations

from typing import Optional

from app.services.predictor import VeracityPredictor

_predictor: Optional[VeracityPredictor] = None


def set_predictor(predictor: VeracityPredictor) -> None:
    global _predictor
    _predictor = predictor


def get_predictor() -> VeracityPredictor:
    if _predictor is None:
        raise RuntimeError("Predictor has not been initialized")
    return _predictor
