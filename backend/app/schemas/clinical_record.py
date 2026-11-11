import math
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ClinicalRecordBase(BaseModel):
    testosterone: Optional[float] = Field(None, ge=0)
    free_testosterone: Optional[float] = Field(None, ge=0)
    dheas: Optional[float] = Field(None, ge=0)
    amh: Optional[float] = Field(None, ge=0)
    ultrasound_findings: Optional[str] = Field(None, max_length=1000)
    ovulation_history: Optional[str] = Field(None, max_length=1000)

    @field_validator("testosterone", "free_testosterone", "dheas", "amh")
    @classmethod
    def validate_finite(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and not math.isfinite(v):
            raise ValueError("Numeric clinical marker must be finite.")
        return v

    @field_validator("ultrasound_findings", "ovulation_history")
    @classmethod
    def strip_optional_text(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip()
        return cleaned if cleaned else None


class ClinicalRecordCreate(ClinicalRecordBase):
    model_config = ConfigDict(extra="forbid")


class ClinicalRecordResponse(ClinicalRecordBase):
    id: int
    user_id: int
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)
