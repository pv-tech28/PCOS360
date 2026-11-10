from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.menstrual_cycle import MenstrualCycle
from app.schemas.menstrual_cycle import (
    MenstrualCycleCreate,
    MenstrualCycleResponse,
)
from app.services import ensure_dev_user

router = APIRouter(prefix="/cycles", tags=["Menstrual Cycles"])


@router.post("/", response_model=MenstrualCycleResponse, status_code=status.HTTP_201_CREATED)
def create_cycle(payload: MenstrualCycleCreate, db: Session = Depends(get_db)):
    """Log a new menstrual cycle record."""
    ensure_dev_user(db, payload.user_id)
    cycle = MenstrualCycle(**payload.model_dump())
    db.add(cycle)
    db.commit()
    db.refresh(cycle)
    return cycle


@router.get("/{user_id}", response_model=List[MenstrualCycleResponse])
def get_user_cycles(user_id: int, db: Session = Depends(get_db)):
    """Retrieve all logged menstrual cycles for a user, ordered by start date descending."""
    cycles = (
        db.query(MenstrualCycle)
        .filter(MenstrualCycle.user_id == user_id)
        .order_by(MenstrualCycle.period_start_date.desc())
        .all()
    )
    return cycles


@router.delete("/{cycle_id}", status_code=status.HTTP_200_OK)
def delete_cycle(cycle_id: int, db: Session = Depends(get_db)):
    """Delete a menstrual cycle record by cycle ID."""
    cycle = db.query(MenstrualCycle).filter(MenstrualCycle.id == cycle_id).first()
    if not cycle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menstrual cycle record {cycle_id} not found.",
        )
    db.delete(cycle)
    db.commit()
    return {"message": f"Menstrual cycle record {cycle_id} successfully deleted."}

