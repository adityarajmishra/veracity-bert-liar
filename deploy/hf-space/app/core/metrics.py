"""
In-process application metrics.

A lightweight, thread-safe counter store for observability without external
dependencies. Exposed via the /metrics endpoint for monitoring dashboards.
"""
from __future__ import annotations

import threading
import time
from dataclasses import dataclass, field


@dataclass
class Metrics:
    start_time: float = field(default_factory=time.time)
    total_requests: int = 0
    total_predictions: int = 0
    error_count: int = 0
    _latency_sum_ms: float = 0.0
    _latency_count: int = 0
    _lock: threading.Lock = field(default_factory=threading.Lock)

    def record_request(self) -> None:
        with self._lock:
            self.total_requests += 1

    def record_prediction(self, latency_ms: float) -> None:
        with self._lock:
            self.total_predictions += 1
            self._latency_sum_ms += latency_ms
            self._latency_count += 1

    def record_error(self) -> None:
        with self._lock:
            self.error_count += 1

    @property
    def uptime_seconds(self) -> float:
        return time.time() - self.start_time

    @property
    def avg_latency_ms(self) -> float:
        with self._lock:
            if self._latency_count == 0:
                return 0.0
            return round(self._latency_sum_ms / self._latency_count, 2)


# Module-level singleton
metrics = Metrics()
