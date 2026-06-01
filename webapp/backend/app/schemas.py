"""
API request/response schemas.

These Pydantic models define the public contract of the API and provide
automatic validation plus OpenAPI documentation.
"""
from __future__ import annotations

from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PredictRequest(BaseModel):
    statement: str = Field(
        ...,
        min_length=3,
        max_length=2000,
        description="The statement text to classify.",
        examples=["The unemployment rate is the lowest it has been in 50 years."],
    )
    party: Optional[str] = Field(
        None, description="Optional speaker party affiliation (enables fusion model)."
    )
    credit_history: Optional[List[float]] = Field(
        None,
        description="Optional 5-dim credit history "
        "[barely_true, false, half_true, mostly_true, pants_on_fire].",
    )

    @field_validator("statement")
    @classmethod
    def _strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("statement must not be empty")
        return v

    @field_validator("credit_history")
    @classmethod
    def _check_credit(cls, v: Optional[List[float]]) -> Optional[List[float]]:
        if v is not None and len(v) != 5:
            raise ValueError("credit_history must contain exactly 5 values")
        return v


class PredictResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    prediction: str = Field(..., description="Predicted veracity class id.")
    prediction_display: str = Field(..., description="Human-readable class label.")
    confidence: float = Field(..., ge=0.0, le=1.0)
    probabilities: Dict[str, float] = Field(
        ..., description="Probability for each of the six classes."
    )
    model_used: str = Field(..., description="Which model served the prediction.")
    latency_ms: float = Field(..., description="Server-side inference latency.")
    request_id: str = Field(..., description="Correlation id for this request.")


class HealthResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    status: str
    service: str
    version: str
    environment: str
    model_loaded: bool
    device: str


class LabelInfo(BaseModel):
    id: str
    display: str


class ExampleItem(BaseModel):
    statement: str
    party: Optional[str] = None


class MetricsResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    uptime_seconds: float
    total_requests: int
    total_predictions: int
    error_count: int
    avg_latency_ms: float
    model_metrics: Dict[str, Dict[str, float]]


class ApiInfoResponse(BaseModel):
    """Open-source metadata and usage policy for API consumers."""

    service: str
    version: str
    license: str
    repository: str
    docs: str
    openapi: str
    rate_limits: Dict[str, str]
    usage_policy: str
