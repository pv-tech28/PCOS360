# PCOS360 – AI-Powered PCOS Health Intelligence Platform

> **Beyond Symptoms. Understand Your PCOS.**

PCOS360 is a modern, responsive healthcare web application designed to help women understand and manage PCOS/PCOD through personalized health insights, symptom tracking, metabolic monitoring, explainable clinical intelligence, and doctor consultation preparation.

---

## 🏗️ Architecture & Technology Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React, Recharts (`http://localhost:5173`)
* **Backend:** FastAPI, Python 3.13, Uvicorn, Pydantic v2 (`http://localhost:8000`)
* **Database & ORM:** PostgreSQL (`pcos360_db`), SQLAlchemy 2.0, Psycopg 3 (`psycopg[binary]`), SQLite zero-config fallback
* **Database Migrations:** Alembic

---

## 🗄️ PostgreSQL Database Architecture (`pcos360_db`)

The database is structured across seven relational tables with foreign keys (`users.id` cascade delete), indexes, and timezone-aware timestamps:

1. **`users`**
   * `id` (PK, Integer, Auto-increment)
   * `full_name` (VARCHAR 150)
   * `email` (VARCHAR 255, Unique, Indexed)
   * `password_hash` (VARCHAR 255, Nullable, reserved for future authentication)
   * `created_at`, `updated_at` (TIMESTAMPTZ)

2. **`health_profiles`**
   * `id` (PK)
   * `user_id` (FK -> `users.id`, Unique 1-to-1)
   * `age` (Integer), `height` (Float, cm), `weight` (Float, kg)
   * `diagnosis_status` ("Diagnosed" / "Not Diagnosed" / "Unsure")
   * `diagnosis_year` (Integer, Optional)
   * `existing_conditions` (JSON List, Optional)
   * `medications` (JSON List, Optional)
   * `created_at`, `updated_at` (TIMESTAMPTZ)

3. **`menstrual_cycles`**
   * `id` (PK)
   * `user_id` (FK -> `users.id`)
   * `period_start_date` (DATE)
   * `period_end_date` (DATE, Optional)
   * `cycle_length` (Integer, days)
   * `flow_intensity` (VARCHAR 50: Light / Medium / Heavy)
   * `notes` (TEXT, Optional)
   * `created_at` (TIMESTAMPTZ)

4. **`daily_symptoms`**
   * `id` (PK)
   * `user_id` (FK -> `users.id`)
   * `log_date` (DATE, Indexed)
   * `acne_severity`, `hair_loss`, `unwanted_hair_growth` (VARCHAR 50)
   * `fatigue_level`, `bloating`, `pelvic_pain` (Integer 1-10)
   * `mood` (VARCHAR 100), `notes` (TEXT)
   * `created_at` (TIMESTAMPTZ)

5. **`lifestyle_logs`**
   * `id` (PK)
   * `user_id` (FK -> `users.id`)
   * `log_date` (DATE, Indexed)
   * `sleep_hours` (Float), `stress_level` (Integer 1-5), `water_intake` (Float)
   * `exercise_minutes` (Integer), `food_habits` (VARCHAR 150), `meal_regularity` (VARCHAR 50)
   * `created_at` (TIMESTAMPTZ)

6. **`lab_reports`**
   * `id` (PK)
   * `user_id` (FK -> `users.id`)
   * `report_name` (VARCHAR 255), `test_name` (VARCHAR 150), `test_value` (Float)
   * `unit` (VARCHAR 50), `reference_range` (VARCHAR 100), `report_date` (DATE)
   * `created_at` (TIMESTAMPTZ)

7. **`clinical_records`**
   * `id` (PK)
   * `user_id` (FK -> `users.id`)
   * `testosterone`, `free_testosterone`, `dheas`, `amh` (Float, Optional)
   * `ultrasound_findings`, `ovulation_history` (TEXT, Optional)
   * `recorded_at` (TIMESTAMPTZ)

---

## 🛠️ Step-by-Step Setup Guide

### 1. PostgreSQL Installation on Windows (If not already installed)

You have three easy options:

#### Option A: Windows Package Manager (Fastest via PowerShell)
Open PowerShell as Administrator and run:
```powershell
winget install PostgreSQL.PostgreSQL.16
```

