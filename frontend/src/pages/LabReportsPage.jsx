import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function LabReportsPage() {
  const { labReports, setIsLabUploadModalOpen, setActiveScreen } = useHealth();
  const [selectedReportId, setSelectedReportId] = useState(labReports[0]?.id || null);
  const [expandedTest, setExpandedTest] = useState(null);

  const selectedReport = labReports.find(r => r.id === selectedReportId) || labReports[0] || null;
  const activeSelectedReportId = selectedReport?.id || null;
  const flaggedTest = selectedReport?.tests?.find(t => t.status !== 'Normal') || null;

  return (
    <div className="space-y-6">
      {/* Header matching Mockup Screen 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">AI Lab Report Decoder</h2>
            <Badge variant="purple" size="xs">Biomarker Extraction</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Convert medical blood panels and hormone panels into structured, plain-English insights.
          </p>
        </div>

        <button
          onClick={() => setIsLabUploadModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all shadow-xs cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Lab Report (PDF / Image)</span>
        </button>
      </div>

      {/* Main Grid: Upload Banner / Last Analysis + Biomarker Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload Hero & Past Reports */}
        <div className="space-y-4">
          {/* Upload Callout Card (Matches Mockup Screen 5 top card) */}
          <div
            onClick={() => setIsLabUploadModalOpen(true)}
            className="border-2 border-dashed border-[#DFCDEE] hover:border-[#7950A8] rounded-3xl p-6 text-center bg-[#FAF9FC] transition-all cursor-pointer group hover:bg-[#F8F4FC]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EFEAF4] flex items-center justify-center text-[#7950A8] mx-auto mb-3 shadow-2xs group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#292431]">Upload Lab Report</h3>
            <p className="text-xs text-[#77717F] mt-1">(PDF / Image)</p>
          </div>

          {/* Last Analysis Card (Matches Mockup Screen 5) */}
          <div className="bg-white rounded-3xl border border-[#EFEAF4] p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-[#292431] uppercase tracking-wider block">
              Last Analysis
            </span>

            {labReports.length === 0 && (
              <p className="text-xs text-[#77717F] py-3">
                No lab reports saved to this account yet.
              </p>
            )}

            {labReports.map((report) => {
              const isSelected = report.id === activeSelectedReportId;
              return (
                <div
                  key={report.id}
                  onClick={() => {
                    setSelectedReportId(report.id);
                    setExpandedTest(null);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#7950A8] bg-[#FAF9FC] ring-1 ring-[#7950A8]'
                      : 'border-[#EFEAF4] hover:bg-[#FAF9FC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#292431] truncate">{report.filename}</p>
                        <p className="text-[10px] text-[#77717F] truncate">
                          Analyzed on {report.date} • {report.tests?.length || 0} tests
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Highlighted Clinical Alert Card when a flagged test is present */}
          {flaggedTest && (
            <div className="bg-[#FEF6E6] rounded-3xl border border-[#FCE6B7] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#B26B00] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#B26B00]" />
                  {flaggedTest.name}: {flaggedTest.value} {flaggedTest.unit}
                </span>
                <Badge variant="amber" size="xs">{flaggedTest.status}</Badge>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A5B00]">
                Informational Only — Not Diagnostic
              </p>
              <p className="text-xs text-[#7A4900] leading-relaxed">
                {flaggedTest.interpretation}
              </p>
              <button
                onClick={() => setActiveScreen('consultation-copilot')}
                className="text-xs font-semibold text-[#B26B00] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Add to Gynecologist Discussion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Full Biomarker Decoded Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-4">
          {!selectedReport ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#292431]">No Lab Reports Stored Yet</h3>
              <p className="text-xs text-[#77717F] max-w-md mx-auto">
                Upload or enter lab biomarkers to store verified blood and hormone values privately in your account.
              </p>
              <button
                type="button"
                onClick={() => setIsLabUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Add First Lab Panel</span>
              </button>
            </div>
          ) : (
            <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FAF9FC]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#292431]">{selectedReport?.filename}</h3>
                <Badge variant="green" size="xs">Verified Report</Badge>
              </div>
              <p className="text-xs text-[#77717F] mt-0.5">
                {selectedReport?.labName} • Draw Date: {selectedReport?.date}
              </p>
            </div>

            <button
              onClick={() => setIsLabUploadModalOpen(true)}
              className="text-xs font-semibold text-[#7950A8] hover:underline"
            >
              + Add / Edit Values
            </button>
          </div>

          {/* Biomarkers List with Plain-English explanations */}
          <div className="space-y-2.5">
            {selectedReport?.tests?.map((test, index) => {
              const isExpanded = expandedTest === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/50 overflow-hidden transition-all hover:border-[#DFCDEE]"
                >
                  <div
                    onClick={() => setExpandedTest(isExpanded ? null : index)}
                    className="p-3.5 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#292431]">{test.name}</span>
                        <span className="text-[10px] text-[#77717F]">Ref: {test.normalRange} {test.unit}</span>
                      </div>
                      <p className="text-[11px] text-[#77717F] truncate mt-0.5">{test.interpretation}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-black text-[#292431]">{test.value}</span>
                        <span className="text-[11px] text-[#77717F] ml-1">{test.unit}</span>
                      </div>

                      <Badge
                        variant={
                          test.status === 'Normal' ? 'green' : test.status === 'Borderline' ? 'amber' : 'red'
                        }
                        size="xs"
                      >
                        {test.status}
                      </Badge>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#77717F]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#77717F]" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Plain-English Explanation */}
                  {isExpanded && (
                    <div className="px-4 pb-3.5 pt-1 text-xs text-[#292431] border-t border-[#EFEAF4] bg-white space-y-2 animate-in fade-in duration-100">
                      <div className="p-2.5 bg-[#FAF9FC] rounded-xl border border-[#EFEAF4]">
                        <span className="font-semibold text-[#7950A8] block text-[11px] uppercase tracking-wide">
                          Informational Context (Not a Medical Diagnosis)
                        </span>
                        <p className="text-xs text-[#77717F] mt-1 leading-relaxed">{test.interpretation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <EthicalDisclaimer title="Informational Reference Only — Not Diagnostic">
            Biomarker ranges and explanations shown here are strictly informational and educational, not diagnostic. Assay ranges vary by laboratory; always share official lab printouts with a qualified physician before making clinical decisions.
          </EthicalDisclaimer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
