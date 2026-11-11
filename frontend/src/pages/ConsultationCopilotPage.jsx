import React, { useState, useRef } from 'react';
import {
  Stethoscope,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function ConsultationCopilotPage() {
  const { profile, cycleData, labReports } = useHealth();
  const [doctorType, setDoctorType] = useState('Gynecologist'); // 'Gynecologist' | 'Endocrinologist' | 'Nutritionist'
  const [customQuestion, setCustomQuestion] = useState('');
  const latestReport = labReports?.[0] || null;
  const hasBiometrics = Number(profile.heightCm) > 0 && Number(profile.weightKg) > 0;
  const computedBmi = hasBiometrics
    ? (Number(profile.weightKg) / Math.pow(Number(profile.heightCm) / 100, 2)).toFixed(1)
    : null;
  const [questions, setQuestions] = useState([
    'Based on my cycle history and symptom log trends, are additional hormone or ovulation checks helpful right now?',
    'Would you recommend evaluating fasting glucose, fasting insulin, or HbA1c at my next visit?',
    'What lifestyle or evidence-based management options fit my symptoms and health goals best?',
    'Is any follow-up imaging or laboratory monitoring needed before my next appointment?'
  ]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setQuestions([...questions, customQuestion.trim()]);
    setCustomQuestion('');
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">Consultation Copilot</h2>
            <Badge variant="purple" size="xs">Doctor Visit Packet</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Generate an organized health history summary and evidence-based questions for your healthcare visit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Copilot Summary Checklist & Interactive Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Copilot Card matching Mockup Screen 7 */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center">
              <Stethoscope className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#292431]">Doctor Visit Ready Summary</h3>
              <p className="text-xs text-[#77717F] mt-1">
                Everything your doctor needs in a concise, clinically structured 1-page format.
              </p>
            </div>

            {/* Checklist matching mockup Screen 7 */}
            <div className="space-y-3 pt-2">
              {[
                {
                  title: 'Your health summary',
                  desc: `${profile.age || 'N/A'} yrs${computedBmi ? `, BMI ${computedBmi}` : ''}, ${profile.pcosStatus || 'Unsure'}${profile.diagnosisYear ? ` (${profile.diagnosisYear})` : ''}`,
                },
                {
                  title: 'Symptom & cycle timeline',
                  desc: `Cycle day ${cycleData.currentDay || 1} of ${cycleData.totalDays || 28} (${cycleData.phase || 'Pending cycle log'})`,
                },
                {
                  title: 'Lab report highlights (informational)',
                  desc: latestReport?.tests?.length
                    ? latestReport.tests
                        .slice(0, 3)
                        .map((t) => `${t.name} ${t.value} ${t.unit}`)
                        .join(', ')
                    : 'No lab biomarkers saved yet',
                },
                { title: 'Tailored questions to ask', desc: `${questions.length} questions prioritized for ${doctorType}` }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7950A8] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#292431] block">{item.title}</span>
                    <span className="text-[11px] text-[#77717F] block">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-[#EDE5F7] text-[#7950A8] text-xs font-bold border border-[#DFCDEE] hover:bg-[#E3D6F2] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Consultation PDF</span>
          </button>
        </div>

        {/* Right Column: Tailored Discussion Questions & Doctor Specialization */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FAF9FC]">
            <div>
              <h3 className="text-sm font-bold text-[#292431]">Prepared Doctor Discussion Questions</h3>
              <p className="text-xs text-[#77717F]">Calibrated to your latest lab numbers and logged symptoms</p>
            </div>

            {/* Doctor Type Pills */}
            <div className="flex items-center gap-1 bg-[#FAF9FC] p-1 rounded-xl border border-[#EFEAF4]">
              {['Gynecologist', 'Endocrinologist', 'Nutritionist'].map((doc) => (
                <button
                  key={doc}
                  onClick={() => setDoctorType(doc)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    doctorType === doc
                      ? 'bg-white text-[#7950A8] shadow-2xs'
                      : 'text-[#77717F] hover:text-[#292431]'
                  }`}
                >
                  {doc}
                </button>
              ))}
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-2.5">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/50 flex items-start justify-between gap-3 hover:border-[#DFCDEE] transition-all"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#EDE5F7] text-[#7950A8] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-medium text-[#292431] leading-relaxed">{q}</p>
                </div>

                <button
                  onClick={() => handleRemoveQuestion(idx)}
                  className="text-[#9E98A8] hover:text-rose-600 p-1 shrink-0"
                  title="Remove question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Custom Question Form */}
          <form onSubmit={handleAddQuestion} className="flex gap-2 pt-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Add your own question for the appointment..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8] bg-[#FAF9FC]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          <EthicalDisclaimer title="Doctor-Patient Partnership">
            This summary is designed to make appointments efficient and collaborative. It empowers you with clear data points without replacing the physician's diagnostic judgment.
          </EthicalDisclaimer>
        </div>
      </div>

      {/* Export / Printable Summary Preview Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292431]/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-[0_25px_70px_rgba(41,36,49,0.25)] border border-[#EFEAF4] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#FAF9FC] flex items-center justify-between no-print">
              <span className="text-sm font-bold text-[#292431]">Consultation Summary Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-[#EDE5F7] text-[#7950A8] text-xs font-semibold hover:bg-[#E3D6F2] flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#77717F] hover:bg-[#FAF9FC]"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-8 overflow-y-auto space-y-6 text-xs text-[#292431] bg-white print:p-0">
              <div className="flex items-center justify-between border-b pb-4 border-stone-200">
                <div>
                  <h1 className="text-lg font-black text-[#7950A8]">PCOS360 Consultation Summary</h1>
                  <p className="text-[11px] text-stone-500">Prepared for: Dr. {doctorType} Appointment</p>
                </div>
                <div className="text-right text-[11px] text-stone-500">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Patient: <strong>{profile.name || 'Member'}</strong> ({profile.age || 'N/A'}y)</p>
                </div>
              </div>

              {/* Patient Basic Info */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px]">
                <div>
                  <span className="text-stone-500 block">Biometrics:</span>
                  <strong>
                    {profile.heightCm || '—'} cm • {profile.weightKg || '—'} kg
                    {profile.heightCm > 0 && profile.weightKg > 0
                      ? ` (BMI ${(profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1)})`
                      : ''}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Diagnosis Status:</span>
                  <strong>{profile.pcosStatus} ({profile.diagnosisYear || 'N/A'})</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Cycle Rhythm:</span>
                  <strong>Avg {profile.cycleLengthAvg} days (Currently Day {cycleData.currentDay})</strong>
                </div>
              </div>

              {/* Current Regimen */}
              <div>
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                  Current Medications & Supplements
                </h4>
                <p className="text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  {profile.medications?.join(', ') || 'None reported'}
                </p>
              </div>

              {/* Lab Panel Highlights */}
              <div>
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                  Recent Biomarker Highlights {latestReport?.date ? `(${latestReport.date})` : ''} — Informational Only, Not Diagnostic
                </h4>
                {latestReport?.tests?.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {latestReport.tests.slice(0, 6).map((test, idx) => (
                      <div key={idx} className="p-2 border rounded-lg bg-stone-50">
                        <span className="text-stone-500 block">{test.name}:</span>
                        <strong className={test.status === 'Normal' ? 'text-stone-800' : 'text-amber-700'}>
                          {test.value} {test.unit} ({test.status})
                        </strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    No laboratory biomarkers stored on this account yet.
                  </p>
                )}
              </div>

              {/* Patient Questions */}
              <div>
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-600 mb-2">
                  Patient Questions to Discuss
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-stone-800">
                  {questions.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">{q}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-4 border-t text-[10px] text-stone-400 text-center">
                Generated via PCOS360 Health Intelligence • Informational Summary Only (Not Diagnostic) • Always verify against official lab reports with a licensed clinician.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
