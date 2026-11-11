// PCOS360 Initial Realistic Healthcare Demo Data

export const initialProfile = {
  name: "Ananya Sharma",
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
  { month: "Aug", fatigue: 7, acne: 6, bloating: 5, mood: 6, sleepHours: 6.1, stress: 7 },
  { month: "Sep", fatigue: 8, acne: 7, bloating: 6, mood: 7, sleepHours: 5.8, stress: 8 },
  { month: "Oct", fatigue: 6, acne: 5, bloating: 7, mood: 5, sleepHours: 6.5, stress: 6 },
  { month: "Nov", fatigue: 7, acne: 6, bloating: 5, mood: 6, sleepHours: 6.2, stress: 7 },
  { month: "Dec", fatigue: 5, acne: 4, bloating: 4, mood: 4, sleepHours: 7.2, stress: 5 },
  { month: "Jan", fatigue: 4, acne: 3, bloating: 4, mood: 3, sleepHours: 7.5, stress: 4 },
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
    filename: "Report_Jan2025_Metabolic_Panel.pdf",
    labName: "Apex Diagnostic Laboratories",
    date: "2025-01-26",
    status: "Analyzed",
    verified: true,
    tests: [
      { name: "Fasting Blood Glucose", value: 96, unit: "mg/dL", normalRange: "70 - 99", status: "Normal", interpretation: "Informational (not diagnostic): Within reference fasting limits." },
      { name: "HbA1c (Glycated Hemoglobin)", value: 5.8, unit: "%", normalRange: "< 5.7", status: "Borderline", interpretation: "Informational (not diagnostic): Slightly above <5.7% reference cutoff. Discuss metabolic testing with your clinician." },
      { name: "Fasting Insulin", value: 14.2, unit: "μIU/mL", normalRange: "< 10.0 (Optimal)", status: "Borderline", interpretation: "Informational (not diagnostic): Above <10.0 μIU/mL reference cutoff; discuss with your clinician." },
      { name: "Total Cholesterol", value: 204, unit: "mg/dL", normalRange: "< 200", status: "Borderline", interpretation: "Informational (not diagnostic): Slightly above <200 mg/dL reference range." },
      { name: "LDL Cholesterol", value: 118, unit: "mg/dL", normalRange: "< 100", status: "Borderline", interpretation: "Informational (not diagnostic): Above <100 mg/dL reference target; review lipid panel with your doctor." },
      { name: "HDL Cholesterol", value: 48, unit: "mg/dL", normalRange: "> 50", status: "Borderline", interpretation: "Informational (not diagnostic): Below >50 mg/dL reference threshold." },
      { name: "Triglycerides", value: 165, unit: "mg/dL", normalRange: "< 150", status: "Borderline", interpretation: "Informational (not diagnostic): Above <150 mg/dL reference limit." },
      { name: "LH / FSH Ratio", value: 2.3, unit: "Ratio", normalRange: "1.0 - 1.5", status: "Elevated", interpretation: "Informational (not diagnostic): Above 1.0 - 1.5 reference ratio; interpret alongside clinical evaluation." },
      { name: "Total Testosterone", value: 52, unit: "ng/dL", normalRange: "15 - 45", status: "Elevated", interpretation: "Informational (not diagnostic): Above 15 - 45 ng/dL reference range; discuss with your clinician." },
      { name: "TSH (Thyroid Stimulating Hormone)", value: 2.1, unit: "mIU/L", normalRange: "0.4 - 4.0", status: "Normal", interpretation: "Informational (not diagnostic): Within reference range." },
      { name: "25-OH Vitamin D", value: 24, unit: "ng/mL", normalRange: "30 - 100", status: "Low", interpretation: "Informational (not diagnostic): Below 30 - 100 ng/mL reference range." }
    ]
  },
  {
    id: "rep-jul2024",
    filename: "Report_Jul2024_Hormone_Workup.pdf",
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
    title: "Metabolic Check-up Review Due",
    description: "Your latest HbA1c is 5.8% (borderline). It has been 6 months since your last formal fasting insulin assessment.",
    actionLabel: "Add New Lab Report",
    route: "lab-reports",
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
    title: "Follow-up Consultation Due",
    description: "No gynecologist or endocrinologist visit has been recorded in the last 4 months. Standard PCOS monitoring guidelines suggest biannual visits.",
    actionLabel: "Prepare Consultation",
    route: "consultation-copilot",
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
    description: "You haven't logged daily symptoms for 3 consecutive days. Consistent logs improve AI pattern detection accuracy.",
    actionLabel: "Log Today's Symptoms",
    route: "health-tracker",
    dueText: "Today",
    suggestedQuestions: []
  },
  {
    id: "gap-4",
    category: "Diagnostic",
    severity: "Low",
    title: "Pelvic Ultrasound Report Missing",
    description: "Rotterdam diagnostic criteria evaluation requires imaging verification of ovarian morphology. Your profile currently lacks an ultrasound record.",
    actionLabel: "Upload Imaging Notes",
    route: "clinical-explorer",
    dueText: "Optional clinical info",
    suggestedQuestions: [
      "Is an ultrasound required for my PCOS phenotype monitoring?"
    ]
  }
];

export const initialTimeline = [
  {
    id: "t-1",
    date: "2025-01-26",
    category: "lab",
    title: "Lab Report Analyzed",
    description: "Apex Diagnostic: HbA1c 5.8%, Fasting Glucose 96 mg/dL, Total Cholesterol 204 mg/dL.",
    badge: "Lab Results",
    badgeColor: "purple"
  },
  {
    id: "t-2",
    date: "2025-01-10",
    category: "cycle",
    title: "Cycle Day 1 – Menstrual Flow Began",
    description: "Cycle length: 35 days. Flow lasted 6 days. Moderate cramps logged on Day 1 & 2.",
    badge: "Menstrual Cycle",
    badgeColor: "pink"
  },
  {
    id: "t-3",
    date: "2024-12-22",
    category: "symptom",
    title: "Increased Fatigue & Flare-up Logged",
    description: "Fatigue severity rated 8/10. Sleep averaged 5.4 hrs during work deadline period.",
    badge: "Symptom Flare",
    badgeColor: "amber"
  },
  {
    id: "t-4",
    date: "2024-11-15",
    category: "lifestyle",
    title: "Started 40:1 Inositol Supplementation",
    description: "Initiated daily 2000mg Myo-Inositol + 50mg D-Chiro Inositol as recommended by physician.",
    badge: "Supplement",
    badgeColor: "teal"
  },
  {
    id: "t-5",
    date: "2024-10-04",
    category: "consultation",
    title: "Consultation with Dr. Meera Rao (Gynecology)",
    description: "Discussed oligomenorrhea and acne flare-ups. Advised lifestyle modifications and hormone restest.",
    badge: "Doctor Visit",
    badgeColor: "blue"
  },
  {
    id: "t-6",
    date: "2023-04-18",
    category: "clinical",
    title: "Initial PCOS Diagnosis Confirmed",
    description: "Diagnosed under Rotterdam consensus based on clinical hyperandrogenism and irregular menstrual intervals.",
    badge: "Milestone",
    badgeColor: "purple"
  }
];

export const initialAIInsights = [
  {
    id: "ai-1",
    module: "PCOSCOPE",
    title: "Sleep Quality Significantly Impacts Morning Energy & Cravings",
    summary: "When you sleep under 6.5 hours, your reported cravings for carbohydrates increase by 62% the following day.",
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
