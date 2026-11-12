import logging
import re
import urllib.parse
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger("pcos360.database")

Base = declarative_base()

_engine = None
_db_type = "unknown"


class DatabaseConnectionError(RuntimeError):
    """Raised when the configured database engine is unreachable or invalid."""


def _encode_authority_special_chars(url: str) -> str:
    """Escape unencoded '@' characters inside a URL password using percent-encoding."""
    if "://" not in url:
        return url
    scheme, rest = url.split("://", 1)
    if "/" in rest:
        authority, tail = rest.split("/", 1)
        tail = "/" + tail
    elif "?" in rest:
        authority, tail = rest.split("?", 1)
        tail = "?" + tail
    else:
        authority, tail = rest, ""

    if authority.count("@") <= 1 or ":" not in authority:
        return url

    userinfo, host_port = authority.rsplit("@", 1)
    username, password = userinfo.split(":", 1)
    safe_password = urllib.parse.quote(urllib.parse.unquote(password), safe="")
    return f"{scheme}://{username}:{safe_password}@{host_port}{tail}"


def normalize_database_url(raw_url: str) -> str:
    """Normalize PostgreSQL scheme aliases to psycopg v3, encode '@' in passwords, and ensure Supabase SSL."""
    cleaned = (raw_url or "").strip()
    for legacy_prefix in ("postgresql+psycopg2://", "postgres://", "postgresql://"):
        if cleaned.startswith(legacy_prefix):
            cleaned = cleaned.replace(legacy_prefix, "postgresql+psycopg://", 1)
            break

    if not cleaned.startswith("postgresql+psycopg://"):
        return cleaned

    cleaned = _encode_authority_special_chars(cleaned)

    try:
        parsed = urllib.parse.urlsplit(cleaned)
        host = (parsed.hostname or "").lower()
        query_params = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
        if ("supabase.com" in host or "supabase.co" in host) and "sslmode" not in query_params:
            sep = "&" if parsed.query else "?"
            cleaned = f"{cleaned}{sep}sslmode=require"
    except Exception:
        pass

    return cleaned


def mask_database_url(raw_url: str) -> str:
    """Return a database URL safe for logs and health output without exposing passwords."""
    normalized = normalize_database_url(raw_url)
    try:
        return make_url(normalized).render_as_string(hide_password=True)
    except Exception:
        return re.sub(r"://([^:/@]+):(.+)@([^/@]+)", r"://\1:***@\\3", normalized)


def redact_db_error(exc: Exception, raw_url: str) -> str:
    """Strip any configured DB password or inline URL credentials from exception text."""
    text_msg = re.sub(r"://([^:/@]+):([^@]+)@", r"://\1:***@", str(exc))
    try:
        pwd = make_url(normalize_database_url(raw_url)).password
        if pwd:
            text_msg = text_msg.replace(pwd, "***")
            decoded_pwd = urllib.parse.unquote(pwd)
            if decoded_pwd:
                text_msg = text_msg.replace(decoded_pwd, "***")
    except Exception:
        pass
    return text_msg


def reset_engine() -> None:
    """Dispose and clear the cached SQLAlchemy engine (used for tests and re-init)."""
    global _engine, _db_type
    if _engine is not None:
        try:
            _engine.dispose()
        except Exception:
            pass
    _engine = None
    _db_type = "unknown"


def get_engine():
    global _engine, _db_type
    if _engine is not None:
        return _engine

    db_url = normalize_database_url(settings.DATABASE_URL)

    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
        _engine = create_engine(db_url, connect_args=connect_args, echo=settings.DEBUG_SQL, future=True)
        _db_type = "SQLite (Local Dev)"
        return _engine

    # PostgreSQL / external database configuration with 3s connection timeout; never silently fall back to SQLite.
    connect_args["connect_timeout"] = 3
    safe_url = mask_database_url(db_url)
    engine = None

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
        logger.info(f"Successfully connected to PostgreSQL database ({safe_url}).")
        return _engine
    except Exception as exc:
        if engine is not None:
            try:
                engine.dispose()
            except Exception:
                pass
        _db_type = "PostgreSQL (Unreachable)"
        safe_detail = redact_db_error(exc, db_url)
        message = (
            f"Configured PostgreSQL database is unreachable ({safe_url}): {safe_detail}. "
            "Refusing silent SQLite fallback. Start PostgreSQL, verify DATABASE_URL in backend/.env, "
            "and run 'alembic upgrade head' — or explicitly set DATABASE_URL=\"sqlite:///./pcos360.db\" "
            "for local SQLite development."
        )
        logger.error(message)
        raise DatabaseConnectionError(message) from exc


def get_db_status():
    global _db_type
    try:
        eng = get_engine()
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "connected", "type": _db_type}
    except Exception as exc:
        normalized = normalize_database_url(settings.DATABASE_URL)
        err_type = "SQLite (Error)" if normalized.startswith("sqlite") else "PostgreSQL (Unreachable)"
        _db_type = err_type
        return {
            "status": "error",
            "detail": redact_db_error(exc, settings.DATABASE_URL),
            "type": err_type,
        }


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
