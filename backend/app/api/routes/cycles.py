from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.menstrual_cycle import MenstrualCycle
from app.models.user import User
from app.schemas.menstrual_cycle import (
    MenstrualCycleCreate,
    MenstrualCycleResponse,
)

router = APIRouter(prefix="/cycles", tags=["Menstrual Cycles"])


@router.post("/", response_model=MenstrualCycleResponse, status_code=status.HTTP_201_CREATED)
def create_cycle(
    payload: MenstrualCycleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log a new menstrual cycle record owned by the authenticated user."""
    cycle = MenstrualCycle(user_id=current_user.id, **payload.model_dump())
    db.add(cycle)
    db.commit()
    db.refresh(cycle)
    return cycle


@router.get("/", response_model=List[MenstrualCycleResponse])
def get_user_cycles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all logged menstrual cycles for the authenticated user."""
    cycles = (
        db.query(MenstrualCycle)
        .filter(MenstrualCycle.user_id == current_user.id)
        .order_by(MenstrualCycle.period_start_date.desc())
        .all()
    )
    return cycles


@router.delete("/{cycle_id}", status_code=status.HTTP_200_OK)
def delete_cycle(
    cycle_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a menstrual cycle record owned by the authenticated user."""
    cycle = (
        db.query(MenstrualCycle)
        .filter(MenstrualCycle.id == cycle_id, MenstrualCycle.user_id == current_user.id)
        .first()
    )
    if not cycle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menstrual cycle record {cycle_id} not found.",
        )
    db.delete(cycle)
    db.commit()
    return {"message": f"Menstrual cycle record {cycle_id} successfully deleted."}
