import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Database,
  ArrowRight,
  Gauge
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function ExplainPage() {
  const { insights, labReports, setActiveScreen } = useHealth();
  const [selectedInsightId, setSelectedInsightId] = useState('ai-1');

  const explainableItems = [
    {
      id: 'ai-1',
      module: 'PCOSCOPE',
      title: 'Sleep Duration & Afternoon Cravings Correlation',
      summary: 'When sleep falls below 6.5 hours, next-day carbohydrate cravings and fatigue increase by 62%.',
      confidenceScore: 88,
      confidenceLabel: 'High Pattern Reliability',
      dataPointsCount: 45,
      factors: [
        { name: 'Logged sleep hours under 6.5h', weight: 42, direction: 'Positive driver', impact: 'Strongest driver of afternoon energy dips' },
        { name: 'Self-reported energy rating ≤ 4/10', weight: 28, direction: 'Positive driver', impact: 'Consistent co-occurrence in logs' },
        { name: 'Luteal phase hormonal shift (Day 18+)', weight: 18, direction: 'Biological baseline', impact: 'Progesterone naturally raises basal metabolic demand' },
        { name: 'Days with >2.5L water intake', weight: -12, direction: 'Mitigating buffer', impact: 'Hydration mitigated severe brain fog' }
      ],
      missingData: [
        'Continuous glucose monitor (CGM) interstitial data',
        'Morning salivary cortisol curve'
      ],
      clinicalLogic: 'Insufficient rapid eye movement (REM) and deep sleep alters the ghrelin-to-leptin ratio, stimulating compensatory cravings for high-glycemic carbohydrates to boost brain adenosine clearance.',
      actionableGuidance: 'Protect an 8-hour sleep window between 10:30 PM - 6:30 AM to stabilize morning cortisol and curb compensatory cravings.'
    },
    {
      id: 'ai-2',
      module: 'PCOS PREDICT',
      title: 'Fasting Insulin & Borderline HbA1c (5.8%) Clinical Flag',
      summary: 'HbA1c level is slightly above ideal reference (&lt;5.7%), indicating an early insulin resistance window.',
      confidenceScore: 94,
      confidenceLabel: 'Direct Lab Verification',
      dataPointsCount: 12,
      factors: [
        { name: 'HbA1c 5.8% (Apex Diagnostics Jan 2025)', weight: 50, direction: 'Primary clinical indicator', impact: 'Verified by diagnostic laboratory' },
        { name: 'Fasting Insulin 14.2 μIU/mL', weight: 30, direction: 'Co-factor', impact: 'Elevated circulating basal insulin' },
        { name: 'Triglyceride/HDL ratio = 3.4', weight: 15, direction: 'Supportive marker', impact: 'Dyslipidemia secondary to hyperinsulinemia' },
        { name: 'BMI 25.4 kg/m²', weight: 5, direction: 'Contextual metric', impact: 'Mildly elevated visceral adiposity factor' }
      ],
      missingData: [
        'Oral Glucose Tolerance Test (2hr 75g OGTT)',
        'C-Peptide fasting level'
      ],
      clinicalLogic: 'Hyperinsulinemia stimulates ovarian theca cells to synthesize excess androgens while inhibiting SHBG synthesis in hepatocytes. Early detection allows lifestyle and nutraceutical intervention prior to metabolic progression.',
      actionableGuidance: 'Discuss inositol dosage and cardiovascular lipid evaluation with your healthcare professional.'
    },
    {
      id: 'ai-3',
      module: 'PCOS GENOME',
      title: 'Clinical Presentation Alignment with Phenotype B',
      summary: 'Recorded cycle delays (34-38 days) and elevated testosterone (52 ng/dL) align with classic non-PCOM PCOS.',
      confidenceScore: 72,
      confidenceLabel: 'Incomplete Clinical Picture',
      dataPointsCount: 18,
      factors: [
        { name: 'Menstrual interval 34-38 days (Oligomenorrhea)', weight: 45, direction: 'Core Rotterdam criterion', impact: 'Confirmed over 4 documented cycles' },
        { name: 'Serum total testosterone 52 ng/dL', weight: 40, direction: 'Core Rotterdam criterion', impact: 'Exceeds laboratory ceiling of 45 ng/dL' },
        { name: 'Ultrasound follicle count', weight: 0, direction: 'Missing feature', impact: 'Cannot confirm or exclude Phenotype A without imaging' }
      ],
      missingData: [
        'Transvaginal/pelvic ultrasound follicle count & volume',
        'Anti-Müllerian Hormone (AMH) test'
      ],
      clinicalLogic: 'Under Rotterdam criteria, 2 of 3 features confirm PCOS. However, determining between Phenotype A and Phenotype B requires ultrasound verification of ovarian morphology.',
      actionableGuidance: 'Schedule a pelvic ultrasound review to evaluate antral follicle count and ovarian stromal density.'
    }
  ];

  const current = explainableItems.find(i => i.id === selectedInsightId) || explainableItems[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">Explainable AI Engine</h2>
            <Badge variant="purple" size="xs">PCOS EXPLAIN</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Complete transparency into every health insight, contributing factors, model certainty, and missing data points.
          </p>
        </div>

        <span className="text-xs font-semibold text-[#7950A8] bg-[#EDE5F7] px-3 py-1.5 rounded-full">
          Transparent Clinical AI
        </span>
      </div>

      {/* Main Grid: Insight Selector + Detailed Explanation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Insight Cards Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#292431] uppercase tracking-wider px-1">
            Select Insight to Inspect
          </h3>

          {explainableItems.map((item) => {
            const isSelected = item.id === selectedInsightId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedInsightId(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#7950A8] bg-white ring-2 ring-[#7950A8]/20 shadow-sm'
                    : 'border-[#EFEAF4] bg-white hover:border-[#DFCDEE]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#7950A8]">{item.module}</span>
                  <span className="text-[10px] text-[#77717F]">{item.confidenceScore}% Certainty</span>
                </div>
                <h4 className="text-xs font-bold text-[#292431]">{item.title}</h4>
                <p className="text-[11px] text-[#77717F] mt-1 line-clamp-2">{item.summary}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Transparent Explanation Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-5">
          {/* Top Title & Certainty Meter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#FAF9FC]">
            <div>
              <span className="text-[11px] font-bold text-[#7950A8] uppercase tracking-wider bg-[#EDE5F7] px-2.5 py-0.5 rounded-md">
                {current.module}
              </span>
              <h3 className="text-base font-bold text-[#292431] mt-1.5">{current.title}</h3>
              <p className="text-xs text-[#77717F] mt-0.5">{current.summary}</p>
            </div>

            {/* Confidence Score Pill */}
            <div className="p-3 bg-[#FAF9FC] rounded-2xl border border-[#EFEAF4] text-right shrink-0">
              <span className="text-[10px] text-[#77717F] block uppercase font-semibold">Model Certainty</span>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-black text-[#7950A8]">{current.confidenceScore}%</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block">{current.confidenceLabel}</span>
            </div>
          </div>

          {/* Section 1: Contributing Factors & Relative Feature Weights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#292431] uppercase tracking-wider">
                Contributing Input Factors & Weights
              </h4>
              <span className="text-[11px] text-[#77717F]">{current.dataPointsCount} logs analyzed</span>
            </div>

            <div className="space-y-2">
              {current.factors.map((f, idx) => (
                <div key={idx} className="p-3 bg-[#FAF9FC] rounded-xl border border-[#EFEAF4]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#292431]">{f.name}</span>
                    <span className={`font-semibold ${f.weight > 0 ? 'text-[#7950A8]' : 'text-emerald-700'}`}>
                      {f.weight > 0 ? `+${f.weight}% weight` : `${f.weight}% buffer`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#77717F] mt-0.5">{f.impact}</p>
                  {/* Visual weight bar */}
                  <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#7950A8] rounded-full"
                      style={{ width: `${Math.abs(f.weight) * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Clinical Underlying Pathophysiology */}
          <div className="p-4 bg-[#EDE5F7]/30 rounded-2xl border border-[#DFCDEE]">
            <span className="text-xs font-bold text-[#7950A8] block mb-1">
              Biological & Clinical Rationale
            </span>
            <p className="text-xs text-[#292431] leading-relaxed">
              {current.clinicalLogic}
            </p>
          </div>

          {/* Section 3: Highlight Missing Information */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Missing Information Needed for Full Clinical Certainty</span>
            </div>
            <ul className="list-disc list-inside text-xs text-amber-900/90 space-y-1">
              {current.missingData.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Actionable Next Step */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-[#77717F]">
              <span className="font-semibold text-[#292431]">Next Step:</span> {current.actionableGuidance}
            </div>
            <button
              onClick={() => setActiveScreen('consultation-copilot')}
              className="px-4 py-2 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all shrink-0 cursor-pointer"
            >
              Add to Copilot
            </button>
          </div>
        </div>
      </div>

      <EthicalDisclaimer title="Explainable AI Protocol">
        PCOS360 adheres to strict explainable healthcare AI guidelines. No hidden black-box decisions: we articulate underlying data weights and clinical literature so you can review them collaboratively with your doctor.
      </EthicalDisclaimer>
    </div>
  );
}
