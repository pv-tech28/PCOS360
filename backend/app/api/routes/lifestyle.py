from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.lifestyle_log import LifestyleLog
from app.schemas.lifestyle_log import (
    LifestyleLogCreate,
    LifestyleLogResponse,
)
from app.services import ensure_dev_user

router = APIRouter(prefix="/lifestyle", tags=["Lifestyle Logs"])


@router.post("/", response_model=LifestyleLogResponse, status_code=status.HTTP_201_CREATED)
def create_lifestyle_log(payload: LifestyleLogCreate, db: Session = Depends(get_db)):
    """Log daily lifestyle metrics (sleep, stress, water, physical activity)."""
    ensure_dev_user(db, payload.user_id)
    log = LifestyleLog(**payload.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/{user_id}", response_model=List[LifestyleLogResponse])
def get_user_lifestyle(user_id: int, db: Session = Depends(get_db)):
    """Retrieve all lifestyle logs for a user, ordered by log date descending."""
    logs = (
        db.query(LifestyleLog)
        .filter(LifestyleLog.user_id == user_id)
        .order_by(LifestyleLog.log_date.desc())
        .all()
    )
    return logs
