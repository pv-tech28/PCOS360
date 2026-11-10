from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class HealthProfileBase(BaseModel):
    age: int = Field(..., ge=10, le=100)
    height: float = Field(..., ge=50, le=250, description="Height in centimeters")
    weight: float = Field(..., ge=20, le=300, description="Weight in kilograms")
    diagnosis_status: str = Field("Diagnosed", description="Diagnosed / Not Diagnosed / Unsure")
    diagnosis_year: Optional[int] = None
    existing_conditions: Optional[List[str]] = []
    medications: Optional[List[str]] = []


class HealthProfileCreate(HealthProfileBase):
    user_id: int


class HealthProfileUpdate(BaseModel):
    age: Optional[int] = Field(None, ge=10, le=100)
    height: Optional[float] = Field(None, ge=50, le=250)
    weight: Optional[float] = Field(None, ge=20, le=300)
    diagnosis_status: Optional[str] = None
    diagnosis_year: Optional[int] = None
    existing_conditions: Optional[List[str]] = None
    medications: Optional[List[str]] = None


class HealthProfileResponse(HealthProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

