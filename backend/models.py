
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Date,
    DateTime,
    Text,
    JSON,
    ForeignKey
)
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Ananya Sharma")
    email = Column(
        String(150),
        unique=True,
        index=True,
        default="ananya@example.com"
    )
    age = Column(Integer, default=23)
    height_cm = Column(Float, default=160.0)
    weight_kg = Column(Float, default=65.0)
    pcos_status = Column(String(50), default="Diagnosed")
    diagnosis_year = Column(Integer, nullable=True, default=2023)
    medical_conditions = Column(JSON, default=list)
    medications = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    daily_logs = relationship(
        "DailyLog",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    lab_reports = relationship(
        "LabReport",
        back_populates="user",
        cascade="all, delete-orphan"
    )


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("user_profiles.id"),
        nullable=True
    )

    date = Column(String(20), index=True)
    cycle_day = Column(Integer, default=1)
    sleep_hours = Column(Float, default=7.5)
    stress_level = Column(Integer, default=2)
    energy_level = Column(String(50), default="Moderate")
    water_glasses = Column(Integer, default=8)
    meds_taken = Column(Boolean, default=True)
    symptoms = Column(JSON, default=list)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship(
        "UserProfile",
        back_populates="daily_logs"
    )


class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("user_profiles.id"),
        nullable=False,
        index=True
    )

    filename = Column(String(255), nullable=True)
    lab_name = Column(String(150), default="Apex Diagnostics")
    date = Column(String(20), index=True)
    status = Column(String(50), default="Analyzed")
    verified = Column(Boolean, default=True)
    tests = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship(
        "UserProfile",
        back_populates="lab_reports"
    )


class CareGap(Base):
    __tablename__ = "care_gaps"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)

    category = Column(String(50))
    severity = Column(String(20))
    title = Column(String(200))
    description = Column(Text)
    action_label = Column(String(100))
    route = Column(String(100))
    due_text = Column(String(100))
    suggested_questions = Column(JSON, default=list)
    is_resolved = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)

    date = Column(String(20), index=True)
    category = Column(String(50))
    title = Column(String(200))
    description = Column(Text)
    badge = Column(String(50))
    badge_color = Column(String(30), default="purple")

    created_at = Column(DateTime, default=datetime.utcnow)
