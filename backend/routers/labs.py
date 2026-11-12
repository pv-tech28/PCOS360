
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from database import get_db
import models
import schemas

router = APIRouter(prefix="/labs", tags=["Lab Reports"])


def get_or_create_default_user(db: Session):
    user = db.query(models.UserProfile).first()

    if user:
        return user

    user = models.UserProfile(
        name="Ananya Sharma",
        email="ananya@example.com",
        age=23,
        height_cm=160.0,
        weight_kg=65.0,
        pcos_status="Diagnosed",
        diagnosis_year=2023,
        medical_conditions=["Insulin Resistance"],
        medications=["Myo-Inositol & D-Chiro Inositol (40:1)"]
    )

    db.add(user)
    db.flush()

    return user


@router.get("", response_model=List[schemas.LabReportResponse])
def get_lab_reports(db: Session = Depends(get_db)):
    reports = (
        db.query(models.LabReport)
        .order_by(models.LabReport.id.desc())
        .all()
    )

    return reports


@router.post("/upload", response_model=schemas.LabReportResponse)
async def upload_lab_file(
    file: UploadFile = File(...),
    lab_name: str = Form("Diagnostic Lab"),
    date: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid file"
        )

    date_str = date or datetime.utcnow().strftime("%Y-%m-%d")

    try:
        # Get or create default user
        user = get_or_create_default_user(db)

        # Mock biomarker data for demo purposes
        mock_tests = [
            {
                "name": "Fasting Blood Glucose",
                "value": 94.0,
                "unit": "mg/dL",
                "normalRange": "70 - 99",
                "status": "Normal",
                "interpretation": "Demo value only."
            },
            {
                "name": "HbA1c",
                "value": 5.7,
                "unit": "%",
                "normalRange": "< 5.7",
                "status": "Borderline",
                "interpretation": "Demo value only."
            },
            {
                "name": "Fasting Insulin",
                "value": 13.5,
                "unit": "μIU/mL",
                "normalRange": "< 10.0",
                "status": "Borderline",
                "interpretation": "Demo value only."
            },
            {
                "name": "Total Cholesterol",
                "value": 198.0,
                "unit": "mg/dL",
                "normalRange": "< 200",
                "status": "Normal",
                "interpretation": "Demo value only."
            },
            {
                "name": "Triglycerides",
                "value": 156.0,
                "unit": "mg/dL",
                "normalRange": "< 150",
                "status": "Borderline",
                "interpretation": "Demo value only."
            },
            {
                "name": "LH / FSH Ratio",
                "value": 2.2,
                "unit": "Ratio",
                "normalRange": "1.0 - 1.5",
                "status": "Elevated",
                "interpretation": "Demo value only."
            }
        ]

        db_report = models.LabReport(
            user_id=user.id,
            filename=file.filename,
            lab_name=lab_name,
            date=date_str,
            status="Analyzed",
            verified=False,
            tests=mock_tests
        )

        db.add(db_report)
        db.commit()
        db.refresh(db_report)

        return db_report

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Lab report upload failed: {str(e)}"
        )

    finally:
        await file.close()
