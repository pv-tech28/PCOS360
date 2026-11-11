from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import inspect
from app.core.config import settings
from app.core.database import Base, DatabaseConnectionError, get_engine
from app.api.routes import api_router
from app.schemas.health import RootResponse
import app.models  # Ensure all SQLAlchemy models are registered

logger = logging.getLogger("pcos360.app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables only for local SQLite; PostgreSQL schema should be managed via Alembic.
    try:
        engine = get_engine()
        if engine.dialect.name == "sqlite":
            Base.metadata.create_all(bind=engine)
        elif not inspect(engine).has_table("users"):
            logger.warning(
                "PostgreSQL connected, but application tables are missing. "
                "Run 'alembic upgrade head' inside backend/ before serving API requests."
            )
    except DatabaseConnectionError as e:
        logger.error(f"Database startup check failed: {e}")
    except Exception as e:
        logger.warning(f"Database table initialization notice: {e}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(DatabaseConnectionError)
async def database_unavailable_handler(request: Request, exc: DatabaseConnectionError):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "Database Unavailable",
            "detail": str(exc),
        },
    )


# Basic Exception Handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred."
        }
    )


# Root Endpoint
@app.get(
    "/",
    response_model=RootResponse,
    status_code=status.HTTP_200_OK,
    tags=["Root"],
    summary="Root Welcome Endpoint",
    description="Welcome message and status indicator for PCOS360 API."
)
async def root() -> RootResponse:
    return RootResponse(
        message="Welcome to PCOS360 API",
        status="running"
    )


# Modular API Router Mount
app.include_router(api_router, prefix=settings.API_V1_STR)
