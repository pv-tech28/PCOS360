from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.lab_report import LabReport
from app.schemas.lab_report import (
    LabReportCreate,
    LabReportResponse,
)
from app.services import ensure_dev_user

router = APIRouter(prefix="/lab-reports", tags=["Lab Reports"])


@router.post("/", response_model=LabReportResponse, status_code=status.HTTP_201_CREATED)
def create_lab_report(payload: LabReportCreate, db: Session = Depends(get_db)):
    """Save an extracted or manually verified lab biomarker record."""
    ensure_dev_user(db, payload.user_id)
    report = LabReport(**payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/{user_id}", response_model=List[LabReportResponse])
def get_user_lab_reports(user_id: int, db: Session = Depends(get_db)):
    """Retrieve all laboratory biomarker records for a user, ordered by report date descending."""
    reports = (
        db.query(LabReport)
        .filter(LabReport.user_id == user_id)
        .order_by(LabReport.report_date.desc())
        .all()
    )
    return reports


@router.delete("/{report_id}", status_code=status.HTTP_200_OK)
def delete_lab_report(report_id: int, db: Session = Depends(get_db)):
    """Delete a specific lab report entry by ID."""
    report = db.query(LabReport).filter(LabReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lab report {report_id} not found.",
        )
    db.delete(report)
    db.commit()
    return {"message": f"Lab report {report_id} successfully deleted."}

