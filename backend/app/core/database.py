import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger("pcos360.database")

Base = declarative_base()

_engine = None
_db_type = "unknown"


def get_engine():
    global _engine, _db_type
    if _engine is not None:
        return _engine

    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
        _engine = create_engine(db_url, connect_args=connect_args, echo=settings.DEBUG_SQL, future=True)
        _db_type = "SQLite (Local Dev)"
        return _engine

    # PostgreSQL configuration with 3s connection timeout
    connect_args["connect_timeout"] = 3

    try:
        engine = create_engine(
            db_url,
            connect_args=connect_args,
            echo=settings.DEBUG_SQL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            future=True,
        )
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        _engine = engine
        _db_type = "PostgreSQL"
        logger.info("Successfully connected to PostgreSQL database (pcos360_db).")
        return _engine
    except Exception as e:
        logger.warning(
            f"Could not connect to PostgreSQL ({settings.DATABASE_URL}): {e}. "
            "Falling back to local SQLite engine (pcos360.db) for zero-config local development."
        )
        _engine = create_engine("sqlite:///./pcos360.db", connect_args={"check_same_thread": False}, future=True)
        _db_type = "SQLite (Fallback Dev Mode)"
        return _engine


def get_db_status():
    global _db_type
    try:
        eng = get_engine()
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "connected", "type": _db_type}
    except Exception as e:
        return {"status": "error", "detail": str(e), "type": _db_type}


def SessionLocal() -> Session:
    eng = get_engine()
    factory = sessionmaker(autocommit=False, autoflush=False, bind=eng, future=True)
    return factory()


def get_db() -> Generator[Session, None, None]:
    """FastAPI database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
