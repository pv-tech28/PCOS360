"""Canonical FastAPI entrypoint wrapper.

Redirects `main:app` / `python main.py` directly to `backend/app/main.py` so the legacy
unauthenticated prototype app is never accidentally launched.
"""
from app.main import app  # noqa: F401


if __name__ == "__main__":
    import uvicorn
    from app.core.config import settings

    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
