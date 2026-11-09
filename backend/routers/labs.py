from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
import models, schemas

router = APIRouter(prefix="/labs", tags=["Lab Reports"])

@router.get("", response_model=List[schemas.LabReportResponse])
def get_lab_reports(db: Session = Depends(get_db)):
    reports = db.query(models.LabReport).order_by(models.LabReport.id.desc()).all()
    return reports

@router.post("/upload")
async def upload_lab_file(
    file: UploadFile = File(...),
    lab_name: str = Form("Diagnostic Lab"),
    date: str = Form(None),
    db: Session = Depends(get_db)
):
    date_str = date or datetime.utcnow().strftime("%Y-%m-%d")
    
    # Mock extracted biomarker values with clinical reference intervals
    mock_tests = [
        {"name": "Fasting Blood Glucose", "value": 94.0, "unit": "mg/dL", "normalRange": "70 - 99", "status": "Normal", "interpretation": "Healthy fasting range."},
        {"name": "HbA1c", "value": 5.7, "unit": "%", "normalRange": "< 5.7", "status": "Borderline", "interpretation": "Upper normal boundary. Early glycemic check."},
        {"name": "Fasting Insulin", "value": 13.5, "unit": "μIU/mL", "normalRange": "< 10.0", "status": "Borderline", "interpretation": "Mild basal elevation."},
        {"name": "Total Cholesterol", "value": 198.0, "unit": "mg/dL", "normalRange": "< 200", "status": "Normal", "interpretation": "Acceptable total lipids."},
        {"name": "Triglycerides", "value": 156.0, "unit": "mg/dL", "normalRange": "< 150", "status": "Borderline", "interpretation": "Mild elevation."},
        {"name": "LH / FSH Ratio", "value": 2.2, "unit": "Ratio", "normalRange": "1.0 - 1.5", "status": "Elevated", "interpretation": "LH predominant ratio."}
    ]

    db_report = models.LabReport(
        filename=file.filename,
        lab_name=lab_name,
        date=date_str,
        status="Analyzed",
        verified=True,
        tests=mock_tests
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report
