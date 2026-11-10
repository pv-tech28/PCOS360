from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class MenstrualCycleBase(BaseModel):
    period_start_date: date
    period_end_date: Optional[date] = None
    cycle_length: int = Field(..., ge=15, le=120, description="Cycle length in days")
    flow_intensity: Optional[str] = Field("Medium", description="Light / Medium / Heavy / Spotting")
    notes: Optional[str] = None


class MenstrualCycleCreate(MenstrualCycleBase):
    user_id: int


class MenstrualCycleResponse(MenstrualCycleBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

