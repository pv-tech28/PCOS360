import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  FileText,
  Calculator,
  ArrowUpRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useHealth } from '../context/HealthContext';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function MetabolicPage() {
  const {
    historicalMetabolic,
    labReports,
    setIsLabUploadModalOpen,
    setActiveScreen
  } = useHealth();

  const [calcGlucose, setCalcGlucose] = useState(96);
  const [calcInsulin, setCalcInsulin] = useState(14.2);

  // HOMA-IR formula: (Glucose in mg/dL * Insulin in μIU/mL) / 405
  const homaScore = ((calcGlucose * calcInsulin) / 405).toFixed(2);
  const homaStatus = homaScore < 1.9 ? 'Normal Sensitivity' : homaScore < 2.9 ? 'Early Resistance' : 'Significant Resistance';

  const latestReport = labReports[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">Metabolic Health</h2>
            <Badge variant="purple" size="xs">PCOS PREDICT</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Tracking glycemic regulation, insulin sensitivity markers, and lipid cardiovascular profiles over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLabUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all shadow-xs cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      {/* Primary Key Metabolic Markers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fasting Glucose */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#77717F] font-semibold">Fasting Blood Glucose</span>
            <Badge variant="green" size="xs">Normal</Badge>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#292431]">96</span>
            <span className="text-xs text-[#77717F]">mg/dL</span>
          </div>
          <div className="mt-2 text-[11px] text-[#77717F]">
            Reference: 70 - 99 mg/dL
          </div>
          <div className="mt-2 text-[10px] text-emerald-700 font-medium">
            Steady over 12 months (89 → 96)
          </div>
        </div>

        {/* HbA1c */}
        <div className="bg-white rounded-3xl border border-[#DFCDEE] p-5 shadow-xs relative overflow-hidden bg-gradient-to-br from-white to-[#FBF8FE]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#77717F] font-semibold">HbA1c (Glycated Hb)</span>
            <Badge variant="amber" size="xs">Borderline</Badge>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#7950A8]">5.8</span>
            <span className="text-xs text-[#77717F]">%</span>
          </div>
          <div className="mt-2 text-[11px] text-[#77717F]">
            Reference: &lt; 5.7% (Optimal)
          </div>
          <div className="mt-2 text-[10px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded">
            Requires physician discussion
          </div>
        </div>

        {/* Fasting Insulin */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#77717F] font-semibold">Fasting Serum Insulin</span>
            <Badge variant="amber" size="xs">Elevated</Badge>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#292431]">14.2</span>
            <span className="text-xs text-[#77717F]">μIU/mL</span>
          </div>
          <div className="mt-2 text-[11px] text-[#77717F]">
            Optimal Target: &lt; 10.0 μIU/mL
          </div>
          <div className="mt-2 text-[10px] text-[#7950A8] font-medium">
            Common metabolic feature in PCOS
          </div>
        </div>

        {/* Triglycerides */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#77717F] font-semibold">Triglycerides / HDL</span>
            <Badge variant="amber" size="xs">3.4 Ratio</Badge>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#292431]">165</span>
            <span className="text-xs text-[#77717F]">mg/dL (TG)</span>
          </div>
          <div className="mt-2 text-[11px] text-[#77717F]">
            Target TG: &lt; 150 mg/dL • HDL: &gt; 50
          </div>
          <div className="mt-2 text-[10px] text-[#77717F]">
            TG/HDL &gt; 3 often indicates insulin resistance
          </div>
        </div>
      </div>

      {/* Historical Trend Chart (Glucose, HbA1c, Triglycerides) */}
      <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#292431]">Longitudinal Metabolic Trajectory</h3>
            <p className="text-xs text-[#77717F]">15-Month progression across verified lab draws</p>
          </div>
          <span className="text-xs text-[#7950A8] font-semibold bg-[#EDE5F7] px-3 py-1 rounded-full">
            5 Verified Lab Points
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalMetabolic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2ECF8" />
              <XAxis dataKey="date" stroke="#9E98A8" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 200]} stroke="#9E98A8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EFEAF4',
                  boxShadow: '0 8px 24px rgba(41,36,49,0.08)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="fastingGlucose"
                name="Fasting Glucose (mg/dL)"
                stroke="#7950A8"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="triglycerides"
                name="Triglycerides (mg/dL)"
                stroke="#E8B8D0"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="ldl"
                name="LDL Cholesterol (mg/dL)"
                stroke="#1B7878"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive HOMA-IR Calculator & Physician Discussion Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HOMA-IR Interactive Calculator */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-[#7950A8]" />
            <h3 className="text-sm font-bold text-[#292431]">Interactive HOMA-IR Index Explorer</h3>
          </div>
          <p className="text-xs text-[#77717F] mb-4">
            The Homeostatic Model Assessment for Insulin Resistance (HOMA-IR) approximates beta-cell function and insulin resistance from fasting levels.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#292431] mb-1">
                  Fasting Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  value={calcGlucose}
                  onChange={(e) => setCalcGlucose(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#292431] mb-1">
                  Fasting Insulin (μIU/mL)
                </label>
                <input
                  type="number"
                  value={calcInsulin}
                  onChange={(e) => setCalcInsulin(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC]"
                />
              </div>
            </div>

            <div className="p-4 bg-[#FAF9FC] rounded-2xl border border-[#DFCDEE] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#77717F] block">Calculated HOMA-IR</span>
                <span className="text-2xl font-black text-[#7950A8]">{homaScore}</span>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  homaScore < 1.9 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {homaStatus}
                </span>
                <span className="text-[10px] text-[#77717F] block mt-1">Normal benchmark: &lt; 1.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Discussion Prompts */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-[#292431]">Results Requiring Medical Discussion</h3>
            </div>
            <p className="text-xs text-[#77717F] mb-3">
              Based on your latest lab results from Jan 26, 2025, consider discussing these specific markers at your next appointment:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-950">
                <strong>1. Borderline HbA1c (5.8%):</strong> Ask your doctor whether dietary modifications or insulin sensitizers (such as Inositol or Metformin) are advisable.
              </div>
              <div className="p-3 bg-[#FAF9FC] border border-[#EFEAF4] rounded-xl text-[#292431]">
                <strong>2. Fasting Insulin (14.2 μIU/mL):</strong> Inquire if an oral glucose tolerance test (OGTT with 2-hour insulin) would be valuable.
              </div>
              <div className="p-3 bg-[#FAF9FC] border border-[#EFEAF4] rounded-xl text-[#292431]">
                <strong>3. Vitamin D (24 ng/mL):</strong> Discuss an optimal supplementation dosage to achieve target &gt;30 ng/mL.
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveScreen('consultation-copilot')}
            className="w-full mt-4 py-2.5 rounded-xl bg-[#EDE5F7] text-[#7950A8] text-xs font-semibold hover:bg-[#E3D6F2] transition-all flex items-center justify-center gap-2"
          >
            <span>Add to Doctor Visit Packet</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <EthicalDisclaimer type="warning" title="No Automated Disease-Risk Claims">
        PCOS360 compares lab biomarkers directly to standard laboratory reference ranges. We strictly refrain from displaying unsupported disease-risk predictions (such as diabetes probability percentages). All clinical conclusions require evaluation by your physician.
      </EthicalDisclaimer>
    </div>
  );
}
