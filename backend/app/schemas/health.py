from pydantic import BaseModel


class RootResponse(BaseModel):
    message: str = "Welcome to PCOS360 API"
    status: str = "running"


class HealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "PCOS360 Backend"
    version: str = "1.0.0"

