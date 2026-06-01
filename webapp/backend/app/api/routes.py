"""
API route definitions.

All endpoints are grouped here and registered on the application in main.py.
Dependency injection supplies the singleton predictor instance.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request

from app.core.config import Settings, get_settings
from app.core.logging_config import get_logger
from app.core.metrics import metrics
from app.dependencies import get_predictor
from app.schemas import (
    ApiInfoResponse,
    ExampleItem,
    HealthResponse,
    LabelInfo,
    MetricsResponse,
    PredictRequest,
    PredictResponse,
)
from app.services.predictor import LABEL_DISPLAY, LABEL_ORDER, VeracityPredictor

logger = get_logger(__name__)
router = APIRouter()


EXAMPLES = [
    ExampleItem(statement="The unemployment rate has dropped to the lowest level in 50 years.", party="republican"),
    ExampleItem(statement="Our state spends more per student on education than any country in the world.", party="democrat"),
    ExampleItem(statement="Crime has increased by 500 percent in the last two years across the country.", party="republican"),
    ExampleItem(statement="Ninety percent of scientists agree that the new policy will help the economy.", party="democrat"),
    ExampleItem(statement="This bill will create ten million new jobs by the end of the decade.", party="none"),
]


@router.get("/health", response_model=HealthResponse, tags=["system"])
def health(
    settings: Settings = Depends(get_settings),
    predictor: VeracityPredictor = Depends(get_predictor),
) -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        version=settings.version,
        environment=settings.environment,
        model_loaded=predictor.is_ready,
        device=str(predictor.device),
    )


@router.get("/labels", response_model=list[LabelInfo], tags=["metadata"])
def labels() -> list[LabelInfo]:
    return [LabelInfo(id=l, display=LABEL_DISPLAY[l]) for l in LABEL_ORDER]


@router.get("/examples", response_model=list[ExampleItem], tags=["metadata"])
def examples() -> list[ExampleItem]:
    return EXAMPLES


@router.get("/metrics", response_model=MetricsResponse, tags=["system"])
def get_metrics(
    predictor: VeracityPredictor = Depends(get_predictor),
) -> MetricsResponse:
    return MetricsResponse(
        uptime_seconds=round(metrics.uptime_seconds, 1),
        total_requests=metrics.total_requests,
        total_predictions=metrics.total_predictions,
        error_count=metrics.error_count,
        avg_latency_ms=metrics.avg_latency_ms,
        model_metrics=predictor.config.get("results", {}),
    )


@router.get("/api-info", response_model=ApiInfoResponse, tags=["system"])
def api_info(settings: Settings = Depends(get_settings)) -> ApiInfoResponse:
    """Public, open-source metadata for API consumers."""
    return ApiInfoResponse(
        service=settings.app_name,
        version=settings.version,
        license=settings.license,
        repository=settings.repo_url,
        docs="/docs",
        openapi="/openapi.json",
        rate_limits={
            "predict": settings.rate_limit_predict,
            "default": settings.rate_limit_default,
        },
        usage_policy=(
            "Free for research and educational use within the published rate "
            "limits. Predictions are probabilistic and must not be treated as "
            "definitive fact-checks. Attribution to the project repository is "
            "appreciated. Abuse, scraping beyond rate limits, or attempts to "
            "circumvent limits are prohibited."
        ),
    )


@router.post("/predict", response_model=PredictResponse, tags=["inference"])
def predict(
    payload: PredictRequest,
    request: Request,
    predictor: VeracityPredictor = Depends(get_predictor),
) -> PredictResponse:
    request_id = getattr(request.state, "request_id", "-")
    if not predictor.is_ready:
        raise HTTPException(status_code=503, detail="Model is not ready")

    try:
        result = predictor.predict(
            statement=payload.statement,
            party=payload.party,
            credit_history=payload.credit_history,
        )
    except Exception as exc:  # noqa: BLE001
        metrics.record_error()
        logger.exception("Prediction failed", extra={"request_id": request_id})
        raise HTTPException(status_code=500, detail="Prediction failed") from exc

    metrics.record_prediction(result["latency_ms"])
    logger.info(
        "prediction=%s confidence=%.3f model=%s",
        result["prediction"],
        result["confidence"],
        result["model_used"],
        extra={"request_id": request_id},
    )

    return PredictResponse(request_id=request_id, **result)
