"""
Direct testing of PCOS360 Phase 2 CRUD endpoints, schemas, and database operations.
Directly invokes FastAPI route functions with a real SQLAlchemy session.
"""
from datetime import date, datetime
from app.core.database import SessionLocal, get_engine, Base
from app.models.user import User
from app.models.health_profile import HealthProfile
from app.models.menstrual_cycle import MenstrualCycle
from app.models.daily_symptom import DailySymptom
from app.models.lifestyle_log import LifestyleLog
from app.models.lab_report import LabReport
from app.models.clinical_record import ClinicalRecord

# Import route handlers
from app.api.routes import profile, cycles, symptoms, lifestyle, lab_reports, clinical_records
from app.schemas.health_profile import HealthProfileCreate, HealthProfileUpdate
from app.schemas.menstrual_cycle import MenstrualCycleCreate
from app.schemas.daily_symptom import DailySymptomCreate, DailySymptomUpdate
from app.schemas.lifestyle_log import LifestyleLogCreate
from app.schemas.lab_report import LabReportCreate
from app.schemas.clinical_record import ClinicalRecordCreate


def test_all():
    print("==================================================")
    print("Testing PCOS360 CRUD API Operations Directly")
    print("==================================================")

    db = SessionLocal()
    try:
        # 1. Health Profile CRUD
        print("\n[TEST 1] Health Profile CRUD ...")
        # GET profile for user 1
        p = profile.get_profile(user_id=1, db=db)
        print(f"GET profile(1): Age={p.age}, Diagnosis={p.diagnosis_status}")
        assert p.age == 23
        assert p.diagnosis_status == "Diagnosed"

        # PUT update profile
        p_up = profile.update_profile(
            user_id=1,
            payload=HealthProfileUpdate(weight=64.2, medications=["Myo-Inositol", "Vitamin D3", "Omega-3"]),
            db=db
        )
        print(f"PUT profile(1): New Weight={p_up.weight}")
        assert p_up.weight == 64.2
        print("✓ Health Profile CRUD verified.")

        # 2. Menstrual Cycles CRUD
        print("\n[TEST 2] Menstrual Cycles CRUD ...")
        # POST new cycle
        c_new = cycles.create_cycle(
            payload=MenstrualCycleCreate(
                user_id=1,
                period_start_date=date(2024, 9, 20),
                period_end_date=date(2024, 9, 25),
                cycle_length=35,
                flow_intensity="Medium",
                notes="Tested direct CRUD cycle"
            ),
            db=db
        )
        print(f"POST cycle: ID={c_new.id}, Length={c_new.cycle_length}")
        assert c_new.id is not None
        assert c_new.cycle_length == 35

        # GET user cycles
        user_cycles = cycles.get_user_cycles(user_id=1, db=db)
        print(f"GET cycles(1): Found {len(user_cycles)} cycles")
        assert len(user_cycles) >= 1

        # DELETE cycle
        del_res = cycles.delete_cycle(cycle_id=c_new.id, db=db)
        print(f"DELETE cycle({c_new.id}): {del_res['message']}")
        print("✓ Menstrual Cycles CRUD verified.")

        # 3. Daily Symptoms CRUD
        print("\n[TEST 3] Daily Symptoms CRUD ...")
        # POST symptom
        sym_new = symptoms.create_symptom_log(
            payload=DailySymptomCreate(
                user_id=1,
                log_date=date(2025, 1, 29),
                acne_severity="Mild",
                fatigue_level=3,
                bloating=2,
                mood="Refreshed",
                notes="Morning walk completed"
            ),
            db=db
        )
        print(f"POST symptom: ID={sym_new.id}, Fatigue={sym_new.fatigue_level}")
        assert sym_new.id is not None

        # PUT update symptom
        sym_up = symptoms.update_symptom_log(
            symptom_id=sym_new.id,
            payload=DailySymptomUpdate(fatigue_level=2, mood="Energetic"),
            db=db
        )
        print(f"PUT symptom({sym_new.id}): New Fatigue={sym_up.fatigue_level}")
        assert sym_up.fatigue_level == 2

        # GET user symptoms
        user_syms = symptoms.get_user_symptoms(user_id=1, db=db)
        print(f"GET symptoms(1): Found {len(user_syms)} logs")
        assert len(user_syms) >= 1

        # DELETE symptom
        del_sym = symptoms.delete_symptom_log(symptom_id=sym_new.id, db=db)
        print(f"DELETE symptom({sym_new.id}): {del_sym['message']}")
        print("✓ Daily Symptoms CRUD verified.")

        # 4. Lifestyle Logs (POST, GET)
        print("\n[TEST 4] Lifestyle Logs CRUD ...")
        life_new = lifestyle.create_lifestyle_log(
            payload=LifestyleLogCreate(
                user_id=1,
                log_date=date(2025, 1, 29),
                sleep_hours=8.0,
                stress_level=2,
                water_intake=2.5,
                exercise_minutes=40,
                food_habits="Balanced Low-GI",
                meal_regularity="Regular"
            ),
            db=db
        )
        print(f"POST lifestyle: ID={life_new.id}, Sleep={life_new.sleep_hours}h")
        assert life_new.id is not None

        user_life = lifestyle.get_user_lifestyle(user_id=1, db=db)
        print(f"GET lifestyle(1): Found {len(user_life)} logs")
        assert len(user_life) >= 1
        print("✓ Lifestyle Logs CRUD verified.")

        # 5. Lab Reports (POST, GET, DELETE)
        print("\n[TEST 5] Lab Reports CRUD ...")
        lab_new = lab_reports.create_lab_report(
            payload=LabReportCreate(
                user_id=1,
                report_name="Apex Diagnostic Panel",
                test_name="Fasting Insulin",
                test_value=14.2,
                unit="μIU/mL",
                reference_range="< 10.0",
                report_date=date(2025, 1, 26)
            ),
            db=db
        )
        print(f"POST lab report: ID={lab_new.id}, Value={lab_new.test_value} {lab_new.unit}")
        assert lab_new.id is not None

        user_labs = lab_reports.get_user_lab_reports(user_id=1, db=db)
        print(f"GET lab reports(1): Found {len(user_labs)} records")
        assert len(user_labs) >= 1

        del_lab = lab_reports.delete_lab_report(report_id=lab_new.id, db=db)
        print(f"DELETE lab report({lab_new.id}): {del_lab['message']}")
        print("✓ Lab Reports CRUD verified.")

        # 6. Clinical Records (POST, GET)
        print("\n[TEST 6] Clinical Records CRUD ...")
        clin_new = clinical_records.create_clinical_record(
            payload=ClinicalRecordCreate(
                user_id=1,
                testosterone=50.0,
                free_testosterone=4.5,
                amh=6.0,
                ultrasound_findings="PCOM pattern: multiple sub-centimeter follicles",
                ovulation_history="35 day average intervals"
            ),
            db=db
        )
        print(f"POST clinical record: ID={clin_new.id}, Testosterone={clin_new.testosterone}")
        assert clin_new.id is not None

        user_clin = clinical_records.get_user_clinical_records(user_id=1, db=db)
        print(f"GET clinical records(1): Found {len(user_clin)} records")
        assert len(user_clin) >= 1
        print("✓ Clinical Records CRUD verified.")

        print("\n==================================================")
        print("ALL 6 RESOURCE CRUD OPERATIONS VERIFIED (6/6)!")
        print("==================================================")

    finally:
        db.close()


if __name__ == "__main__":
    test_all()
