"""
Application factory and entry point.

Wires together configuration, logging, middleware, model loading (lifespan),
and API routes. Run with:

    uvicorn app.main:app --reload          (development)
    uvicorn app.main:app --host 0.0.0.0     (production)
"""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request

from app.api.routes import router
from app.core.config import get_settings
from app.core.logging_config import configure_logging, get_logger
from app.dependencies import set_predictor
from app.middleware import RequestContextMiddleware
from app.security import RateLimitMiddleware, SecurityHeadersMiddleware
from app.services.predictor import VeracityPredictor

settings = get_settings()
configure_logging(level=settings.log_level, json_logs=settings.json_logs)
logger = get_logger("api.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models on startup; release on shutdown."""
    logger.info("Starting %s v%s (%s)", settings.app_name, settings.version,
                settings.environment)
    predictor = VeracityPredictor(settings)
    try:
        predictor.load()
        set_predictor(predictor)
        logger.info("Startup complete — model ready")
    except Exception:
        logger.exception("Failed to load model during startup")
        raise
    yield
    logger.info("Shutting down")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        description=(
            "Open-source, transformer-based veracity classification on the LIAR "
            "benchmark. Fine-tuned BERT assigns one of six veracity levels to a "
            "political or news statement. Free to consume within the published "
            "rate limits; see the project repository and license for terms."
        ),
        license_info={"name": settings.license,
                      "url": f"{settings.repo_url}/blob/main/LICENSE"},
        contact={"name": "Veracity.ai (open source)", "url": settings.repo_url},
        lifespan=lifespan,
    )

    # --- Rate limiting (abuse prevention) ---
    app.add_middleware(RateLimitMiddleware)

    # --- CORS ---
    # When specific origins are configured, allow credentials. With the
    # wildcard "*" (dev only), credentials must be disabled per the CORS spec.
    origins = settings.cors_origins
    allow_credentials = origins != ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Process-Time-ms",
                        "X-RateLimit-Limit", "X-RateLimit-Remaining"],
    )

    # --- Security headers ---
    app.add_middleware(SecurityHeadersMiddleware)

    # Request context / access logging / metrics
    app.add_middleware(RequestContextMiddleware)

    # Routes
    app.include_router(router)

    @app.get("/", tags=["system"])
    def root():
        return {
            "service": settings.app_name,
            "version": settings.version,
            "docs": "/docs",
            "health": "/health",
        }

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        request_id = getattr(request.state, "request_id", "-")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "request_id": request_id},
        )

    return app


app = create_app()
