from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

_ALLOWED_DIAGNOSIS = {
    "diagnosed": "Diagnosed",
    "not diagnosed": "Not diagnosed",
    "unsure": "Unsure",
}


def _normalize_diagnosis(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    cleaned = " ".join(value.strip().split())
    normalized = _ALLOWED_DIAGNOSIS.get(cleaned.lower())
    if not normalized:
        raise ValueError("diagnosis_status must be 'Diagnosed', 'Not diagnosed', or 'Unsure'.")
    return normalized


def _clean_string_list(values: Optional[List[str]]) -> List[str]:
    if not values:
        return []
    return [item.strip() for item in values if isinstance(item, str) and item.strip()]


class HealthProfileBase(BaseModel):
    age: int = Field(..., ge=10, le=100)
    height: float = Field(..., ge=50, le=250, description="Height in centimeters")
    weight: float = Field(..., ge=20, le=300, description="Weight in kilograms")
    diagnosis_status: str = Field("Diagnosed", description="Diagnosed / Not diagnosed / Unsure")
    diagnosis_year: Optional[int] = Field(None, ge=1950, le=2100)
    existing_conditions: List[str] = Field(default_factory=list)
    medications: List[str] = Field(default_factory=list)

    @field_validator("diagnosis_status")
    @classmethod
    def validate_diagnosis_status(cls, v: str) -> str:
        return _normalize_diagnosis(v) or "Diagnosed"

    @field_validator("existing_conditions", "medications", mode="before")
    @classmethod
    def validate_lists(cls, v):
        if v is None:
            return []
        if isinstance(v, str):
            return [s.strip() for s in v.split(",") if s.strip()]
        return _clean_string_list(v)


class HealthProfileCreate(HealthProfileBase):
    model_config = ConfigDict(extra="forbid")


class HealthProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    age: Optional[int] = Field(None, ge=10, le=100)
    height: Optional[float] = Field(None, ge=50, le=250)
    weight: Optional[float] = Field(None, ge=20, le=300)
    diagnosis_status: Optional[str] = None
    diagnosis_year: Optional[int] = Field(None, ge=1950, le=2100)
    existing_conditions: Optional[List[str]] = None
    medications: Optional[List[str]] = None

    @field_validator("diagnosis_status")
    @classmethod
    def validate_diagnosis_status(cls, v: Optional[str]) -> Optional[str]:
        return _normalize_diagnosis(v)

    @field_validator("existing_conditions", "medications", mode="before")
    @classmethod
    def validate_lists(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            return [s.strip() for s in v.split(",") if s.strip()]
        return _clean_string_list(v)


class HealthProfileResponse(HealthProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
