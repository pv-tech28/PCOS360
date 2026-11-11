"""
PCOS360 Database Seeder
Seeds initial records for development user (Ananya Sharma) across all 7 database tables.
"""
from datetime import date, datetime, timezone
from sqlalchemy import inspect
from app.core.database import SessionLocal, get_engine, Base
from app.models.user import User
from app.models.health_profile import HealthProfile
from app.models.menstrual_cycle import MenstrualCycle
from app.models.daily_symptom import DailySymptom
from app.models.lifestyle_log import LifestyleLog
from app.models.lab_report import LabReport
from app.models.clinical_record import ClinicalRecord


def seed():
    engine = get_engine()
    if engine.dialect.name == "sqlite":
        Base.metadata.create_all(bind=engine)
    elif not inspect(engine).has_table("users"):
        raise RuntimeError(
            "PostgreSQL schema is not initialized. Run 'alembic upgrade head' before running seed_data.py."
        )
    db = SessionLocal()

    try:
        # 1. Legacy/Demo Reference User (non-login sample row preserved cleanly for local reference)
        user = db.query(User).filter(User.email == "ananya.sharma@example.com").first()
        if not user:
            user = User(
                full_name="Ananya Sharma (Demo)",
                email="ananya.sharma@example.com",
                password_hash=None,
                is_active=True,
                is_demo=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"✓ Seeded Demo User: {user.full_name} (ID: {user.id})")

        demo_user_id = user.id

        # 2. Health Profile
        profile = db.query(HealthProfile).filter(HealthProfile.user_id == demo_user_id).first()
        if not profile:
            profile = HealthProfile(
                user_id=demo_user_id,
                age=23,
                height=160.0,
                weight=65.0,
                diagnosis_status="Diagnosed",
                diagnosis_year=2023,
                existing_conditions=["Insulin Resistance", "Mild Vitamin D Deficiency"],
                medications=["Myo-Inositol & D-Chiro Inositol (40:1)", "Vitamin D3 2000 IU", "Omega-3"],
            )
            db.add(profile)
            print("✓ Seeded Health Profile")

        # 3. Menstrual Cycles
        cycle_count = db.query(MenstrualCycle).filter(MenstrualCycle.user_id == demo_user_id).count()
        if cycle_count == 0:
            cycles = [
                MenstrualCycle(
                    user_id=demo_user_id,
                    period_start_date=date(2025, 1, 10),
                    period_end_date=date(2025, 1, 16),
                    cycle_length=35,
                    flow_intensity="Medium",
                    notes="Current cycle: Day 18 Luteal phase",
                ),
                MenstrualCycle(
                    user_id=demo_user_id,
                    period_start_date=date(2024, 12, 6),
                    period_end_date=date(2024, 12, 11),
                    cycle_length=35,
                    flow_intensity="Medium",
                    notes="Mild cramps on Day 1",
                ),
                MenstrualCycle(
                    user_id=demo_user_id,
                    period_start_date=date(2024, 10, 31),
                    period_end_date=date(2024, 11, 6),
                    cycle_length=36,
                    flow_intensity="Heavy",
                    notes="Cycle delayed 3 days due to exams stress",
                ),
            ]
            db.add_all(cycles)
            print("✓ Seeded Menstrual Cycles (3 records)")

        # 4. Daily Symptoms
        symptom_count = db.query(DailySymptom).filter(DailySymptom.user_id == demo_user_id).count()
        if symptom_count == 0:
            symptoms = [
                DailySymptom(
                    user_id=demo_user_id,
                    log_date=date(2025, 1, 27),
                    acne_severity="Mild",
                    hair_loss="None",
                    unwanted_hair_growth="Mild",
                    fatigue_level=4,
                    bloating=3,
                    pelvic_pain=1,
                    mood="Optimistic",
                    notes="Energy improved post-supplementation",
                ),
                DailySymptom(
                    user_id=demo_user_id,
                    log_date=date(2025, 1, 26),
                    acne_severity="Mild",
                    hair_loss="None",
                    unwanted_hair_growth="Mild",
                    fatigue_level=6,
                    bloating=5,
                    pelvic_pain=2,
                    mood="Moderate Fatigue",
                    notes="Late evening work deadline",
                ),
            ]
            db.add_all(symptoms)
            print("✓ Seeded Daily Symptoms (2 records)")

        # 5. Lifestyle Logs
        lifestyle_count = db.query(LifestyleLog).filter(LifestyleLog.user_id == demo_user_id).count()
        if lifestyle_count == 0:
            logs = [
                LifestyleLog(
                    user_id=demo_user_id,
                    log_date=date(2025, 1, 27),
                    sleep_hours=7.5,
                    stress_level=2,
                    water_intake=2.5,
                    exercise_minutes=35,
                    food_habits="Balanced Low-GI",
                    meal_regularity="Regular",
                ),
                LifestyleLog(
                    user_id=demo_user_id,
                    log_date=date(2025, 1, 26),
                    sleep_hours=6.2,
                    stress_level=4,
                    water_intake=1.8,
                    exercise_minutes=20,
                    food_habits="Higher Carb",
                    meal_regularity="Irregular",
                ),
            ]
            db.add_all(logs)
            print("✓ Seeded Lifestyle Logs (2 records)")

        # 6. Lab Reports
        lab_count = db.query(LabReport).filter(LabReport.user_id == demo_user_id).count()
        if lab_count == 0:
            labs = [
                LabReport(
                    user_id=demo_user_id,
                    report_name="Metabolic & Hormone Panel",
                    test_name="HbA1c",
                    test_value=5.8,
                    unit="%",
                    reference_range="< 5.7",
                    report_date=date(2025, 1, 26),
                ),
                LabReport(
                    user_id=demo_user_id,
                    report_name="Metabolic & Hormone Panel",
                    test_name="Fasting Blood Glucose",
                    test_value=96.0,
                    unit="mg/dL",
                    reference_range="70 - 99",
                    report_date=date(2025, 1, 26),
                ),
                LabReport(
                    user_id=demo_user_id,
                    report_name="Metabolic & Hormone Panel",
                    test_name="Total Testosterone",
                    test_value=52.0,
                    unit="ng/dL",
                    reference_range="15 - 45",
                    report_date=date(2025, 1, 26),
                ),
            ]
            db.add_all(labs)
            print("✓ Seeded Lab Reports (3 records)")

        # 7. Clinical Records
        clinical_count = db.query(ClinicalRecord).filter(ClinicalRecord.user_id == demo_user_id).count()
        if clinical_count == 0:
            clinical = ClinicalRecord(
                user_id=demo_user_id,
                testosterone=52.0,
                free_testosterone=4.8,
                dheas=280.0,
                amh=6.2,
                ultrasound_findings="Pending Pelvic Ultrasound imaging review",
                ovulation_history="Oligomenorrhea with 34-38 day intervals",
                recorded_at=datetime.now(timezone.utc),
            )
            db.add(clinical)
            print("✓ Seeded Clinical Records (1 record)")

        db.commit()
        print(f"✓ All 7 tables seeded cleanly for demo user ID {demo_user_id}.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
