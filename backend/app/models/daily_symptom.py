from sqlalchemy import Column, Integer, String, Date, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class DailySymptom(Base):
    __tablename__ = "daily_symptoms"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    log_date = Column(Date, nullable=False, index=True)
    acne_severity = Column(String(50), nullable=True)  # None / Mild / Moderate / Severe
    hair_loss = Column(String(50), nullable=True)  # None / Mild / Moderate / Severe
    unwanted_hair_growth = Column(String(50), nullable=True)  # None / Mild / Moderate / Severe
    fatigue_level = Column(Integer, nullable=True)  # 1 to 10
    bloating = Column(Integer, nullable=True)  # 1 to 10
    pelvic_pain = Column(Integer, nullable=True)  # 1 to 10
    mood = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="daily_symptoms")
