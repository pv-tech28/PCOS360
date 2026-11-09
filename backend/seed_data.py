"""
PCOS360 Database Seeder Script
Initializes PostgreSQL / SQLite database with realistic demo data for Ananya Sharma.
"""
from database import SessionLocal, engine, Base
import models

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if profile exists
    existing = db.query(models.UserProfile).first()
    if not existing:
        profile = models.UserProfile(
            name="Ananya Sharma",
            email="ananya.sharma@example.com",
            age=23,
            height_cm=160.0,
            weight_kg=65.0,
            pcos_status="Diagnosed",
            diagnosis_year=2023,
            medical_conditions=["Insulin Resistance", "Mild Vitamin D Deficiency"],
            medications=["Myo-Inositol & D-Chiro Inositol (40:1)", "Vitamin D3 2000 IU", "Omega-3"]
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

        # Seed initial lab report
        report = models.LabReport(
            user_id=profile.id,
            filename="Report_Jan2025_Metabolic_Panel.pdf",
            lab_name="Apex Diagnostic Laboratories",
            date="2025-01-26",
            status="Analyzed",
            verified=True,
            tests=[
                {"name": "Fasting Blood Glucose", "value": 96, "unit": "mg/dL", "normalRange": "70 - 99", "status": "Normal", "interpretation": "Normal fasting level."},
                {"name": "HbA1c", "value": 5.8, "unit": "%", "normalRange": "< 5.7", "status": "Borderline", "interpretation": "Slightly above ideal. Early prediabetic insulin resistance trend."},
                {"name": "Fasting Insulin", "value": 14.2, "unit": "μIU/mL", "normalRange": "< 10.0", "status": "Borderline", "interpretation": "Elevated basal insulin."},
                {"name": "LH / FSH Ratio", "value": 2.3, "unit": "Ratio", "normalRange": "1.0 - 1.5", "status": "Elevated", "interpretation": "Characteristic ovulatory dysregulation in classic PCOS."},
                {"name": "Total Testosterone", "value": 52, "unit": "ng/dL", "normalRange": "15 - 45", "status": "Elevated", "interpretation": "Mild hyperandrogenism."}
            ]
        )
        db.add(report)

        # Seed initial daily log
        log = models.DailyLog(
            user_id=profile.id,
            date="2025-01-27",
            cycle_day=18,
            sleep_hours=7.5,
            stress_level=2,
            energy_level="Moderate",
            water_glasses=8,
            meds_taken=True,
            symptoms=["Mild Fatigue", "Bloating / Water Retention"],
            notes="Morning inositol taken. Afternoon energy stable."
        )
        db.add(log)

        # Seed initial care gaps
        gap1 = models.CareGap(
            id="gap-1",
            user_id=profile.id,
            category="Metabolic",
            severity="Medium",
            title="Metabolic Check-up Review Due",
            description="Your latest HbA1c is 5.8% (borderline). 6 months since last formal fasting insulin assessment.",
            action_label="Add New Lab Report",
            route="lab-reports",
            due_text="Review within 30 days",
            suggested_questions=["Should we test fasting insulin and C-peptide alongside fasting glucose?"]
        )
        gap2 = models.CareGap(
            id="gap-2",
            user_id=profile.id,
            category="Clinical",
            severity="High",
            title="Follow-up Consultation Due",
            description="No gynecologist or endocrinologist visit has been recorded in the last 4 months.",
            action_label="Prepare Consultation",
            route="consultation-copilot",
            due_text="Overdue by 3 weeks",
            suggested_questions=["Can we review my cycle regularity trends over the last 90 days?"]
        )
        db.add(gap1)
        db.add(gap2)

        db.commit()
        print("✓ Database seeded successfully with initial clinical records.")
    else:
        print("Database already contains records.")
    db.close()

if __name__ == "__main__":
    seed()
