from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
import models, schemas

router = APIRouter(prefix="/copilot", tags=["Consultation Copilot"])

@router.post("/generate", response_model=schemas.ConsultationPacketResponse)
def generate_copilot_packet(req: schemas.ConsultationPacketRequest, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).first()
    name = profile.name if profile else "Ananya Sharma"
    age = profile.age if profile else 23
    pcos_status = profile.pcos_status if profile else "Diagnosed"

    patient_summary = {
        "name": name,
        "age": age,
        "status": pcos_status,
        "bmi": 25.4,
        "cycle_average_days": 35,
        "current_medications": ["Myo-Inositol & D-Chiro Inositol", "Vitamin D3", "Omega-3"]
    }

    symptom_highlights = [
        "Luteal phase fatigue rated 7-8/10 on under-rested days",
        "Mild cystic acne flares observed mid-cycle",
        "Bloating responsive to hydration and refined sugar reduction"
    ]

    lab_highlights = [
        {"biomarker": "HbA1c", "value": "5.8%", "flag": "Borderline"},
        {"biomarker": "Fasting Insulin", "value": "14.2 μIU/mL", "flag": "Elevated"},
        {"biomarker": "LH / FSH Ratio", "value": "2.3", "flag": "Elevated"},
        {"biomarker": "Total Testosterone", "value": "52 ng/dL", "flag": "Elevated"},
        {"biomarker": "Triglycerides", "value": "165 mg/dL", "flag": "Borderline"}
    ]

    default_questions = [
        f"Based on my borderline HbA1c (5.8%) and fasting insulin (14.2), should we consider any medical adjuncts alongside inositol?",
        f"Can we review my cycle regularity trends over the last 90 days (averaging 35-36 days)?",
        f"Would an updated pelvic ultrasound be beneficial to assess ovarian morphology?",
        *req.additional_questions
    ]

    return schemas.ConsultationPacketResponse(
        patient_summary=patient_summary,
        symptom_highlights=symptom_highlights,
        lab_highlights=lab_highlights,
        suggested_questions=default_questions,
        generated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    )

