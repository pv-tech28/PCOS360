from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class LifestyleLogBase(BaseModel):
    log_date: date
    sleep_hours: float = Field(..., ge=0, le=24)
    stress_level: int = Field(..., ge=1, le=5)
    water_intake: float = Field(..., ge=0, description="Liters or glasses")
    exercise_minutes: int = Field(0, ge=0)
    food_habits: Optional[str] = None
    meal_regularity: Optional[str] = None


class LifestyleLogCreate(LifestyleLogBase):
    user_id: int


class LifestyleLogResponse(LifestyleLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
