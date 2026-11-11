from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.lab_report import LabReport
from app.models.user import User
from app.schemas.lab_report import (
    LabReportCreate,
    LabReportResponse,
)

router = APIRouter(prefix="/lab-reports", tags=["Lab Reports"])


@router.post("/", response_model=LabReportResponse, status_code=status.HTTP_201_CREATED)
def create_lab_report(
    payload: LabReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Save a lab biomarker record owned by the authenticated user."""
    report = LabReport(user_id=current_user.id, **payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/", response_model=List[LabReportResponse])
def get_user_lab_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all laboratory biomarker records for the authenticated user."""
    reports = (
        db.query(LabReport)
        .filter(LabReport.user_id == current_user.id)
        .order_by(LabReport.report_date.desc())
        .all()
    )
    return reports


@router.delete("/{report_id}", status_code=status.HTTP_200_OK)
def delete_lab_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a lab report entry owned by the authenticated user."""
    report = (
        db.query(LabReport)
        .filter(LabReport.id == report_id, LabReport.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lab report {report_id} not found.",
        )
    db.delete(report)
    db.commit()
    return {"message": f"Lab report {report_id} successfully deleted."}
