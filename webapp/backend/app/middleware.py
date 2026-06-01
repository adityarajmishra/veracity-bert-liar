"""
Request-scoped middleware: correlation IDs, access logging, and timing.

Every request gets a unique request_id (propagated in the response header
`X-Request-ID`). Latency and outcome are logged in a structured form and fed
into the metrics store for monitoring.
"""
from __future__ import annotations

import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging_config import get_logger
from app.core.metrics import metrics

logger = get_logger("api.access")


class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        metrics.record_request()

        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            metrics.record_error()
            latency_ms = (time.perf_counter() - start) * 1000.0
            logger.exception(
                "Unhandled error",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "latency_ms": round(latency_ms, 2),
                    "client_ip": request.client.host if request.client else "-",
                },
            )
            raise

        latency_ms = (time.perf_counter() - start) * 1000.0
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time-ms"] = f"{latency_ms:.2f}"

        log = logger.info if response.status_code < 500 else logger.error
        log(
            "%s %s -> %s (%.2f ms)",
            request.method,
            request.url.path,
            response.status_code,
            latency_ms,
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "latency_ms": round(latency_ms, 2),
                "client_ip": request.client.host if request.client else "-",
            },
        )
        return response
