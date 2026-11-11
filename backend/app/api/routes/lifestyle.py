from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.lifestyle_log import LifestyleLog
from app.models.user import User
from app.schemas.lifestyle_log import (
    LifestyleLogCreate,
    LifestyleLogResponse,
)

router = APIRouter(prefix="/lifestyle", tags=["Lifestyle Logs"])


@router.post("/", response_model=LifestyleLogResponse, status_code=status.HTTP_201_CREATED)
def create_lifestyle_log(
    payload: LifestyleLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log daily lifestyle metrics owned by the authenticated user."""
    log = LifestyleLog(user_id=current_user.id, **payload.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/", response_model=List[LifestyleLogResponse])
def get_user_lifestyle(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all lifestyle logs for the authenticated user."""
    logs = (
        db.query(LifestyleLog)
        .filter(LifestyleLog.user_id == current_user.id)
        .order_by(LifestyleLog.log_date.desc())
        .all()
    )
    return logs
