from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class DailySymptomBase(BaseModel):
    log_date: date
    acne_severity: Optional[str] = None
    hair_loss: Optional[str] = None
    unwanted_hair_growth: Optional[str] = None
    fatigue_level: Optional[int] = Field(None, ge=1, le=10)
    bloating: Optional[int] = Field(None, ge=1, le=10)
    pelvic_pain: Optional[int] = Field(None, ge=1, le=10)
    mood: Optional[str] = None
    notes: Optional[str] = None


class DailySymptomCreate(DailySymptomBase):
    user_id: int


class DailySymptomUpdate(BaseModel):
    acne_severity: Optional[str] = None
    hair_loss: Optional[str] = None
    unwanted_hair_growth: Optional[str] = None
    fatigue_level: Optional[int] = Field(None, ge=1, le=10)
    bloating: Optional[int] = Field(None, ge=1, le=10)
    pelvic_pain: Optional[int] = Field(None, ge=1, le=10)
    mood: Optional[str] = None
    notes: Optional[str] = None


class DailySymptomResponse(DailySymptomBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

