from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.health_profile import HealthProfile
from app.schemas.health_profile import (
    HealthProfileCreate,
    HealthProfileUpdate,
    HealthProfileResponse,
)
from app.services import ensure_dev_user

router = APIRouter(prefix="/profile", tags=["Health Profile"])


@router.post("/", response_model=HealthProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile(payload: HealthProfileCreate, db: Session = Depends(get_db)):
    """Create or initialize a health profile for a user."""
    ensure_dev_user(db, payload.user_id)

    existing = db.query(HealthProfile).filter(HealthProfile.user_id == payload.user_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Health profile already exists for user {payload.user_id}. Use PUT to update.",
        )

    profile = HealthProfile(**payload.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/{user_id}", response_model=HealthProfileResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    """Retrieve health profile by user ID."""
    profile = db.query(HealthProfile).filter(HealthProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Health profile not found for user {user_id}.",
        )
    return profile


@router.put("/{user_id}", response_model=HealthProfileResponse)
def update_profile(user_id: int, payload: HealthProfileUpdate, db: Session = Depends(get_db)):
    """Update an existing health profile by user ID."""
    profile = db.query(HealthProfile).filter(HealthProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Health profile not found for user {user_id}.",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile
