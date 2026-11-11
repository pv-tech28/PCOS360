// PCOS360 Initial Realistic Healthcare Demo Data - Mobile
export const initialProfile = {
  name: "Ananya",
  fullName: "Ananya Sharma",
  age: 23,
  heightCm: 160,
  weightKg: 65,
  pcosStatus: "Diagnosed", // "Diagnosed", "Not diagnosed", "Unsure"
  diagnosisYear: 2023,
  medicalConditions: ["Insulin Resistance", "Mild Vitamin D Deficiency"],
  medications: ["Myo-Inositol & D-Chiro Inositol (40:1)", "Vitamin D3 2000 IU", "Omega-3"],
  cycleLengthAvg: 35,
  periodDurationAvg: 6,
  lastPeriodDate: "2025-01-10",
  currentCycleDay: 18,
  cyclePhase: "Luteal Phase",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

export const initialCycleData = {
  currentDay: 18,
  totalDays: 35,
  phase: "Luteal Phase",
  phaseDescription: "Progesterone is typically rising. You might notice subtle energy shifts or mild cravings.",
  nextPeriodEstimated: "2025-01-27",
  ovulationEstimated: "2025-01-17",
  fertileWindow: "2025-01-14 – 2025-01-18",
  history: [
    { cycle: "Oct 2024", length: 38, flowDays: 6, status: "Irregular" },
    { cycle: "Nov 2024", length: 36, flowDays: 6, status: "Improving" },
    { cycle: "Dec 2024", length: 34, flowDays: 5, status: "Regular" },
    { cycle: "Jan 2025", length: 35, flowDays: 6, status: "Current" },
  ]
};

export const initialRecentActivity = [
  { id: 1, type: "log", title: "Logged Daily Symptoms", detail: "Mild fatigue, Bloating (Level 2), Sleep 7.2 hrs", time: "Today, 9:15 AM", icon: "Activity" },
  { id: 2, type: "lab", title: "Lab Report Decoded", detail: "Comprehensive Metabolic & Lipid Panel", time: "26 Jan 2025", icon: "FileText" },
  { id: 3, type: "cycle", title: "Cycle Day 18 Transition", detail: "Entered Mid-Luteal Phase", time: "Yesterday", icon: "Calendar" },
  { id: 4, type: "copilot", title: "Consultation Summary Exported", detail: "Prepared for Dr. Meera Rao (Gynecology)", time: "3 days ago", icon: "Download" },
];

export const initialSymptomTrendData = [
  { month: "Aug", fatigue: 7, acne: 6, bloating: 5, mood: 6, sleepHours: 6.1, stress: 7, value: 5.5 },
  { month: "Sep", fatigue: 8, acne: 7, bloating: 6, mood: 7, sleepHours: 5.8, stress: 8, value: 6.5 },
  { month: "Oct", fatigue: 6, acne: 5, bloating: 7, mood: 5, sleepHours: 6.5, stress: 6, value: 5.0 },
  { month: "Nov", fatigue: 7, acne: 6, bloating: 5, mood: 6, sleepHours: 6.2, stress: 7, value: 5.8 },
  { month: "Dec", fatigue: 5, acne: 4, bloating: 4, mood: 4, sleepHours: 7.2, stress: 5, value: 4.2 },
  { month: "Jan", fatigue: 4, acne: 3, bloating: 4, mood: 3, sleepHours: 7.5, stress: 4, value: 3.8 },
];

export const initialCorrelations = [
  {
    factorA: "Sleep < 6.5 hours",
    factorB: "Fatigue Severity",
    strength: "Strong (+0.78)",
    description: "Days with under 6.5 hours of sleep show a 78% higher frequency of reported severe fatigue and afternoon energy crashes.",
    recommendation: "Prioritize consistent wind-down timing between 10:30 PM - 11:00 PM."
  },
  {
    factorA: "High Stress Logged",
    factorB: "Cycle Length Delays",
    strength: "Moderate (+0.64)",
    description: "Spikes in chronic perceived stress (rating 4-5) coincide with 3 to 5 day cycle delays over the last 4 recorded cycles.",
    recommendation: "Discuss adrenal and cortisol evaluation with your healthcare team."
  },
  {
    factorA: "Refined Carb Days",
    factorB: "Afternoon Brain Fog & Bloating",
    strength: "Moderate (+0.61)",
    description: "Post-meal bloating and lethargy scores rise notably on days when simple carbohydrates are eaten without protein buffering.",
    recommendation: "Pair carbohydrates with dietary fiber and healthy fats."
  }
];

export const initialLabReports = [
  {
    id: "rep-jan2025",
    filename: "Report_Jan2025.pdf",
    displayName: "Report_Jan2025.pdf",
    labName: "Apex Diagnostic Laboratories",
    date: "2025-01-26",
    status: "Analyzed",
    verified: true,
    tests: [
      { name: "Fasting Blood Glucose", value: 96, unit: "mg/dL", normalRange: "70 - 99", status: "Normal", interpretation: "Informational (not diagnostic): Within reference fasting limits." },
      { name: "HbA1c", value: 5.8, unit: "%", normalRange: "< 5.7", status: "Borderline", interpretation: "Informational (not diagnostic): Slightly above reference range. Discuss with your doctor." },
      { name: "Fasting Insulin", value: 14.2, unit: "μIU/mL", normalRange: "< 10.0 (Optimal)", status: "Borderline", interpretation: "Informational (not diagnostic): Above <10.0 μIU/mL reference range; review with your clinician." },
      { name: "Total Cholesterol", value: 204, unit: "mg/dL", normalRange: "< 200", status: "Borderline", interpretation: "Informational (not diagnostic): Above <200 mg/dL reference range." },
      { name: "LDL Cholesterol", value: 118, unit: "mg/dL", normalRange: "< 100", status: "Borderline", interpretation: "Informational (not diagnostic): Above <100 mg/dL reference target." },
      { name: "HDL Cholesterol", value: 48, unit: "mg/dL", normalRange: "> 50", status: "Borderline", interpretation: "Informational (not diagnostic): Below >50 mg/dL reference threshold." },
      { name: "Triglycerides", value: 165, unit: "mg/dL", normalRange: "< 150", status: "Borderline", interpretation: "Informational (not diagnostic): Above <150 mg/dL reference range." },
      { name: "LH / FSH Ratio", value: 2.3, unit: "Ratio", normalRange: "1.0 - 1.5", status: "Elevated", interpretation: "Informational (not diagnostic): Above 1.0 - 1.5 reference ratio." },
      { name: "Total Testosterone", value: 52, unit: "ng/dL", normalRange: "15 - 45", status: "Elevated", interpretation: "Informational (not diagnostic): Above 15 - 45 ng/dL reference range." },
      { name: "TSH (Thyroid Stimulating Hormone)", value: 2.1, unit: "mIU/L", normalRange: "0.4 - 4.0", status: "Normal", interpretation: "Informational (not diagnostic): Within reference range." },
      { name: "25-OH Vitamin D", value: 24, unit: "ng/mL", normalRange: "30 - 100", status: "Low", interpretation: "Informational (not diagnostic): Below 30 - 100 ng/mL reference range." }
    ]
  },
  {
    id: "rep-jul2024",
    filename: "Report_Jul2024_Hormone_Workup.pdf",
    displayName: "Report_Jul2024_Hormone_Workup.pdf",
    labName: "Quest Diagnostics",
    date: "2024-07-15",
    status: "Analyzed",
    verified: true,
    tests: [
      { name: "Fasting Blood Glucose", value: 92, unit: "mg/dL", normalRange: "70 - 99", status: "Normal", interpretation: "Informational (not diagnostic): Within reference fasting limits." },
      { name: "HbA1c", value: 5.6, unit: "%", normalRange: "< 5.7", status: "Normal", interpretation: "Informational (not diagnostic): Within reference range." },
      { name: "Total Cholesterol", value: 192, unit: "mg/dL", normalRange: "< 200", status: "Normal", interpretation: "Informational (not diagnostic): Within reference range." },
      { name: "Total Testosterone", value: 58, unit: "ng/dL", normalRange: "15 - 45", status: "Elevated", interpretation: "Informational (not diagnostic): Above reference range." },
      { name: "LH / FSH Ratio", value: 2.6, unit: "Ratio", normalRange: "1.0 - 1.5", status: "Elevated", interpretation: "Informational (not diagnostic): Above reference ratio." }
    ]
  }
];

export const initialHistoricalMetabolic = [
  { date: "Oct 2023", fastingGlucose: 89, hba1c: 5.4, triglycerides: 138, ldl: 98, hdl: 52 },
  { date: "Feb 2024", fastingGlucose: 91, hba1c: 5.5, triglycerides: 145, ldl: 104, hdl: 50 },
  { date: "Jul 2024", fastingGlucose: 92, hba1c: 5.6, triglycerides: 152, ldl: 110, hdl: 49 },
  { date: "Nov 2024", fastingGlucose: 94, hba1c: 5.7, triglycerides: 158, ldl: 114, hdl: 48 },
  { date: "Jan 2025", fastingGlucose: 96, hba1c: 5.8, triglycerides: 165, ldl: 118, hdl: 48 },
];

export const initialCareGaps = [
  {
    id: "gap-1",
    category: "Metabolic",
    severity: "Medium",
    title: "Metabolic Check-up Due",
    description: "No recent glucose or HbA1c report (> 6 months)",
    actionLabel: "Add Report",
    route: "LabDecoder",
    dueText: "Review within 30 days",
    suggestedQuestions: [
      "Should we test fasting insulin and C-peptide alongside fasting glucose?",
      "Is my current Inositol dosage optimal for supporting glycemic sensitivity?"
    ]
  },
  {
    id: "gap-2",
    category: "Clinical",
    severity: "High",
    title: "Follow-up Consultation",
    description: "No follow-up recorded in last 4 months",
    actionLabel: "Schedule",
    route: "Copilot",
    dueText: "Overdue by 3 weeks",
    suggestedQuestions: [
      "Can we review my cycle regularity trends over the last 90 days?",
      "Would an updated pelvic ultrasound be beneficial to check follicle count?"
    ]
  },
  {
    id: "gap-3",
    category: "Tracking",
    severity: "Low",
    title: "Symptom Logging Gap",
    description: "You haven't logged symptoms for 10+ days",
    actionLabel: "Log Now",
    route: "DailyLogModal",
    dueText: "Today",
    suggestedQuestions: []
  },
  {
    id: "gap-4",
    category: "Diagnostic",
    severity: "Low",
    title: "Pelvic Ultrasound Report Missing",
    description: "Rotterdam diagnostic criteria evaluation requires imaging verification of ovarian morphology.",
    actionLabel: "Upload Imaging",
    route: "ClinicalExplorer",
    dueText: "Optional clinical info",
    suggestedQuestions: [
      "Is an ultrasound required for my PCOS phenotype monitoring?"
    ]
  }
];

export const initialTimeline = [
  {
    id: "t-1",
    date: "Jan 2025",
    category: "lab",
    title: "Lab report added",
    description: "HbA1c: 5.8%, Cholesterol: 210 mg/dL",
    badge: "Lab",
    badgeColor: "#7950A8"
  },
  {
    id: "t-2",
    date: "Dec 2024",
    category: "symptom",
    title: "Increased acne & fatigue",
    description: "Severity: Moderate",
    badge: "Symptoms",
    badgeColor: "#E8B8D0"
  },
  {
    id: "t-3",
    date: "Nov 2024",
    category: "cycle",
    title: "Cycle: 36 days",
    description: "Period duration: 6 days",
    badge: "Cycle",
    badgeColor: "#10B981"
  },
  {
    id: "t-4",
    date: "Oct 2024",
    category: "lifestyle",
    title: "Started Inositol Supplementation",
    description: "Daily 2000mg Myo-Inositol (40:1)",
    badge: "Lifestyle",
    badgeColor: "#F59E0B"
  }
];

export const initialAIInsights = [
  {
    id: "ai-1",
    module: "PCOSCOPE",
    title: "Sleep Quality Significantly Impacts Morning Energy & Cravings",
    summary: "Lower sleep (<6 hrs) is often linked with higher fatigue. When you sleep under 6.5 hours, reported carbohydrate cravings increase by 62%.",
    confidence: "88% Pattern Confidence",
    evidence: "Derived from 45 matched daily sleep logs and dietary cravings entries.",
    actionableTip: "Aim for a consistent 7.5-hour sleep target to support cortisol balance.",
    date: "Today"
  },
  {
    id: "ai-2",
    module: "PCOS PREDICT",
    title: "Borderline HbA1c (5.8%) Signals Insulin Sensitivity Opportunity",
    summary: "Your glycemic indicators are slightly above ideal (<5.7%). Early dietary buffering and resistance training can prevent progression.",
    confidence: "Clinical Reference Match",
    evidence: "Verified against Apex Diagnostics lab results from Jan 26, 2025.",
    actionableTip: "Discuss a fasting insulin test with your endocrinologist during your upcoming follow-up.",
    date: "26 Jan 2025"
  },
  {
    id: "ai-3",
    module: "PCOS GENOME",
    title: "Clinical Profile Aligns Closely with Phenotype B (Non-PCOM)",
    summary: "Documented history of irregular cycles (34-38 days) combined with mild hyperandrogenism (elevated testosterone 52 ng/dL).",
    confidence: "Educational Assessment Only",
    evidence: "Requires pelvic ultrasound confirmation to rule in/out Phenotype A.",
    actionableTip: "Consult your gynecologist to confirm whether an ultrasound is warranted.",
    date: "18 Jan 2025"
  }
];

export default {
  initialProfile,
  initialCycleData,
  initialRecentActivity,
  initialSymptomTrendData,
  initialCorrelations,
  initialLabReports,
  initialHistoricalMetabolic,
  initialCareGaps,
  initialTimeline,
  initialAIInsights,
};

