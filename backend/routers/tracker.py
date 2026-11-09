from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
import models, schemas

router = APIRouter(prefix="/tracker", tags=["Tracker"])

@router.get("/logs", response_model=List[schemas.DailyLogResponse])
def get_daily_logs(db: Session = Depends(get_db)):
    logs = db.query(models.DailyLog).order_by(models.DailyLog.id.desc()).limit(30).all()
    return logs

@router.post("/logs", response_model=schemas.DailyLogResponse)
def create_daily_log(log: schemas.DailyLogCreate, db: Session = Depends(get_db)):
    date_str = log.date or datetime.utcnow().strftime("%Y-%m-%d")
    db_log = models.DailyLog(
        date=date_str,
        cycle_day=log.cycle_day,
        sleep_hours=log.sleep_hours,
        stress_level=log.stress_level,
        energy_level=log.energy_level,
        water_glasses=log.water_glasses,
        meds_taken=log.meds_taken,
        symptoms=log.symptoms,
        notes=log.notes
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

