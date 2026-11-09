# PCOS360 – AI-Powered PCOS Health Intelligence Platform

> **Beyond Symptoms. Understand Your PCOS.**

PCOS360 is a modern, responsive healthcare web application designed to help women understand and manage PCOS/PCOD through personalized health insights, multi-variable symptom correlation, metabolic health monitoring, explainable clinical intelligence, and doctor consultation preparation.

---

## 🌸 Design Philosophy & Aesthetic

- **Primary**: Deep lavender purple (`#7950A8`)
- **Secondary**: Soft lavender (`#EDE5F7` / `#F6F2FA`)
- **Background**: Off-white (`#FAF9FC`)
- **Cards**: Pure white (`#FFFFFF`)
- **Accent**: Muted pink (`#E8B8D0`)
- **Text**: Dark charcoal (`#292431`)
- **Secondary text**: Grey (`#77717F`)
- **Soft Shadows & Borders**: Subtle borders (`#EFEAF4`), gentle rounded corners (`rounded-2xl` & `rounded-3xl`).
- **Ethical Guardrails**: Every intelligence module features clear, standardized clinical disclosures separating statistical association from medical conclusions, with strict avoidance of unsupported disease-risk claims.

---

## 🚀 Key Modules & Implemented Screens

1. **Screen 1: Welcome & Authentication Modal**
   - Brand logo with butterfly motif, tagline, email/password login and registration options.
   - One-click **"Continue as Ananya (Demo User)"** button for instant access.

2. **Screen 2: Multi-Step Health Profile Setup**
   - Multi-step onboarding with progress indicator.
   - Captures age, height, weight (calculates BMI), PCOS diagnosis status, diagnosis year, existing conditions, and medications.

3. **Screen 3: Clinical Dashboard (Overview)**
   - Personalized greeting for Ananya Sharma.
   - Cycle progress card (Day 18 of 35 • Luteal Phase) with visual progress bar and phase guide.
   - Quick access to the 4 core intelligence modules.
   - Latest AI insights with explainability triggers.
   - Care Gap alert cards and recent health activity stream.

4. **Screen 4: PCOSCOPE – Personal Pattern Discovery**
   - Multi-tab analysis: *Overview*, *Correlations*, and *Trends*.
   - Key observed pattern insights (Sleep vs. Fatigue, Stress vs. Cycle delays, Inositol adherence).
   - 6-month interactive symptom trend charts using Recharts.
   - Pearson correlation coefficient matrix.

5. **Screen 5: Metabolic Health – PCOS PREDICT**
   - Fasting glucose, HbA1c (5.8% borderline), fasting insulin (14.2 μIU/mL), and lipid profile tracking.
   - 15-month longitudinal trend line chart across verified lab draws.
   - Interactive HOMA-IR (Homeostatic Model Assessment of Insulin Resistance) calculator.
   - Results requiring medical discussion highlighted for doctor visits.

6. **Screen 6: Clinical Explorer – PCOS GENOME**
   - Rotterdam diagnostic pillars (Ovulatory Dysfunction, Hyperandrogenism, Polycystic Ovarian Morphology).
   - Available vs. missing clinical evidence indicator.
   - Exploration of 4 consensus phenotypes:
     - **Phenotype A** (Classic / Complete)
     - **Phenotype B** (Classic Non-PCOM)
     - **Phenotype C** (Ovulatory PCOS)
     - **Phenotype D** (Normoandrogenic PCOS)
   - Interactive Radar comparison chart comparing user data against phenotype patterns.

7. **Screen 7: PCOS EXPLAIN – Explainable AI**
   - Full transparency into why each insight was generated.
   - Contributing factor weights and direction (+/-).
   - Model confidence / uncertainty percentages.
   - Missing data points required for full clinical certainty.

8. **Screen 8: AI Lab Report Decoder**
   - Drag-and-drop file upload for PDF, JPG, and PNG blood work.
   - Realistic multi-stage extraction simulation (document parse, biomarker detection, reference range calibration).
   - Interactive verification table allowing users to correct extracted values.
   - Plain-English medical interpretations of lab tests.

9. **Screen 9: PCOS What-If Lifestyle Simulator**
   - Interactive sliders and toggles for Sleep (7-8.5 hrs), Physical Activity (30-45 min), Balanced Meal routines, and Stress regulation.
   - Real-time calculated Routine Resilience & Habit Score (0-100).
   - Projected behavioral benefits (reduced energy dips, faster sleep latency).
   - Reassuring ethical guardrails clarifying habit projections vs. medical cures.

10. **Screen 10: Consultation Copilot**
    - Doctor visit packet generator.
    - Checklists: Health summary, 90-day symptom timeline, lab highlights, and prioritized doctor discussion questions.
    - Doctor selector (Gynecologist, Endocrinologist, Nutritionist).
    - Custom question builder.
    - Print-ready and downloadable PDF consultation summary.

11. **Screen 11: PCOS Myth Buster & Learning Hub**
    - Searchable database of common PCOS claims.
    - Clear **Fact / Myth / Misleading** classification badges.
    - Empathetic medical explanations citing international guidelines (Monash 2023, ACOG, Endocrine Society).
    - Category filters (Fertility, Weight, Nutrition, Medical Treatments, Exercise).

12. **Screen 12: My Health Timeline**
    - Longitudinal chronological stream of cycle start dates, lab analyses, symptom flares, and consultations.
    - Filterable by category (All, Symptoms, Cycle, Lab, Consultation).
    - Interactive "Add Health Milestone" form.

13. **Screen 13: Care Gap Detector**
    - Identifies overdue metabolic check-ups, follow-up consultations, symptom logging gaps, and missing imaging records.
    - Direct action buttons that link to relevant modules.

14. **Screen 14: Daily Health Tracker**
    - Quick-log modal to record sleep duration, stress rating (1-5), symptom tags, water intake, and inositol/medication adherence.
    - Updates dashboard metrics, recent activity, and timeline in real-time.

15. **Screen 15: Settings & Profile**
    - Editable profile metrics, diagnosis info, and medications.
    - JSON data export for complete patient health data autonomy.
    - Reset to demo data button.

16. **Interactive Mobile Frame Simulator View**
    - Toggle between spacious **Desktop SaaS View** and **Mobile Preview View** right from the top navigation bar!
    - The Mobile Preview accurately replicates the mobile layout and bottom navigation bar seen in the reference mockups.

---

## 🛠️ Technology Stack

### Frontend
- **React.js 19** with Vite
- **Tailwind CSS v4** with `@tailwindcss/vite`
- **Lucide React** for clean outline icons
- **Recharts** for interactive charts (Line, Area, Radar)
- **Local State & Storage Persistence** (`HealthContext`)

### Backend (Integration-Ready)
- **Python FastAPI**
- **SQLAlchemy 2.0 ORM**
- **PostgreSQL / SQLite** dual-mode engine
- **Pydantic v2** validation schemas

---

## 💻 Running the Application

### 1. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run Backend (Optional)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
FastAPI server will be available at [http://localhost:8000](http://localhost:8000) with interactive Swagger documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🛡️ Clinical & Ethical Compliance
PCOS360 complies with modern healthcare design standards:
- Clear separation between statistical correlation and biological causation.
- Zero black-box AI: explicit feature weights and model confidence ratings.
- Reassuring language designed to alleviate health anxiety and empower patient-doctor collaboration.
