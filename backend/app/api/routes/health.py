from fastapi import APIRouter, status
from pydantic import BaseModel
from typing import Dict, Any
from app.core.config import settings
from app.core.database import get_db_status

router = APIRouter(tags=["Health"])


class ExtendedHealthResponse(BaseModel):
    status: str
    service: str
    version: str
    database: Dict[str, Any]


@router.get(
    "/health",
    response_model=ExtendedHealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health & Database Status Check",
    description="Returns service name, version, and database connectivity status."
)
async def check_health() -> ExtendedHealthResponse:
    db_status = get_db_status()
    return ExtendedHealthResponse(
        status="healthy" if db_status.get("status") == "connected" else "degraded",
        service="PCOS360 Backend",
        version=settings.VERSION,
        database=db_status
    )
