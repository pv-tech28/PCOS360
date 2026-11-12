
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class UserProfileBase(BaseModel):
    name: str = "Ananya Sharma"
    age: int = 23
    height_cm: float = 160.0
    weight_kg: float = 65.0
    pcos_status: str = "Diagnosed"
    diagnosis_year: Optional[int] = 2023
    medical_conditions: List[str] = Field(default_factory=lambda: ["Insulin Resistance"])
    medications: List[str] = Field(default_factory=lambda: ["Myo-Inositol & D-Chiro Inositol (40:1)"])


class UserProfileResponse(UserProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DailyLogCreate(BaseModel):
    date: Optional[str] = None
    cycle_day: int = 18
    sleep_hours: float = 7.5
    stress_level: int = 2
    energy_level: str = "Moderate"
    water_glasses: int = 8
    meds_taken: bool = True
    symptoms: List[str] = Field(default_factory=list)
    notes: Optional[str] = None


class DailyLogResponse(DailyLogCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LabTestItem(BaseModel):
    name: str
    value: float
    unit: str
    normalRange: str
    status: str
    interpretation: Optional[str] = None


class LabReportCreate(BaseModel):
    filename: str
    lab_name: str = "Apex Diagnostic Laboratories"
    date: str
    status: str = "Analyzed"
    verified: bool = True
    tests: List[LabTestItem] = Field(default_factory=list)


class LabReportResponse(LabReportCreate):
    id: int
    filename: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class WhatIfRequest(BaseModel):
    sleep_target: float = 8.0
    exercise_mins: int = 35
    meal_consistency: str = "High"
    stress_management: bool = True


class WhatIfResponse(BaseModel):
    habit_score: int
    routine_resilience: str
    projected_benefits: List[Dict[str, str]]
    disclaimer: str


class ConsultationPacketRequest(BaseModel):
    doctor_type: str = "Gynecologist"
    additional_questions: List[str] = Field(default_factory=list)


class ConsultationPacketResponse(BaseModel):
    patient_summary: Dict[str, Any]
    symptom_highlights: List[str]
    lab_highlights: List[Dict[str, Any]]
    suggested_questions: List[str]
    generated_at: str
