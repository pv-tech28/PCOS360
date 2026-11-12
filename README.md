# PCOS360 – AI-Powered PCOS Health Intelligence Platform

> **Beyond Symptoms. Understand Your PCOS.**

PCOS360 is a multi-user health intelligence platform across FastAPI, React (web), and React Native / Expo (mobile) to help women track PCOS/PCOD symptoms, menstrual cycles, lifestyle habits, metabolic biomarkers, and clinician consultation summaries.

---

## 🏗️ Architecture & Technology Stack

* **Web Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React, Recharts (`http://localhost:5173`)
* **Mobile App:** React Native + Expo SDK 58 (`mobile/`, Metro bundler on port `8081`)
* **Backend:** FastAPI, Python, Uvicorn, Pydantic v2 (`http://localhost:8000`)
* **Auth & Sessions:** Salted `scrypt` password hashing, HS256 signed JWT bearer tokens backed by revocable `user_sessions` rows
* **Database & ORM:** PostgreSQL (`pcos360_db`, strict fail-fast when configured) or explicit local SQLite (`DATABASE_URL="sqlite:///./pcos360.db"`), SQLAlchemy 2.0, Psycopg 3 (`psycopg[binary]`)
* **Database Migrations:** Alembic

---

## 🗄️ Database Architecture (`pcos360_db`)

The relational schema spans **eight** tables with cascade-delete foreign keys, indexes, and timezone-aware timestamps:

1. **`users`**
   * `id` (PK, Integer, Auto-increment)
   * `full_name` (VARCHAR 150)
   * `email` (VARCHAR 255, Unique, Indexed)
   * `password_hash` (VARCHAR 255, Nullable for demo-only records; Scrypt salted hash for real accounts)
   * `is_active` (Boolean, default `true`)
   * `is_demo` (Boolean, default `false`; blocks interactive login for seeded demo rows)
   * `created_at`, `updated_at` (TIMESTAMPTZ)

2. **`user_sessions`**
   * `id` (PK)
   * `user_id` (FK -> `users.id`, CASCADE delete)
   * `token_jti` (VARCHAR 64, Unique, Indexed)
   * `user_agent` (VARCHAR 255, Optional)
   * `created_at`, `expires_at`, `revoked_at` (TIMESTAMPTZ)

3. **`health_profiles`**
   * `id` (PK)
   * `user_id` (FK -> `users.id`, Unique 1-to-1)
   * `age` (Integer), `height` (Float, cm), `weight` (Float, kg)
   * `diagnosis_status` (`"Diagnosed"` / `"Not diagnosed"` / `"Unsure"`)
   * `diagnosis_year` (Integer, Optional)
   * `existing_conditions` (JSON List, Optional)
   * `medications` (JSON List, Optional)
   * `created_at`, `updated_at` (TIMESTAMPTZ)

4. **`menstrual_cycles`**
   * `id` (PK), `user_id` (FK -> `users.id`)
   * `period_start_date`, `period_end_date` (DATE)
   * `cycle_length` (Integer, days), `flow_intensity` (VARCHAR 50), `notes` (TEXT, Optional)
   * `created_at` (TIMESTAMPTZ)

5. **`daily_symptoms`**
   * `id` (PK), `user_id` (FK -> `users.id`), `log_date` (DATE, Indexed)
   * `acne_severity`, `hair_loss`, `unwanted_hair_growth` (VARCHAR 50)
   * `fatigue_level`, `bloating`, `pelvic_pain` (Integer 1-10)
   * `mood` (VARCHAR 100), `notes` (TEXT)
   * `created_at` (TIMESTAMPTZ)

6. **`lifestyle_logs`**
   * `id` (PK), `user_id` (FK -> `users.id`), `log_date` (DATE, Indexed)
   * `sleep_hours` (Float), `stress_level` (Integer 1-5), `water_intake` (Float)
   * `exercise_minutes` (Integer), `food_habits` (VARCHAR 150), `meal_regularity` (VARCHAR 50)
   * `created_at` (TIMESTAMPTZ)

7. **`lab_reports`**
   * `id` (PK), `user_id` (FK -> `users.id`)
   * `report_name` (VARCHAR 255), `test_name` (VARCHAR 150), `test_value` (Float)
   * `unit` (VARCHAR 50), `reference_range` (VARCHAR 100), `report_date` (DATE)
   * `created_at` (TIMESTAMPTZ)

