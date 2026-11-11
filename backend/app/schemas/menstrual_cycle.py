from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class MenstrualCycleBase(BaseModel):
    period_start_date: date
    period_end_date: Optional[date] = None
    cycle_length: int = Field(..., ge=15, le=120, description="Cycle length in days")
    flow_intensity: Optional[str] = Field("Medium", max_length=40, description="Light / Medium / Heavy / Spotting")
    notes: Optional[str] = Field(None, max_length=1000)

    @field_validator("flow_intensity", "notes")
    @classmethod
    def strip_optional_text(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip()
        return cleaned if cleaned else None

    @model_validator(mode="after")
    def validate_period_dates(self):
        if self.period_end_date is not None and self.period_end_date < self.period_start_date:
            raise ValueError("period_end_date cannot be earlier than period_start_date.")
        return self


class MenstrualCycleCreate(MenstrualCycleBase):
    model_config = ConfigDict(extra="forbid")


class MenstrualCycleResponse(MenstrualCycleBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
