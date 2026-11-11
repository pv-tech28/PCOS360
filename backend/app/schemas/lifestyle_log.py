import math
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class LifestyleLogBase(BaseModel):
    log_date: date
    sleep_hours: float = Field(..., ge=0, le=24)
    stress_level: int = Field(..., ge=1, le=5)
    water_intake: float = Field(..., ge=0, le=50, description="Liters or glasses")
    exercise_minutes: int = Field(0, ge=0, le=1440)
    food_habits: Optional[str] = Field(None, max_length=500)
    meal_regularity: Optional[str] = Field(None, max_length=200)

    @field_validator("sleep_hours", "water_intake")
    @classmethod
    def validate_finite(cls, v: float) -> float:
        if not math.isfinite(v):
            raise ValueError("Numeric measurement must be finite.")
        return v

    @field_validator("food_habits", "meal_regularity")
    @classmethod
    def strip_optional_text(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip()
        return cleaned if cleaned else None


class LifestyleLogCreate(LifestyleLogBase):
    model_config = ConfigDict(extra="forbid")


class LifestyleLogResponse(LifestyleLogBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