8. **`clinical_records`**
   * `id` (PK), `user_id` (FK -> `users.id`)
   * `testosterone`, `free_testosterone`, `dheas`, `amh` (Float, Optional)
   * `ultrasound_findings`, `ovulation_history` (TEXT, Optional)
   * `recorded_at` (TIMESTAMPTZ)

---

## 🛠️ Step-by-Step Setup Guide

### 1. Database Setup (PostgreSQL or Explicit Local SQLite)

> **Strict Database Behavior (No Silent Fallback):** If `DATABASE_URL` is configured for PostgreSQL (`postgresql+psycopg://...`, `postgresql://...`, or `postgres://...`) and the database cannot be reached, the backend and Alembic fail explicitly (`DatabaseConnectionError` / HTTP `503` / `/api/health` `"status": "degraded"` with `"PostgreSQL (Unreachable)"`) and **never** fall back silently to SQLite. To use SQLite intentionally for local development, set `DATABASE_URL="sqlite:///./pcos360.db"` in `backend/.env`.

#### Connecting a PostgreSQL Instance
1. On your PostgreSQL server, create the application role and database (keep database credentials out of git and logs):
   ```sql
   CREATE USER pcos360_user WITH PASSWORD '<strong-database-password>';
   CREATE DATABASE pcos360_db OWNER pcos360_user;
   ```
   *(Local quick-test superuser setups can skip `CREATE USER` and run `CREATE DATABASE pcos360_db;` instead.)*

### 2. Backend Environment Variables (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and generate a strong `SECRET_KEY` (required in non-development environments; >=32 random characters):
```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Example `backend/.env` (for managed/remote PostgreSQL, append `?sslmode=require`):
```env
PROJECT_NAME="PCOS360 API"
VERSION="1.0.0"
API_V1_STR="/api"
ENVIRONMENT="development"
DEBUG=true
DEBUG_SQL=false
HOST="0.0.0.0"
PORT=8000

SECRET_KEY="<paste-generated-random-secret>"
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# PostgreSQL (strict: fails clearly if unreachable; for TLS add ?sslmode=require):
DATABASE_URL="postgresql+psycopg://<db_user>:<db_password>@<host>:5432/pcos360_db"
# Or explicitly opt into local SQLite dev mode instead:
# DATABASE_URL="sqlite:///./pcos360.db"

# Allowed browser/bundler dev origins:
BACKEND_CORS_ORIGINS='["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://localhost:8081"]'
```

### 3. Run Alembic Migrations & Verify `/api/health`

Run Alembic **before** starting `uvicorn` or seeding data so `alembic_version` and PostgreSQL tables are created by migrations rather than bypassed:
```powershell
cd backend
.\venv\Scripts\Activate.ps1

# Optional: inspect generated PostgreSQL DDL without touching the DB
alembic upgrade head --sql

# Apply migrations to the configured PostgreSQL instance
alembic upgrade head

