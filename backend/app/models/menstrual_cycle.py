from sqlalchemy import Column, Integer, String, Date, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class MenstrualCycle(Base):
    __tablename__ = "menstrual_cycles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    period_start_date = Column(Date, nullable=False)
    period_end_date = Column(Date, nullable=True)
    cycle_length = Column(Integer, nullable=False)  # in days
    flow_intensity = Column(String(50), nullable=True)  # Light / Medium / Heavy / Spotting
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="menstrual_cycles")

