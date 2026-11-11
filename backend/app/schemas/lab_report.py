import math
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class LabReportBase(BaseModel):
    report_name: str = Field(..., min_length=1, max_length=200)
    test_name: str = Field(..., min_length=1, max_length=200)
    test_value: float
    unit: str = Field(..., min_length=1, max_length=64)
    reference_range: str = Field(..., min_length=1, max_length=120)
    report_date: date

    @field_validator("report_name", "test_name", "unit", "reference_range")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Field cannot be empty or whitespace only.")
        return cleaned

    @field_validator("test_value")
    @classmethod
    def validate_finite(cls, v: float) -> float:
        if not math.isfinite(v):
            raise ValueError("test_value must be finite.")
        return v


class LabReportCreate(LabReportBase):
    model_config = ConfigDict(extra="forbid")


class LabReportResponse(LabReportBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
