// PCOS GENOME – Rotterdam Consensus Phenotype Data & Clinical Explorer - Mobile
export const rotterdamFeatures = [
  {
    id: "ovulatory_dysfunction",
    name: "Ovulatory Dysfunction (OD)",
    code: "OD",
    description: "Oligomenorrhea (cycle interval > 35 days or < 8 cycles/year) or amenorrhea (absence of periods for 3+ consecutive months).",
    diagnosticImportance: "Core diagnostic pillar indicating anovulatory or irregular follicular development.",
    userStatus: "Present",
    confidence: "High (Recorded via 4 cycle logs)",
  },
  {
    id: "hyperandrogenism",
    name: "Hyperandrogenism (HA)",
    code: "HA",
    description: "Clinical signs (hirsutism, persistent adult cystic acne, androgenic alopecia) or biochemical excess (elevated total or free testosterone, DHEA-S, or Free Androgen Index).",
    diagnosticImportance: "Primary hormonal driver of cutaneous manifestations and follicular maturation arrest.",
    userStatus: "Present",
    confidence: "High (Lab verified + clinical symptoms)",
  },
  {
    id: "polycystic_ovaries",
    name: "Polycystic Ovarian Morphology (PCOM)",
    code: "PCOM",
    description: "Transvaginal ultrasound showing ≥ 20 follicles (2-9 mm) per ovary and/or ovarian volume ≥ 10 mL in either ovary (or AMH surrogate under 2023 international guidelines).",
    diagnosticImportance: "Morphological marker reflecting multiple arrested antral follicles.",
    userStatus: "Pending / Missing",
    confidence: "Data Missing (Ultrasound required for confirmation)",
  }
];

export const phenotypesList = [
  {
    id: "phenotype-a",
    name: "Phenotype A (Classic / Complete)",
    code: "A",
    subtitle: "HA + OD + PCOM (All 3 Criteria Present)",
    prevalence: "~45–60% of clinical PCOS cohorts",
    description: "Characterized by all three diagnostic criteria: hyperandrogenism, chronic anovulation or oligomenorrhea, and polycystic ovarian appearance on pelvic ultrasound.",
    metabolicRisk: "Highest metabolic association (significant insulin resistance, dyslipidemia, metabolic syndrome risk).",
    hormonePattern: "Highest elevated LH:FSH ratio, highest circulating free testosterone, frequently accompanied by hyperinsulinemia.",
    managementFocus: "Dual focus on restoring ovulatory regularity and proactive metabolic protection (metformin/inositol, cardiovascular lipid monitoring, low-glycemic dietary planning).",
    featuresMatch: {
      ha: true,
      od: true,
      pcom: true
    },
    radarMetrics: {
      androgenExcess: 90,
      ovulatoryIrregularity: 85,
      metabolicSensitivity: 85,
      follicularDensity: 90,
      symptomVariability: 70
    }
  },
  {
    id: "phenotype-b",
    name: "Phenotype B (Classic Non-PCOM)",
    code: "B",
    subtitle: "HA + OD (Hyperandrogenism + Ovulatory Dysfunction)",
    prevalence: "~15–20% of clinical PCOS cohorts",
    description: "Presents with clinical or biochemical excess of androgens and irregular menstrual cycles, without meeting the strict ultrasound threshold for polycystic ovarian morphology.",
    metabolicRisk: "Moderate to high metabolic risk; similar insulin resistance profiles to Phenotype A.",
    hormonePattern: "Elevated androgens, disturbed LH pulsatility, moderate endocrine imbalance.",
    managementFocus: "Anti-androgenic measures (e.g. spironolactone under medical supervision, lifestyle), ovulatory support, and metabolic surveillance.",
    featuresMatch: {
      ha: true,
      od: true,
      pcom: false
    },
    radarMetrics: {
      androgenExcess: 85,
      ovulatoryIrregularity: 80,
      metabolicSensitivity: 75,
      follicularDensity: 40,
      symptomVariability: 65
    }
  },
  {
    id: "phenotype-c",
    name: "Phenotype C (Ovulatory PCOS)",
    code: "C",
    subtitle: "HA + PCOM (Hyperandrogenism + Polycystic Ovaries)",
    prevalence: "~10–15% of clinical PCOS cohorts",
    description: "Women have regular ovulatory cycles (monthly menses) alongside hyperandrogenism and polycystic ovarian morphology. Often diagnosed during dermatology visits for acne or hirsutism.",
    metabolicRisk: "Lower metabolic and cardiovascular risk compared to Phenotypes A and B, though mild insulin resistance may still occur.",
    hormonePattern: "Mild to moderate androgen elevation; luteal phase progesterone levels indicate regular ovulation.",
    managementFocus: "Symptomatic treatment of dermatological complaints (acne, hair thinning, hirsutism), maintenance of lean mass and metabolic monitoring.",
    featuresMatch: {
      ha: true,
      od: false,
      pcom: true
    },
    radarMetrics: {
      androgenExcess: 75,
      ovulatoryIrregularity: 25,
      metabolicSensitivity: 50,
      follicularDensity: 85,
      symptomVariability: 55
    }
  },
  {
    id: "phenotype-d",
    name: "Phenotype D (Normoandrogenic PCOS)",
    code: "D",
    subtitle: "OD + PCOM (Ovulatory Dysfunction + Polycystic Ovaries)",
    prevalence: "~10–15% of clinical PCOS cohorts",
    description: "Features irregular or delayed ovulation combined with polycystic ovaries on ultrasound, but without clinical or biochemical androgen excess.",
    metabolicRisk: "Lowest metabolic burden among the four subtypes; often normal insulin sensitivity and lipid panels.",
    hormonePattern: "Normal testosterone and DHEA-S; mild hypothalamic-pituitary dysregulation or elevated anti-Müllerian hormone (AMH).",
    managementFocus: "Restoring ovulatory cyclicity, optimizing luteal phase support, and rule-out of hypothalamic amenorrhea.",
    featuresMatch: {
      ha: false,
      od: true,
      pcom: true
    },
    radarMetrics: {
      androgenExcess: 25,
      ovulatoryIrregularity: 80,
      metabolicSensitivity: 40,
      follicularDensity: 85,
      symptomVariability: 60
    }
  }
];

export const userClinicalAssessment = {
  currentMatchIndication: "Phenotype B Candidate (Pending Pelvic Ultrasound)",
  confirmedFeatures: ["Ovulatory Dysfunction (OD)", "Hyperandrogenism (HA)"],
  unconfirmedFeatures: ["Polycystic Ovarian Morphology (PCOM)"],
  recommendation: "If an ultrasound confirms polycystic morphology (≥20 follicles or volume ≥10mL), profile would reclassify under Phenotype A. Discuss with your gynecologist.",
  ethicalNotice: "This clinical presentation explorer is for educational, illustrative purposes based on the Rotterdam Consensus criteria. It is NOT a medical diagnosis. Only an authorized healthcare physician can determine your clinical presentation."
};

export default {
  rotterdamFeatures,
  phenotypesList,
  userClinicalAssessment,
};

