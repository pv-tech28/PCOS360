"""Shared database helpers delegating to `app.core.database` (psycopg v3 + SSL)."""
from app.core.config import settings
from app.core.database import (
    Base,
    SessionLocal,
    get_db,
    get_engine,
    normalize_database_url,
)

DATABASE_URL = normalize_database_url(settings.DATABASE_URL)
engine = get_engine()

__all__ = ["DATABASE_URL", "Base", "SessionLocal", "engine", "get_db", "get_engine"]
