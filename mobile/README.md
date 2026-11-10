# PCOS360 Native Android Mobile Application

AI-Powered Women's PCOS Health Intelligence Platform – Native Android Mobile App built with **React Native & Expo (JavaScript)**.

---

## 📱 Mobile Screens Architecture (10 Mockup Screens)

This application matches the PCOS360 visual identity and the 10 mobile mockup screens:

1. **Screen 1: Welcome & Onboarding** (`src/screens/auth/WelcomeScreen.js`)
   - PCOS360 butterfly logo, tagline *"Beyond Symptoms"*, silhouette illustration, *"Get Started →"* action.
2. **Screen 2: Tell Us About You** (`src/screens/auth/OnboardingScreen.js`)
   - 4-step progress indicator, Age (23), Height & Weight (160 cm • 65 kg), PCOS Status pill (*Diagnosed*), Diagnosis Year (2023), *"Continue"* button.
3. **Screen 3: Health Overview / Dashboard** (`src/screens/main/DashboardScreen.js`)
   - Greeting (*"Hi, Ananya 👋"*), Cycle Progress Card (*"Day 18 of 35"*), 2x2 Quick Action grid (*PCOSCOPE*, *Metabolic Health*, *Clinical Explorer*, *AI Assistant*), 4-tab bottom navigation bar.
4. **Screen 4: PCOSCOPE Pattern Insights** (`src/screens/main/PcoscopeScreen.js`)
   - Segmented tabs (*Overview*, *Correlations*, *Trends*), Key Insights lightbulb card, 3-Month Symptom Trend area chart with purple gradient.
5. **Screen 5: Lab Report Decoder** (`src/screens/features/LabDecoderScreen.js`)
   - Dashed upload box (`expo-document-picker`), Latest Analysis card (*Report_Jan2025.pdf* with verified badge), Highlighted biomarker (*HbA1c: 5.8% Borderline*).
6. **Screen 6: What-If Simulator** (`src/screens/features/WhatIfScreen.js`)
   - Lifestyle change toggles (*Improve Sleep 7–8 hrs*, *Add Regular Exercise 30–45 min/day*, *Balanced Meal Plan*), *"Simulate Changes"* button, projected metabolic and symptom impact.
7. **Screen 7: Consultation Copilot** (`src/screens/features/CopilotScreen.js`)
   - Doctor visit prep checklist, clipboard illustration, *"Download Report"* button generating a clean native PDF via `expo-print` & `expo-sharing`.
8. **Screen 8: PCOS Myth Buster** (`src/screens/main/LearningHubScreen.js`)
   - Real-time search bar, verified *Fact* cards with green badges, clinical explanations, floral illustration footer.
9. **Screen 9: My Health Timeline** (`src/screens/features/TimelineScreen.js`)
   - Category filter pills (*All*, *Symptoms*, *Cycle*, *Lab*), vertical timeline tree with cards.
10. **Screen 10: Care Gap Detector** (`src/screens/features/CareGapsScreen.js`)
    - Proactive care gaps (*Metabolic Check-up Due*, *Follow-up Consultation*, *Symptom Logging Gap*) with direct action buttons.

---

## 🎨 Color System & Tokens

- **Primary Purple:** `#7950A8`
- **Soft Lavender:** `#EDE5F7`
- **Background:** `#FAF9FC`
- **Card Surface:** `#FFFFFF`
- **Accent Pink:** `#E8B8D0`
- **Text Primary:** `#292431`
- **Text Secondary:** `#77717F`
- **Borders:** `#EFEAF4`

---

## 🚀 How to Run the Mobile App

### 1. Start the FastAPI Backend
Ensure the FastAPI server is running on port 8000:
```bash
cd backend
.\venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Start Expo Metro Bundler
```bash
cd mobile
npx expo start
```

### 3. Open on Android Device
- **On Android Emulator:** Press `a` in the terminal to launch on the running emulator. The app automatically connects to `http://10.0.2.2:8000`.
- **On Physical Android Phone (Expo Go):**
  1. Install **Expo Go** from Google Play Store.
  2. Scan the terminal QR code with Expo Go.
  3. In the app, open **Settings** and set your machine's local Wi-Fi IP (e.g., `http://192.168.1.X:8000`).

