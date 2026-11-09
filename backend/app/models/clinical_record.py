from sqlalchemy import Column, Integer, Float, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class ClinicalRecord(Base):
    __tablename__ = "clinical_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    testosterone = Column(Float, nullable=True)  # ng/dL
    free_testosterone = Column(Float, nullable=True)  # pg/mL
    dheas = Column(Float, nullable=True)  # ug/dL
    amh = Column(Float, nullable=True)  # ng/mL
    ultrasound_findings = Column(Text, nullable=True)  # e.g., "PCOM detected: 22 follicles in right ovary"
    ovulation_history = Column(Text, nullable=True)  # e.g., "Oligomenorrhea with irregular intervals"
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="clinical_records")
