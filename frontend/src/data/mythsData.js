// PCOS Myth Buster Evidence-Based Knowledge Base

export const mythsData = [
  {
    id: "myth-1",
    question: "PCOS means I can't get pregnant?",
    claim: "Women with PCOS are completely infertile and cannot conceive.",
    classification: "Myth", // "Fact", "Myth", "Misleading"
    verdictShort: "No, PCOS does not mean you cannot get pregnant.",
    explanation: "While PCOS is the leading cause of ovulatory subfertility because ovulation may occur irregularly or infrequently, most women with PCOS can and do conceive naturally or with straightforward medical assistance (such as lifestyle adjustments, ovulation induction medications like Letrozole, or inositol therapy). PCOS is a condition of subfertility, not irreversible sterility.",
    citation: "ACOG Practice Bulletin No. 194: Polycystic Ovary Syndrome; Monash International Evidence-Based Guideline (2023).",
    category: "Fertility",
    tags: ["Pregnancy", "Ovulation", "Subfertility"]
  },
  {
    id: "myth-2",
    question: "You must be overweight or gain weight to have PCOS?",
    claim: "Thin or normal-weight women cannot have PCOS.",
    classification: "Myth",
    verdictShort: "False. Lean PCOS affects up to 20–30% of diagnosed women.",
    explanation: "PCOS affects individuals across all body types. 'Lean PCOS' is well documented in medical literature. Women with lean PCOS often exhibit insulin resistance, elevated luteinizing hormone (LH), and biochemical hyperandrogenism despite having a normal Body Mass Index (BMI). BMI alone cannot rule out or diagnose PCOS.",
    citation: "Endocrine Society Clinical Practice Guideline on PCOS; Legro et al., J Clin Endocrinol Metab.",
    category: "Weight & Body Composition",
    tags: ["Lean PCOS", "BMI", "Metabolism"]
  },
  {
    id: "myth-3",
    question: "Birth control pills are the only treatment for PCOS?",
    claim: "Oral contraceptive pills are the sole and mandatory treatment for all PCOS patients.",
    classification: "Misleading",
    verdictShort: "Misleading. Birth control manages symptoms but is not the sole or curative option.",
    explanation: "Oral contraceptives help regulate withdrawal bleeds, reduce endometrial cancer risk from chronic anovulation, and decrease androgen production. However, they do not resolve underlying metabolic issues like insulin resistance. First-line international guidelines emphasize lifestyle interventions (balanced nutrition, strength training, stress management), and alternative options like inositol, metformin, or progestin therapy.",
    citation: "International Evidence-based Guideline for the Assessment and Management of Polycystic Ovary Syndrome (2023).",
    category: "Medical Treatments",
    tags: ["Birth Control", "Hormone Therapy", "Treatment Options"]
  },
  {
    id: "myth-4",
    question: "Cutting out all gluten and dairy cures PCOS?",
    claim: "Every woman with PCOS must strictly eliminate all gluten and dairy products.",
    classification: "Myth",
    verdictShort: "No clinical evidence supports universal gluten or dairy elimination.",
    explanation: "There is no robust clinical evidence showing that women with PCOS universally benefit from eliminating gluten or dairy unless they have celiac disease, gluten sensitivity, or lactose intolerance. Whole grains provide beneficial fiber that regulates blood glucose spikes, and fermented dairy like Greek yogurt offers probiotics and protein. Individual intolerances vary, but blanket elimination is unnecessary and can cause nutritional deficits.",
    citation: "Academy of Nutrition and Dietetics: Nutritional Guidance in PCOS Management; Moran et al., Human Reproduction Update.",
    category: "Nutrition",
    tags: ["Diet", "Gluten", "Dairy", "Inflammation"]
  },
  {
    id: "myth-5",
    question: "Having cysts on ovaries is required for diagnosis?",
    claim: "You cannot be diagnosed with PCOS if your ovaries do not have visible cysts.",
    classification: "Myth",
    verdictShort: "Cysts are neither required nor are they true cysts.",
    explanation: "Under the international Rotterdam criteria, a diagnosis requires at least 2 of 3 features: (1) irregular or absent ovulation, (2) hyperandrogenism (clinical or biochemical), and (3) polycystic ovarian morphology (PCOM) on ultrasound. Therefore, a woman can have PCOS without ovarian polycystic appearance (e.g. Rotterdam Phenotype B). Furthermore, the 'cysts' seen are not cysts; they are immature, harmless follicles arrested in development.",
    citation: "Rotterdam ESHRE/ASRM-Sponsored PCOS Consensus Workshop Group; Monash 2023 Guidelines.",
    category: "Diagnosis",
    tags: ["Ultrasound", "Follicles", "Rotterdam Criteria"]
  },
  {
    id: "myth-6",
    question: "Insulin resistance is present in most women with PCOS?",
    claim: "Up to 70–80% of women with PCOS have underlying insulin resistance.",
    classification: "Fact",
    verdictShort: "Fact. Insulin resistance is a central pathophysiological driver of PCOS.",
    explanation: "Insulin resistance occurs in approximately 75% of lean women and up to 90% of women with higher BMI who have PCOS. Excess circulating insulin stimulates ovarian theca cells to produce excess androgens (testosterone) and suppresses sex hormone-binding globulin (SHBG) production by the liver, worsening symptoms.",
    citation: "Stepto et al., Clin Endocrinol; Dunaif A., Endocrine Reviews.",
    category: "Metabolism",
    tags: ["Insulin Resistance", "Hormones", "Pathophysiology"]
  },
  {
    id: "myth-7",
    question: "Intense HIIT workouts are bad for all women with PCOS?",
    claim: "Any high-intensity workout destroys cortisol and worsens PCOS symptoms.",
    classification: "Misleading",
    verdictShort: "Nuanced. High intensity requires individual tolerance and adequate recovery.",
    explanation: "While chronic overtraining without recovery can elevate cortisol, clinical trials demonstrate that moderate-to-high intensity interval training improves insulin sensitivity, cardiorespiratory fitness, and visceral fat reduction in many women with PCOS. The best exercise is consistent, enjoyable, and includes resistance training combined with low-impact walking and stress-moderating activities.",
    citation: "Patten et al., Sports Medicine (2020): Exercise interventions in polycystic ovary syndrome.",
    category: "Exercise & Lifestyle",
    tags: ["Exercise", "Cortisol", "Strength Training"]
  },
  {
    id: "myth-8",
    question: "PCOS is a lifelong, unmanageable condition?",
    claim: "Once diagnosed, symptoms are progressive and cannot be reversed or managed.",
    classification: "Myth",
    verdictShort: "PCOS is manageable, and symptoms can achieve lasting remission.",
    explanation: "While PCOS has a genetic and epigenetic basis, its symptoms and metabolic manifestations are highly responsive to holistic management. Many women achieve regular menstrual cycles, clear skin, restored ovulation, and healthy pregnancies through tailored nutritional routines, targeted supplementation (e.g., inositol), and clinical care.",
    citation: "Teede et al., Lancet Diabetes & Endocrinology (2023).",
    category: "Prognosis",
    tags: ["Long-term Health", "Remission", "Wellness"]
  }
];
