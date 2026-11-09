from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=schemas.UserProfileBase)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).first()
    if not profile:
        # Return default profile
        return schemas.UserProfileBase()
    return profile

@router.put("", response_model=schemas.UserProfileBase)
def update_profile(profile_data: schemas.UserProfileBase, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).first()
    if not profile:
        profile = models.UserProfile(**profile_data.dict())
        db.add(profile)
    else:
        for key, value in profile_data.dict().items():
            setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile
