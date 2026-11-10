from sqlalchemy import Column, Integer, Float, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class LifestyleLog(Base):
    __tablename__ = "lifestyle_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    log_date = Column(Date, nullable=False, index=True)
    sleep_hours = Column(Float, nullable=False)
    stress_level = Column(Integer, nullable=False)  # 1 to 5
    water_intake = Column(Float, nullable=False)  # liters or glasses
    exercise_minutes = Column(Integer, nullable=False, default=0)
    food_habits = Column(String(150), nullable=True)  # Balanced / High-Protein / High-Carb / Low-GI
    meal_regularity = Column(String(50), nullable=True)  # Regular / Irregular / Intermittent
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="lifestyle_logs")

