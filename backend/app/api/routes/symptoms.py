from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.daily_symptom import DailySymptom
from app.schemas.daily_symptom import (
    DailySymptomCreate,
    DailySymptomUpdate,
    DailySymptomResponse,
)
from app.services import ensure_dev_user

router = APIRouter(prefix="/symptoms", tags=["Daily Symptoms"])


@router.post("/", response_model=DailySymptomResponse, status_code=status.HTTP_201_CREATED)
def create_symptom_log(payload: DailySymptomCreate, db: Session = Depends(get_db)):
    """Log daily symptoms for a user."""
    ensure_dev_user(db, payload.user_id)
    symptom = DailySymptom(**payload.model_dump())
    db.add(symptom)
    db.commit()
    db.refresh(symptom)
    return symptom


@router.get("/{user_id}", response_model=List[DailySymptomResponse])
def get_user_symptoms(user_id: int, db: Session = Depends(get_db)):
    """Retrieve all daily symptom records for a user, ordered by log date descending."""
    symptoms = (
        db.query(DailySymptom)
        .filter(DailySymptom.user_id == user_id)
        .order_by(DailySymptom.log_date.desc())
        .all()
    )
    return symptoms


@router.put("/{symptom_id}", response_model=DailySymptomResponse)
def update_symptom_log(symptom_id: int, payload: DailySymptomUpdate, db: Session = Depends(get_db)):
    """Update a specific daily symptom entry."""
    symptom = db.query(DailySymptom).filter(DailySymptom.id == symptom_id).first()
    if not symptom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Symptom log {symptom_id} not found.",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(symptom, field, value)

    db.commit()
    db.refresh(symptom)
    return symptom


@router.delete("/{symptom_id}", status_code=status.HTTP_200_OK)
def delete_symptom_log(symptom_id: int, db: Session = Depends(get_db)):
    """Delete a specific daily symptom entry."""
    symptom = db.query(DailySymptom).filter(DailySymptom.id == symptom_id).first()
    if not symptom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Symptom log {symptom_id} not found.",
        )
    db.delete(symptom)
    db.commit()
    return {"message": f"Symptom log {symptom_id} successfully deleted."}
