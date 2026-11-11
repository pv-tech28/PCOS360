import os
import tempfile
import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Ensure test suite does not require a local .env SECRET_KEY
os.environ.setdefault("SECRET_KEY", "test-only-ephemeral-secret-key-at-least-32-chars")


class TestPCOS360AuthAndPrivacy(unittest.TestCase):
    """Comprehensive auth, session revocation, input validation, and cross-user isolation tests."""

    @classmethod
    def setUpClass(cls):
        fd, cls.db_path = tempfile.mkstemp(prefix="pcos360_test_", suffix=".db")
        os.close(fd)
        cls.engine = create_engine(
            f"sqlite:///{cls.db_path}",
            connect_args={"check_same_thread": False},
        )
        cls.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=cls.engine)

        from app.core.database import Base, get_db
        import app.models  # noqa: F401
        from app.main import app

        Base.metadata.create_all(bind=cls.engine)

        def override_get_db():
            db = cls.SessionLocal()
            try:
                yield db
            finally:
                db.close()

        cls.app = app
        cls.app.dependency_overrides[get_db] = override_get_db
        cls.client = TestClient(cls.app)

    def setUp(self):
        from app.core.rate_limit import auth_rate_limiter

        auth_rate_limiter.reset()

    @classmethod
    def tearDownClass(cls):
        cls.app.dependency_overrides.clear()
        cls.engine.dispose()
        if os.path.exists(cls.db_path):
            os.remove(cls.db_path)

    def _register_and_login(self, full_name: str, email: str, password: str = "StrongPass123"):
        res = self.client.post(
            "/api/auth/register",
            json={"full_name": full_name, "email": email, "password": password},
        )
        self.assertEqual(res.status_code, 201, res.text)
        body = res.json()
        return body["user"]["id"], {"Authorization": f"Bearer {body['access_token']}"}

    def test_unauthenticated_requests_are_rejected(self):
        protected = [
            ("GET", "/api/auth/me", None),
            ("PUT", "/api/auth/me", {"full_name": "Anon"}),
            ("POST", "/api/auth/logout", None),
            ("GET", "/api/profile/me", None),
            ("POST", "/api/profile/", {"age": 25, "height": 160, "weight": 60}),
            ("PUT", "/api/profile/me", {"weight": 59}),
            ("GET", "/api/cycles/", None),
            ("POST", "/api/cycles/", {"period_start_date": "2026-01-01", "cycle_length": 28}),
            ("DELETE", "/api/cycles/1", None),
            ("GET", "/api/symptoms/", None),
            ("POST", "/api/symptoms/", {"log_date": "2026-01-02", "mood": "Calm"}),
            ("PUT", "/api/symptoms/1", {"mood": "Tired"}),
            ("DELETE", "/api/symptoms/1", None),
            ("GET", "/api/lifestyle/", None),
            (
                "POST",
                "/api/lifestyle/",
                {"log_date": "2026-01-02", "sleep_hours": 7.5, "stress_level": 2, "water_intake": 2.0},
            ),
            ("GET", "/api/lab-reports/", None),
            (
                "POST",
                "/api/lab-reports/",
                {
                    "report_name": "Panel",
                    "test_name": "TSH",
                    "test_value": 2.1,
                    "unit": "mIU/L",
                    "reference_range": "0.4-4.0",
                    "report_date": "2026-01-03",
                },
            ),
            ("DELETE", "/api/lab-reports/1", None),
            ("GET", "/api/clinical-records/", None),
            ("POST", "/api/clinical-records/", {"amh": 4.2}),
        ]
        for method, path, payload in protected:
            res = self.client.request(method, path, json=payload)
            self.assertEqual(res.status_code, 401, f"{method} {path} returned {res.status_code}: {res.text}")

    def test_auth_lifecycle_and_demo_account_blocked(self):
        from app.models.user import User

        # Seed a legacy passwordless demo user like ID 1
        with self.SessionLocal() as db:
            demo = User(
                full_name="Ananya Sharma (Demo)",
                email="demo.ananya@example.com",
                password_hash=None,
                is_active=True,
                is_demo=True,
            )
            db.add(demo)
            db.commit()

        # Demo user cannot log in: blank password rejected (422) and guessed passwords return 401
        self.assertEqual(
            self.client.post(
                "/api/auth/login",
                json={"email": "demo.ananya@example.com", "password": ""},
            ).status_code,
            422,
        )
        for bad_pw in ["password", "StrongPass123"]:
            res = self.client.post(
                "/api/auth/login",
                json={"email": "demo.ananya@example.com", "password": bad_pw},
            )
            self.assertEqual(res.status_code, 401, f"Demo user should be blocked: {res.text}")

        # Weak registration rejected
        self.assertEqual(
            self.client.post(
                "/api/auth/register",
                json={"full_name": "Weak User", "email": "weak@example.com", "password": "onlyletters"},
            ).status_code,
            422,
        )

        # Register, update /me, logout revokes token, re-login issues fresh session
        uid, headers = self._register_and_login("Priya Nair", "PRIYA@Example.com", "Secret1234")
        me = self.client.get("/api/auth/me", headers=headers)
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.json()["id"], uid)
        self.assertEqual(me.json()["email"], "priya@example.com")

        dup = self.client.post(
            "/api/auth/register",
            json={"full_name": "Priya Two", "email": "priya@example.com", "password": "Secret1234"},
        )
        self.assertEqual(dup.status_code, 409)

        upd = self.client.put("/api/auth/me", headers=headers, json={"full_name": "Priya K. Nair"})
        self.assertEqual(upd.status_code, 200)
        self.assertEqual(upd.json()["full_name"], "Priya K. Nair")

        logout_res = self.client.post("/api/auth/logout", headers=headers)
        self.assertEqual(logout_res.status_code, 200)

        # Revoked session token must fail everywhere
        self.assertEqual(self.client.get("/api/auth/me", headers=headers).status_code, 401)
        self.assertEqual(self.client.get("/api/cycles/", headers=headers).status_code, 401)

        # Wrong password rejected, correct password works
        self.assertEqual(
            self.client.post(
                "/api/auth/login",
                json={"email": "priya@example.com", "password": "WrongPassword9"},
            ).status_code,
            401,
        )
        login_res = self.client.post(
            "/api/auth/login",
            json={"email": "priya@example.com", "password": "Secret1234"},
        )
        self.assertEqual(login_res.status_code, 200)
        new_headers = {"Authorization": f"Bearer {login_res.json()['access_token']}"}
        self.assertEqual(self.client.get("/api/auth/me", headers=new_headers).status_code, 200)

    def test_cross_user_isolation_and_spoofing_rejection(self):
        uid_a, hdr_a = self._register_and_login("User Alpha", "alpha@example.com")
        uid_b, hdr_b = self._register_and_login("User Beta", "beta@example.com")

        # Client-supplied user_id is forbidden (422) on every Create endpoint
        spoof_cases = [
            ("/api/profile/", {"user_id": uid_b, "age": 26, "height": 162, "weight": 58}),
            ("/api/cycles/", {"user_id": uid_b, "period_start_date": "2026-02-01", "cycle_length": 30}),
            ("/api/symptoms/", {"user_id": uid_b, "log_date": "2026-02-02", "mood": "Steady"}),
            (
                "/api/lifestyle/",
                {
                    "user_id": uid_b,
                    "log_date": "2026-02-02",
                    "sleep_hours": 8.0,
                    "stress_level": 2,
                    "water_intake": 2.5,
                },
            ),
            (
                "/api/lab-reports/",
                {
                    "user_id": uid_b,
                    "report_name": "Metabolic",
                    "test_name": "Fasting Insulin",
                    "test_value": 9.4,
                    "unit": "uIU/mL",
                    "reference_range": "2.6-24.9",
                    "report_date": "2026-02-01",
                },
            ),
            ("/api/clinical-records/", {"user_id": uid_b, "amh": 5.1}),
        ]
        for path, body in spoof_cases:
            res = self.client.post(path, headers=hdr_a, json=body)
            self.assertEqual(res.status_code, 422, f"{path} did not reject user_id: {res.status_code} {res.text}")

        # User A creates valid records in all 6 health resources
        prof_a = self.client.post(
            "/api/profile/",
            headers=hdr_a,
            json={
                "age": 27,
                "height": 164,
                "weight": 61,
                "diagnosis_status": "Diagnosed",
                "diagnosis_year": 2023,
                "existing_conditions": ["Insulin Resistance"],
                "medications": ["Metformin 500mg"],
            },
        )
        self.assertEqual(prof_a.status_code, 201)
        self.assertEqual(prof_a.json()["user_id"], uid_a)

        cyc_a = self.client.post(
            "/api/cycles/",
            headers=hdr_a,
            json={
                "period_start_date": "2026-03-01",
                "period_end_date": "2026-03-05",
                "cycle_length": 34,
                "flow_intensity": "Medium",
            },
        )
        self.assertEqual(cyc_a.status_code, 201)
        cyc_id = cyc_a.json()["id"]
        self.assertEqual(cyc_a.json()["user_id"], uid_a)

        sym_a = self.client.post(
            "/api/symptoms/",
            headers=hdr_a,
            json={"log_date": "2026-03-02", "acne_severity": "Mild", "fatigue_level": 4, "mood": "Calm"},
        )
        self.assertEqual(sym_a.status_code, 201)
        sym_id = sym_a.json()["id"]
        self.assertEqual(sym_a.json()["user_id"], uid_a)

        life_a = self.client.post(
            "/api/lifestyle/",
            headers=hdr_a,
            json={
                "log_date": "2026-03-02",
                "sleep_hours": 7.5,
                "stress_level": 3,
                "water_intake": 2.2,
                "exercise_minutes": 30,
            },
        )
        self.assertEqual(life_a.status_code, 201)
        self.assertEqual(life_a.json()["user_id"], uid_a)

        lab_a = self.client.post(
            "/api/lab-reports/",
            headers=hdr_a,
            json={
                "report_name": "Endocrine Panel",
                "test_name": "Total Testosterone",
                "test_value": 58.2,
                "unit": "ng/dL",
                "reference_range": "15-70",
                "report_date": "2026-03-03",
            },
        )
        self.assertEqual(lab_a.status_code, 201)
        lab_id = lab_a.json()["id"]
        self.assertEqual(lab_a.json()["user_id"], uid_a)

        clin_a = self.client.post(
            "/api/clinical-records/",
            headers=hdr_a,
            json={"testosterone": 58.2, "amh": 6.4, "ultrasound_findings": "Polycystic morphology"},
        )
        self.assertEqual(clin_a.status_code, 201)
        self.assertEqual(clin_a.json()["user_id"], uid_a)

        # User B sees empty lists / 404 on /profile/me
        self.assertEqual(self.client.get("/api/profile/me", headers=hdr_b).status_code, 404)
        self.assertEqual(self.client.get("/api/cycles/", headers=hdr_b).json(), [])
        self.assertEqual(self.client.get("/api/symptoms/", headers=hdr_b).json(), [])
        self.assertEqual(self.client.get("/api/lifestyle/", headers=hdr_b).json(), [])
        self.assertEqual(self.client.get("/api/lab-reports/", headers=hdr_b).json(), [])
        self.assertEqual(self.client.get("/api/clinical-records/", headers=hdr_b).json(), [])

        # User B cannot update or delete User A's records -> 404 (not leaked, not deleted)
        self.assertEqual(self.client.delete(f"/api/cycles/{cyc_id}", headers=hdr_b).status_code, 404)
        self.assertEqual(
            self.client.put(f"/api/symptoms/{sym_id}", headers=hdr_b, json={"mood": "Hacked"}).status_code,
            404,
        )
        self.assertEqual(self.client.delete(f"/api/symptoms/{sym_id}", headers=hdr_b).status_code, 404)
        self.assertEqual(self.client.delete(f"/api/lab-reports/{lab_id}", headers=hdr_b).status_code, 404)

        # User A still has intact records
        self.assertEqual(len(self.client.get("/api/cycles/", headers=hdr_a).json()), 1)
        self.assertEqual(self.client.get("/api/symptoms/", headers=hdr_a).json()[0]["mood"], "Calm")
        self.assertEqual(len(self.client.get("/api/lab-reports/", headers=hdr_a).json()), 1)

        # User A can delete their own records cleanly
        self.assertEqual(self.client.delete(f"/api/cycles/{cyc_id}", headers=hdr_a).status_code, 200)
        self.assertEqual(self.client.delete(f"/api/symptoms/{sym_id}", headers=hdr_a).status_code, 200)
        self.assertEqual(self.client.delete(f"/api/lab-reports/{lab_id}", headers=hdr_a).status_code, 200)
        self.assertEqual(self.client.get("/api/cycles/", headers=hdr_a).json(), [])

    def test_input_validation_guards(self):
        _, headers = self._register_and_login("Validator User", "validator@example.com")

        # Invalid period end earlier than start -> 422
        bad_cycle = self.client.post(
            "/api/cycles/",
            headers=headers,
            json={
                "period_start_date": "2026-04-10",
                "period_end_date": "2026-04-05",
                "cycle_length": 28,
            },
        )
        self.assertEqual(bad_cycle.status_code, 422)

        # Blank lab report name -> 422
        bad_lab = self.client.post(
            "/api/lab-reports/",
            headers=headers,
            json={
                "report_name": "   ",
                "test_name": "TSH",
                "test_value": 2.0,
                "unit": "mIU/L",
                "reference_range": "0.4-4.0",
                "report_date": "2026-04-01",
            },
        )
        self.assertEqual(bad_lab.status_code, 422)

        # Out-of-bounds diagnosis_status -> 422
        bad_diag = self.client.post(
            "/api/profile/",
            headers=headers,
            json={"age": 24, "height": 160, "weight": 55, "diagnosis_status": "UnknownStatus"},
        )
        self.assertEqual(bad_diag.status_code, 422)

    def test_auth_rate_limiting_and_recovery(self):
        from app.core.config import settings

        self._register_and_login("Target Account", "locked@example.com", "CorrectPass!123")
        self._register_and_login("Bystander Account", "bystander@example.com", "OtherPass!123")

        # 1. Fail login up to max attempts -> 401 each time, then 429 with Retry-After
        for _ in range(settings.AUTH_LOGIN_MAX_ATTEMPTS):
            bad = self.client.post(
                "/api/auth/login",
                json={"email": "locked@example.com", "password": "WrongPassword99"},
            )
            self.assertEqual(bad.status_code, 401)

        throttled = self.client.post(
            "/api/auth/login",
            json={"email": "locked@example.com", "password": "CorrectPass!123"},
        )
        self.assertEqual(throttled.status_code, 429)
        self.assertIn("Retry-After", throttled.headers)
        self.assertGreaterEqual(int(throttled.headers["Retry-After"]), 1)

        # 2. Bystander account on same IP can still authenticate cleanly
        ok_bystander = self.client.post(
            "/api/auth/login",
            json={"email": "bystander@example.com", "password": "OtherPass!123"},
        )
        self.assertEqual(ok_bystander.status_code, 200)

        # 3. Failed counter for an account resets upon successful authentication
        self._register_and_login("Recovery User", "recover@example.com", "RecoverPass!123")
        for _ in range(settings.AUTH_LOGIN_MAX_ATTEMPTS - 1):
            self.assertEqual(
                self.client.post(
                    "/api/auth/login",
                    json={"email": "recover@example.com", "password": "WrongPassword99"},
                ).status_code,
                401,
            )
        self.assertEqual(
            self.client.post(
                "/api/auth/login",
                json={"email": "recover@example.com", "password": "RecoverPass!123"},
            ).status_code,
            200,
        )
        # Should tolerate failures again rather than tripping immediately after prior success
        self.assertEqual(
            self.client.post(
                "/api/auth/login",
                json={"email": "recover@example.com", "password": "WrongPassword99"},
            ).status_code,
            401,
        )

        # 4. Registration bursts per IP are also throttled cleanly with 429
        from app.core.rate_limit import auth_rate_limiter

        auth_rate_limiter.reset()
        for idx in range(settings.AUTH_REGISTER_MAX_ATTEMPTS):
            res = self.client.post(
                "/api/auth/register",
                json={
                    "full_name": f"Burst {idx}",
                    "email": f"burst_{idx}@example.com",
                    "password": "BurstPassword!123",
                },
            )
            self.assertEqual(res.status_code, 201, res.text)

        burst_blocked = self.client.post(
            "/api/auth/register",
            json={
                "full_name": "Burst Overflow",
                "email": "burst_overflow@example.com",
                "password": "BurstPassword!123",
            },
        )
        self.assertEqual(burst_blocked.status_code, 429)
        self.assertIn("Retry-After", burst_blocked.headers)


if __name__ == "__main__":
    unittest.main(verbosity=2)
