from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.daily_symptom import DailySymptom
from app.models.user import User
from app.schemas.daily_symptom import (
    DailySymptomCreate,
    DailySymptomUpdate,
    DailySymptomResponse,
)

router = APIRouter(prefix="/symptoms", tags=["Daily Symptoms"])


@router.post("/", response_model=DailySymptomResponse, status_code=status.HTTP_201_CREATED)
def create_symptom_log(
    payload: DailySymptomCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log daily symptoms owned by the authenticated user."""
    symptom = DailySymptom(user_id=current_user.id, **payload.model_dump())
    db.add(symptom)
    db.commit()
    db.refresh(symptom)
    return symptom


@router.get("/", response_model=List[DailySymptomResponse])
def get_user_symptoms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all daily symptom records for the authenticated user."""
    symptoms = (
        db.query(DailySymptom)
        .filter(DailySymptom.user_id == current_user.id)
        .order_by(DailySymptom.log_date.desc())
        .all()
    )
    return symptoms


@router.put("/{symptom_id}", response_model=DailySymptomResponse)
def update_symptom_log(
    symptom_id: int,
    payload: DailySymptomUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a daily symptom entry owned by the authenticated user."""
    symptom = (
        db.query(DailySymptom)
        .filter(DailySymptom.id == symptom_id, DailySymptom.user_id == current_user.id)
        .first()
    )
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
def delete_symptom_log(
    symptom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a daily symptom entry owned by the authenticated user."""
    symptom = (
        db.query(DailySymptom)
        .filter(DailySymptom.id == symptom_id, DailySymptom.user_id == current_user.id)
        .first()
    )
    if not symptom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Symptom log {symptom_id} not found.",
        )
    db.delete(symptom)
    db.commit()
    return {"message": f"Symptom log {symptom_id} successfully deleted."}
