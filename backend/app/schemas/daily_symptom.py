from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class DailySymptomBase(BaseModel):
    log_date: date
    acne_severity: Optional[str] = Field(None, max_length=100)
    hair_loss: Optional[str] = Field(None, max_length=100)
    unwanted_hair_growth: Optional[str] = Field(None, max_length=100)
    fatigue_level: Optional[int] = Field(None, ge=1, le=10)
    bloating: Optional[int] = Field(None, ge=1, le=10)
    pelvic_pain: Optional[int] = Field(None, ge=1, le=10)
    mood: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=2000)

    @field_validator("acne_severity", "hair_loss", "unwanted_hair_growth", "mood", "notes")
    @classmethod
    def strip_optional_text(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip()
        return cleaned if cleaned else None


class DailySymptomCreate(DailySymptomBase):
    model_config = ConfigDict(extra="forbid")


class DailySymptomUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    acne_severity: Optional[str] = Field(None, max_length=100)
    hair_loss: Optional[str] = Field(None, max_length=100)
    unwanted_hair_growth: Optional[str] = Field(None, max_length=100)
    fatigue_level: Optional[int] = Field(None, ge=1, le=10)
    bloating: Optional[int] = Field(None, ge=1, le=10)
    pelvic_pain: Optional[int] = Field(None, ge=1, le=10)
    mood: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=2000)

    @field_validator("acne_severity", "hair_loss", "unwanted_hair_growth", "mood", "notes")
    @classmethod
    def strip_optional_text(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip()
        return cleaned if cleaned else None


class DailySymptomResponse(DailySymptomBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
