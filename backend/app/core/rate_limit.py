"""Sliding-window in-memory rate limiter for authentication endpoints."""
import math
import threading
import time
from collections import defaultdict, deque
from typing import Deque, Dict, Optional
from fastapi import HTTPException, Request, status
from app.core.config import settings


def get_client_ip(request: Request) -> str:
    """Resolve client IP, trusting X-Forwarded-For only when configured behind a proxy."""
    if settings.TRUST_PROXY_HEADERS:
        forwarded_for = request.headers.get("x-forwarded-for", "")
        first_hop = forwarded_for.split(",")[0].strip()
        if first_hop:
            return first_hop
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


class SlidingWindowRateLimiter:
    """Thread-safe sliding-window tracker for throttling repeated auth attempts."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._events: Dict[str, Deque[float]] = defaultdict(deque)

    def _prune(self, key: str, now: float, window_seconds: int) -> Deque[float]:
        cutoff = now - window_seconds
        dq = self._events[key]
        while dq and dq[0] <= cutoff:
            dq.popleft()
        return dq

    def ensure_allowed(
        self,
        key: str,
        max_attempts: int,
        window_seconds: int,
        detail: str,
    ) -> None:
        """Raise HTTP 429 with Retry-After when attempts in window meet or exceed limit."""
        if max_attempts <= 0 or window_seconds <= 0:
            return
        now = time.monotonic()
        with self._lock:
            dq = self._prune(key, now, window_seconds)
            if len(dq) >= max_attempts:
                retry_after = max(1, math.ceil((dq[0] + window_seconds) - now))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"{detail} Try again in {retry_after} seconds.",
                    headers={"Retry-After": str(retry_after)},
                )
            if not dq:
                self._events.pop(key, None)

    def record(self, key: str, window_seconds: int) -> None:
        """Record an attempt timestamp under the given rate-limit bucket."""
        if window_seconds <= 0:
            return
        now = time.monotonic()
        with self._lock:
            dq = self._prune(key, now, window_seconds)
            dq.append(now)

    def consume_or_raise(
        self,
        key: str,
        max_attempts: int,
        window_seconds: int,
        detail: str,
    ) -> None:
        """Atomically enforce limit and record an attempt in a single step."""
        if max_attempts <= 0 or window_seconds <= 0:
            return
        now = time.monotonic()
        with self._lock:
            dq = self._prune(key, now, window_seconds)
            if len(dq) >= max_attempts:
                retry_after = max(1, math.ceil((dq[0] + window_seconds) - now))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"{detail} Try again in {retry_after} seconds.",
                    headers={"Retry-After": str(retry_after)},
                )
            dq.append(now)

    def reset(self, key: Optional[str] = None) -> None:
        """Clear a single rate-limit bucket or all buckets."""
        with self._lock:
            if key is None:
                self._events.clear()
            else:
                self._events.pop(key, None)


auth_rate_limiter = SlidingWindowRateLimiter()

