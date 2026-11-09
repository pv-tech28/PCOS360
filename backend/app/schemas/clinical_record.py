from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ClinicalRecordBase(BaseModel):
    testosterone: Optional[float] = None
    free_testosterone: Optional[float] = None
    dheas: Optional[float] = None
    amh: Optional[float] = None
    ultrasound_findings: Optional[str] = None
    ovulation_history: Optional[str] = None


class ClinicalRecordCreate(ClinicalRecordBase):
    user_id: int


class ClinicalRecordResponse(ClinicalRecordBase):
    id: int
    user_id: int
    recorded_at: datetime

    class Config:
        from_attributes = True