# Confirm head revision is active (expected: a1b2c3d4e5f6 (head))
alembic current
```

Start the API and verify `/api/health` reports PostgreSQL connectivity (not SQLite):
```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
# In another shell:
Invoke-RestMethod http://localhost:8000/api/health
```
Expected `/api/health` response:
```json
{
  "status": "healthy",
  "service": "PCOS360 Backend",
  "version": "1.0.0",
  "database": { "status": "connected", "type": "PostgreSQL" }
}
```
If PostgreSQL is unreachable, `/api/health` returns `"status": "degraded"` with `"database": {"status": "error", "type": "PostgreSQL (Unreachable)", ...}` (with credentials redacted) and DB endpoints return HTTP `503 Database Unavailable`.

#### Intentionally Seed Demo Data or Migrate Existing Local SQLite Data
* **Fresh demo records (optional):** After `alembic upgrade head` succeeds, run:
  ```powershell
  python seed_data.py
  ```
  This creates only an `is_demo=True`, `password_hash=None` sample user across the 7 domain tables (blocked from `/api/auth/login`). Real accounts still start empty via `/api/auth/register`.
* **Migrating existing data from `backend/pcos360.db`:** Do not bypass Alembic. First run `alembic upgrade head` against an empty `pcos360_db` in PostgreSQL, then copy real user rows in foreign-key parent-first order (`users` -> `health_profiles`, `daily_symptoms`, `lifestyle_logs`, `menstrual_cycles`, `lab_reports`, `clinical_records`; omit stale `user_sessions` or ask users to re-sign in), preserving `is_active`/`is_demo`/`password_hash`. Afterward, resync every PostgreSQL `SERIAL` sequence:
  ```sql
  SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM users;
  -- Repeat for health_profiles, daily_symptoms, lifestyle_logs, menstrual_cycles, lab_reports, clinical_records, user_sessions
  ```

#### PostgreSQL Migration Compatibility Notes
* Revisions `cbb42492a859` and `a1b2c3d4e5f6` use `sa.func.now()` (emitting PostgreSQL `DEFAULT now()` instead of SQLite-reflected `(CURRENT_TIMESTAMP)`) and guard `sa.inspect(...)` behind `context.is_offline_mode()` so both live `alembic upgrade head` and offline `alembic upgrade head --sql` / `downgrade` target PostgreSQL cleanly.
* Unlike SQLite, PostgreSQL strictly enforces `FOREIGN KEY ... ON DELETE CASCADE`, native `BOOLEAN`/`TIMESTAMPTZ` types, and `SERIAL` sequences; `Base.metadata.create_all` in `app/main.py` and `seed_data.py` runs automatically only for SQLite so PostgreSQL schema changes remain strictly Alembic-managed.

### 4. Frontend Environment (`frontend/.env.example`)

Copy `frontend/.env.example` to `frontend/.env` if targeting a custom backend host:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 5. Running Backend, Web Frontend, and Mobile App

#### Terminal 1 – Backend API (FastAPI)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
* **Health Check:** `http://localhost:8000/api/health`
* **Swagger Docs:** `http://localhost:8000/docs`

#### Terminal 2 – Web App (React + Vite)
```powershell
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```
* **Web App:** `http://localhost:5173`

#### Terminal 3 – Mobile App (Android Studio Standalone or Metro Dev)

* **Standalone / Without USB (`mobile/.env`):** Copy `mobile/.env.example` to `mobile/.env` and set `EXPO_PUBLIC_API_URL=http://<PC_LAN_IP>:8000` so installed APKs connect over Wi-Fi without needing USB `adb reverse`.
* **Running from Android Studio (Standalone by Default):**
  1. Open **`mobile/android`** (not the repo root) in Android Studio and wait for Gradle Sync to finish.
  2. Connect your phone via USB (with **USB Debugging** enabled) and select it in Android Studio's device dropdown.
  3. Click **Run (`▶`)** (`app` configuration). `pcos360.standaloneDebug=true` in `mobile/android/gradle.properties` embeds `index.android.bundle` directly into the APK (`debug` or `release`), so after installation you can unplug the USB cable and run the app normally without Metro.
  4. Ensure the FastAPI backend is running (`--host 0.0.0.0 --port 8000`) on the same Wi-Fi network, or tap **Configure Server URL** on the Welcome/Settings screen to update the IP.
* **Live Metro Hot-Reload Mode (Optional):** Set `pcos360.standaloneDebug=false` in `mobile/android/gradle.properties`, then run:
  ```powershell
  cd mobile
  npm install
  npx expo start --clear
  ```
* Both Web and Mobile start on the Sign In / Registration gate for real user accounts and isolate Sample Demo Mode cleanly in local memory/storage without writing demo edits to any user account.

---

## 🧪 Authenticated API Endpoints

All health endpoints require an `Authorization: Bearer <token>` header issued by `/api/auth/register` or `/api/auth/login`. The backend always derives `user_id` from the verified session token and rejects client-supplied `user_id` fields (`422`).

