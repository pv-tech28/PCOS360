from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.clinical_record import ClinicalRecord
from app.schemas.clinical_record import (
    ClinicalRecordCreate,
    ClinicalRecordResponse,
)
from app.services import ensure_dev_user

router = APIRouter(prefix="/clinical-records", tags=["Clinical Records"])


@router.post("/", response_model=ClinicalRecordResponse, status_code=status.HTTP_201_CREATED)
def create_clinical_record(payload: ClinicalRecordCreate, db: Session = Depends(get_db)):
    """Record clinical presentation markers (androgens, AMH, ultrasound findings)."""
    ensure_dev_user(db, payload.user_id)
    record = ClinicalRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{user_id}", response_model=List[ClinicalRecordResponse])
def get_user_clinical_records(user_id: int, db: Session = Depends(get_db)):
    """Retrieve all clinical records for a user, ordered by recorded date descending."""
    records = (
        db.query(ClinicalRecord)
        .filter(ClinicalRecord.user_id == user_id)
        .order_by(ClinicalRecord.recorded_at.desc())
        .all()
    )
    return records

