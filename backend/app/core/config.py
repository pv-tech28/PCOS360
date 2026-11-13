import json
import secrets
import warnings
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_EPHEMERAL_DEV_SECRET = secrets.token_urlsafe(48)


class Settings(BaseSettings):
    PROJECT_NAME: str = "PCOS360 API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend services for the PCOS360 AI-powered women's health intelligence platform."
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    DEBUG_SQL: bool = False

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Authentication & Token Signing
    SECRET_KEY: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Auth Rate Limiting & Proxy Configuration
    AUTH_RATE_LIMIT_WINDOW_SECONDS: int = 300
    AUTH_LOGIN_MAX_ATTEMPTS: int = 5
    AUTH_LOGIN_IP_MAX_ATTEMPTS: int = 20
    AUTH_REGISTER_MAX_ATTEMPTS: int = 10
    TRUST_PROXY_HEADERS: bool = False

    # PostgreSQL Database URL
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/pcos360_db"

    # CORS origins: allowed to connect from the React + Vite frontend and Expo web/dev tools
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8081",
        "https://pcos360.vercel.app",
        "https://pcos360.onrender.com",
    ]

    @field_validator("DEBUG", mode="before")
    @classmethod
    def validate_debug(cls, v: Union[bool, str, None], info) -> bool:
        if v is not None:
            if isinstance(v, bool):
                return v
            if isinstance(v, str):
                return v.strip().lower() in ("true", "1", "yes")
        env = (info.data.get("ENVIRONMENT") or "development").lower()
        return env != "production"

    @field_validator("TRUST_PROXY_HEADERS", mode="before")
    @classmethod
    def validate_trust_proxy_headers(cls, v: Union[bool, str, None], info) -> bool:
        if v is not None:
            if isinstance(v, bool):
                return v
            if isinstance(v, str):
                return v.strip().lower() in ("true", "1", "yes")
        env = (info.data.get("ENVIRONMENT") or "development").lower()
        return env == "production"

    @field_validator("SECRET_KEY", mode="after")
    @classmethod
    def validate_secret_key(cls, v: str, info) -> str:
        env = (info.data.get("ENVIRONMENT") or "development").lower()
        cleaned = (v or "").strip()
        if not cleaned:
            if env == "development":
                warnings.warn(
                    "SECRET_KEY is not set in backend/.env; using an ephemeral process secret. "
                    "Set a fixed >=32-char SECRET_KEY in backend/.env for persistent local sessions.",
                    stacklevel=2,
                )
                return _EPHEMERAL_DEV_SECRET
            raise ValueError("SECRET_KEY must be configured via environment in non-development environments.")
        if len(cleaned) < 32 or "change-me" in cleaned.lower():
            if env == "development":
                warnings.warn(
                    "SECRET_KEY is weak or a placeholder; generate at least 32 random characters.",
                    stacklevel=2,
                )
                return cleaned
            raise ValueError("SECRET_KEY must be at least 32 random characters in non-development environments.")
        return cleaned

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            cleaned = v.strip()
            if not cleaned:
                return ["*"]
            try:
                parsed = json.loads(cleaned)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                return [i.strip() for i in cleaned.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