#### Option B: Official Graphical Installer
1. Download the Windows installer from [EnterpriseDB PostgreSQL Downloads](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Choose version 16 or 15. Set password for the `postgres` user (e.g. `postgres`).
3. Complete the installation wizard (keep default port `5432`).

#### Option C: Docker (If Docker Desktop is installed)
```powershell
docker run --name pcos360-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=pcos360_db -p 5432:5432 -d postgres:16
```

---

### 2. Create the Database

Open `psql` (or pgAdmin) and run:
```sql
CREATE DATABASE pcos360_db;
```
Verify creation:
```sql
\l
```

---

### 3. Backend Environment Configuration (`backend/.env`)

Configure your connection string in `backend/.env`:
```env
PROJECT_NAME="PCOS360 API"
VERSION="1.0.0"
API_V1_STR="/api"
ENVIRONMENT="development"
DEBUG=true
DEBUG_SQL=false
HOST="0.0.0.0"
PORT=8000

# PostgreSQL Connection String:
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/pcos360_db"

# CORS configuration allowing React dev server:
BACKEND_CORS_ORIGINS='["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]'
```

> **Note:** If PostgreSQL is temporarily stopped or offline during local frontend UI development, PCOS360's database connector automatically falls back to local SQLite (`pcos360.db`) without crashing, and switches to PostgreSQL as soon as the service is available.

---

### 4. Run Alembic Database Migrations

Apply the migration creating all seven database tables:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
alembic upgrade head
```

Optionally seed initial development records (Ananya Sharma profile, cycle logs, lab biomarkers):
```powershell
python seed_data.py
```

---

### 5. Running the Backend & Frontend Simultaneously

#### Terminal 1 – Frontend (React + Vite)
```powershell
cd frontend
npm run dev
```
* **Frontend App:** `http://localhost:5173`

#### Terminal 2 – Backend (FastAPI + PostgreSQL)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```
* **Backend Base:** `http://localhost:8000`
* **Health Check & DB Status:** `http://localhost:8000/api/health`
* **Interactive Swagger UI:** `http://localhost:8000/docs`

---

## 🧪 Verified API Endpoints

All Phase 2 endpoints have been implemented and verified:

| Resource | Method | Path | Description |
| :--- | :---: | :--- | :--- |
| **Health & DB** | `GET` | `/api/health` | Returns service status and PostgreSQL connectivity |
| **Health Profile** | `POST` | `/api/profile/` | Initialize user health profile |
| | `GET` | `/api/profile/{user_id}` | Retrieve profile by user ID |
| | `PUT` | `/api/profile/{user_id}` | Update age, weight, conditions, medications |
| **Menstrual Cycles** | `POST` | `/api/cycles/` | Log cycle start date, flow intensity, notes |
| | `GET` | `/api/cycles/{user_id}` | Retrieve full cycle history |
| | `DELETE`| `/api/cycles/{cycle_id}` | Delete cycle log |
| **Daily Symptoms** | `POST` | `/api/symptoms/` | Log acne, fatigue, pelvic pain, mood, notes |
| | `GET` | `/api/symptoms/{user_id}` | List user's recorded symptoms |
| | `PUT` | `/api/symptoms/{symptom_id}` | Update symptom severity |
| | `DELETE`| `/api/symptoms/{symptom_id}` | Delete symptom entry |
| **Lifestyle Logs** | `POST` | `/api/lifestyle/` | Log sleep hours, stress rating (1-5), water, exercise |
| | `GET` | `/api/lifestyle/{user_id}` | Retrieve longitudinal lifestyle entries |
| **Lab Reports** | `POST` | `/api/lab-reports/` | Save biomarker name, value, unit, reference range |
| | `GET` | `/api/lab-reports/{user_id}` | Retrieve all lab test records |
| | `DELETE`| `/api/lab-reports/{report_id}` | Delete lab record |
| **Clinical Records**| `POST` | `/api/clinical-records/` | Record androgens (testosterone, AMH), ultrasound findings |
| | `GET` | `/api/clinical-records/{user_id}` | Retrieve clinical presentation records |
