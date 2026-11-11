from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.clinical_record import ClinicalRecord
from app.models.user import User
from app.schemas.clinical_record import (
    ClinicalRecordCreate,
    ClinicalRecordResponse,
)

router = APIRouter(prefix="/clinical-records", tags=["Clinical Records"])


@router.post("/", response_model=ClinicalRecordResponse, status_code=status.HTTP_201_CREATED)
def create_clinical_record(
    payload: ClinicalRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Record clinical presentation markers owned by the authenticated user."""
    record = ClinicalRecord(user_id=current_user.id, **payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/", response_model=List[ClinicalRecordResponse])
def get_user_clinical_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all clinical records for the authenticated user."""
    records = (
        db.query(ClinicalRecord)
        .filter(ClinicalRecord.user_id == current_user.id)
        .order_by(ClinicalRecord.recorded_at.desc())
        .all()
    )
    return records
