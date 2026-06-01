"""
Security hardening: rate limiting and HTTP security headers.

- A lightweight in-memory, per-IP sliding-window rate limiter prevents API
  abuse and brute-force scraping of the model. It requires no external store,
  which suits a single-instance free-tier deployment. (For multi-instance
  horizontal scaling, back this with Redis instead.)
- Security headers reduce common web attack surface (clickjacking, MIME
  sniffing, referrer leakage).
"""
from __future__ import annotations

import threading
import time
from collections import defaultdict, deque
from typing import Deque, Dict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.config import get_settings

settings = get_settings()


def _parse_rate(rate: str) -> tuple[int, int]:
    """Parse a rate string like '30/minute' into (limit, window_seconds)."""
    count, _, unit = rate.partition("/")
    seconds = {"second": 1, "minute": 60, "hour": 3600, "day": 86400}.get(unit.strip(), 60)
    return int(count), seconds


class RateLimiter:
    """Per-client sliding-window counter, thread-safe."""

    def __init__(self) -> None:
        self._hits: Dict[str, Deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def check(self, key: str, limit: int, window: int) -> tuple[bool, int, int]:
        """Return (allowed, remaining, retry_after_seconds)."""
        now = time.time()
        with self._lock:
            dq = self._hits[key]
            cutoff = now - window
            while dq and dq[0] < cutoff:
                dq.popleft()
            if len(dq) >= limit:
                retry_after = int(window - (now - dq[0])) + 1
                return False, 0, retry_after
            dq.append(now)
            return True, limit - len(dq), 0


_limiter = RateLimiter()
_PREDICT_LIMIT, _PREDICT_WINDOW = _parse_rate(settings.rate_limit_predict)
_DEFAULT_LIMIT, _DEFAULT_WINDOW = _parse_rate(settings.rate_limit_default)


def _client_ip(request: Request) -> str:
    # Honor common proxy headers (Render/Vercel) then fall back to peer address.
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Apply a stricter limit to /predict and a general limit elsewhere."""

    async def dispatch(self, request: Request, call_next) -> Response:
        path = request.url.path
        # Only rate-limit the real API surface; skip docs/openapi/static.
        if path.startswith(("/docs", "/redoc", "/openapi", "/favicon")):
            return await call_next(request)

        ip = _client_ip(request)
        if path == "/predict" and request.method == "POST":
            limit, window, scope = _PREDICT_LIMIT, _PREDICT_WINDOW, "predict"
        else:
            limit, window, scope = _DEFAULT_LIMIT, _DEFAULT_WINDOW, "default"

        allowed, remaining, retry_after = _limiter.check(f"{scope}:{ip}", limit, window)
        if not allowed:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Rate limit exceeded. Please slow down.",
                    "limit": limit,
                    "window_seconds": window,
                    "retry_after_seconds": retry_after,
                },
                headers={"Retry-After": str(retry_after),
                         "X-RateLimit-Limit": str(limit),
                         "X-RateLimit-Remaining": "0"},
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Attach a conservative set of security headers to every response."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        if settings.is_production:
            response.headers["Strict-Transport-Security"] = (
                "max-age=63072000; includeSubDomains"
            )
        return response
