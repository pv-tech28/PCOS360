from pydantic import BaseModel
from datetime import date, datetime


class LabReportBase(BaseModel):
    report_name: str
    test_name: str
    test_value: float
    unit: str
    reference_range: str
    report_date: date


class LabReportCreate(LabReportBase):
    user_id: int


class LabReportResponse(LabReportBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