| Resource | Method | Path | Auth | Description |
| :--- | :---: | :--- | :---: | :--- |
| **Health & DB** | `GET` | `/api/health` | Public | Service status and database connectivity |
| **Auth** | `POST` | `/api/auth/register` | Public | Register user account & issue session token (IP rate-limited) |
| | `POST` | `/api/auth/login` | Public | Authenticate password & issue session token (brute-force `429` rate-limited) |
| | `POST` | `/api/auth/logout` | Bearer | Revoke current `user_sessions` row |
| | `GET` | `/api/auth/me` | Bearer | Current authenticated user record |
| | `PUT` | `/api/auth/me` | Bearer | Update authenticated user's full name |
| **Health Profile** | `POST` | `/api/profile/` | Bearer | Initialize authenticated user's profile |
| | `GET` | `/api/profile/me` | Bearer | Retrieve authenticated user's profile |
| | `PUT` | `/api/profile/me` | Bearer | Update age, metrics, conditions, medications |
| **Menstrual Cycles** | `POST` | `/api/cycles/` | Bearer | Log cycle record for authenticated user |
| | `GET` | `/api/cycles/` | Bearer | List authenticated user's cycle history |
| | `DELETE`| `/api/cycles/{cycle_id}` | Bearer | Delete cycle owned by authenticated user |
| **Daily Symptoms** | `POST` | `/api/symptoms/` | Bearer | Log daily symptoms for authenticated user |
| | `GET` | `/api/symptoms/` | Bearer | List authenticated user's symptom logs |
| | `PUT` | `/api/symptoms/{symptom_id}` | Bearer | Update symptom entry owned by user |
| | `DELETE`| `/api/symptoms/{symptom_id}` | Bearer | Delete symptom entry owned by user |
| **Lifestyle Logs** | `POST` | `/api/lifestyle/` | Bearer | Log sleep, stress, water, exercise |
| | `GET` | `/api/lifestyle/` | Bearer | List authenticated user's lifestyle logs |
| **Lab Reports** | `POST` | `/api/lab-reports/` | Bearer | Save verified numeric biomarker record |
| | `GET` | `/api/lab-reports/` | Bearer | List authenticated user's lab biomarkers |
| | `DELETE`| `/api/lab-reports/{report_id}` | Bearer | Delete biomarker record owned by user |
| **Clinical Records**| `POST` | `/api/clinical-records/` | Bearer | Save androgen / AMH / ultrasound findings |
| | `GET` | `/api/clinical-records/` | Bearer | List authenticated user's clinical records |

---

## ⚠️ Security, Privacy & Pre-Production Gaps

While PCOS360 enforces per-account authentication, password hashing (`scrypt`), revocable server sessions, sliding-window rate limiting on `/api/auth/login` and `/api/auth/register` (`429 Too Many Requests` + `Retry-After`), and strict user data isolation in local development, **it is NOT ready for public production or regulated healthcare deployment** until the following prioritized gaps are addressed:

1. **Transport Security (HTTPS/TLS):** Local dev uses plain HTTP (and `usesCleartextTraffic` in Android debug manifests). Production deployments must terminate TLS/HTTPS everywhere and disable Android cleartext traffic in release builds.
2. **Token Storage Hardening:** Web currently stores bearer tokens in `localStorage` and mobile stores them in `AsyncStorage`. Production deployments should move web sessions to `HttpOnly; Secure; SameSite` cookies (with CSRF protection) and mobile tokens to hardware-backed `expo-secure-store`.
3. **Account Lifecycle Flows:** Email verification, password reset/rotation, active session list management ("sign out all devices"), and full GDPR/HIPAA account deletion workflows are not yet implemented.
4. **Rate Limiting Scale-Out:** Auth throttling currently uses an in-memory per-process sliding window (`backend/app/core/rate_limit.py`); multi-worker production deployments must back this with a shared store such as Redis and set `TRUST_PROXY_HEADERS=true` only behind a trusted reverse proxy.
5. **Secrets, CORS & Startup Config:** Production must set `ENVIRONMENT="production"` with a strong externally managed `SECRET_KEY`, restrict `BACKEND_CORS_ORIGINS` strictly to production origins, enforce PostgreSQL (`postgresql+psycopg://...?sslmode=require`) rather than SQLite, and prune expired `user_sessions` periodically.
6. **Real Server-Side Lab OCR, Encryption at Rest & Compliance:** Sensitive health data is not field-encrypted at rest yet, nor are HIPAA/GDPR audit logs or server-side PDF/image OCR parsing implemented (web and mobile lab decoders load editable/sample preview values only; all biomarker summaries are strictly **informational and not diagnostic**).
