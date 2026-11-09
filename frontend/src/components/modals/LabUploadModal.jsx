import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2, Edit3, Trash2 } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import EthicalDisclaimer from '../common/EthicalDisclaimer';

export default function LabUploadModal() {
  const { isLabUploadModalOpen, setIsLabUploadModalOpen, addLabReport } = useHealth();

  const [step, setStep] = useState('upload'); // 'upload' | 'processing' | 'verify'
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [reportDate, setReportDate] = useState('2025-02-01');
  const [labName, setLabName] = useState('MetroPath Diagnostics');

  // Sample realistic extracted biomarkers
  const defaultExtracted = [
    { name: 'Fasting Blood Glucose', value: 94, unit: 'mg/dL', normalRange: '70 - 99', status: 'Normal', interpretation: 'Normal glucose levels.' },
    { name: 'HbA1c', value: 5.7, unit: '%', normalRange: '< 5.7', status: 'Borderline', interpretation: 'At the upper boundary of normal. Suggests early insulin resistance monitoring.' },
    { name: 'Fasting Insulin', value: 12.8, unit: 'μIU/mL', normalRange: '< 10.0', status: 'Borderline', interpretation: 'Mildly elevated fasting insulin.' },
    { name: 'Total Cholesterol', value: 198, unit: 'mg/dL', normalRange: '< 200', status: 'Normal', interpretation: 'Within acceptable limits.' },
    { name: 'Triglycerides', value: 158, unit: 'mg/dL', normalRange: '< 150', status: 'Borderline', interpretation: 'Mildly elevated.' },
    { name: 'LH / FSH Ratio', value: 2.1, unit: 'Ratio', normalRange: '1.0 - 1.5', status: 'Elevated', interpretation: 'Characteristic LH dominant ratio in PCOS.' }
  ];

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file) {
      setSelectedFile(file);
      startSimulation(file.name);
    }
  };

  const startSimulation = (filename) => {
    setStep('processing');
    setTimeout(() => {
      setExtractedData(defaultExtracted);
      setStep('verify');
    }, 1800);
  };

  const handleUpdateValue = (index, newValue) => {
    const updated = [...extractedData];
    updated[index].value = newValue;
    setExtractedData(updated);
  };

  const handleSaveReport = () => {
    const newReport = {
      id: `rep-${Date.now()}`,
      filename: selectedFile ? selectedFile.name : 'Uploaded_Lab_Report.pdf',
      labName,
      date: reportDate,
      status: 'Analyzed',
      verified: true,
      tests: extractedData
    };
    addLabReport(newReport);
    setIsLabUploadModalOpen(false);
    setStep('upload');
    setSelectedFile(null);
  };

  if (!isLabUploadModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292431]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-[0_25px_70px_rgba(41,36,49,0.25)] border border-[#EFEAF4] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#FAF9FC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#292431]">AI Lab Report Decoder</h2>
              <p className="text-xs text-[#77717F]">Upload Blood Work & Hormone Panels</p>
            </div>
          </div>

          <button
            onClick={() => setIsLabUploadModalOpen(false)}
            className="p-1.5 rounded-full text-[#77717F] hover:bg-[#FAF9FC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto space-y-5">
          {step === 'upload' && (
            <div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-[#DFCDEE] hover:border-[#7950A8] rounded-2xl p-8 text-center bg-[#FAF9FC] transition-colors cursor-pointer"
                onClick={() => document.getElementById('lab-file-input').click()}
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#EFEAF4] shadow-xs mx-auto flex items-center justify-center text-[#7950A8] mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-[#292431]">Click to upload or drag & drop</h3>
                <p className="text-xs text-[#77717F] mt-1">PDF, JPG, or PNG (Metabolic, Lipids, Thyroid or Hormones)</p>
                <span className="inline-block mt-3 px-3 py-1 bg-white text-[#7950A8] text-xs font-semibold rounded-lg border border-[#DFCDEE]">
                  Browse File
                </span>
                <input
                  id="lab-file-input"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileDrop}
                />
              </div>

              {/* Sample quick button for testing without local files */}
              <div className="mt-4 pt-4 border-t border-[#FAF9FC] flex items-center justify-between">
                <span className="text-xs text-[#77717F]">Don't have a file right now?</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile({ name: 'Apex_Comprehensive_Metabolic_Panel.pdf' });
                    startSimulation('Apex_Comprehensive_Metabolic_Panel.pdf');
                  }}
                  className="text-xs font-semibold text-[#7950A8] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Load Sample Blood Panel
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center mx-auto animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#292431]">Analyzing Laboratory Document...</h3>
                <p className="text-xs text-[#77717F] mt-1 max-w-sm mx-auto">
                  Extracting biomarker names, test values, measurement units and matching laboratory reference bounds.
                </p>
              </div>
              <div className="max-w-xs mx-auto space-y-2 text-left text-xs text-[#77717F] pt-2">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Document parsed successfully</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>6 Clinical biomarkers identified</span>
                </div>
                <div className="flex items-center gap-2 text-[#7950A8]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calibrating reference intervals</span>
                </div>
              </div>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#FAF9FC] rounded-2xl border border-[#EFEAF4]">
                <div>
                  <span className="text-xs text-[#77717F]">Document</span>
                  <p className="text-xs font-bold text-[#292431]">{selectedFile?.name || 'Lab_Report.pdf'}</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div>
                    <label className="text-[10px] text-[#77717F] block">Report Date</label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="text-xs p-1.5 border border-[#EFEAF4] rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#77717F] block">Diagnostic Lab</label>
                    <input
                      type="text"
                      value={labName}
                      onChange={(e) => setLabName(e.target.value)}
                      className="text-xs p-1.5 border border-[#EFEAF4] rounded-lg bg-white max-w-28"
                    />
                  </div>
                </div>
              </div>

              <div className="text-xs font-semibold text-[#292431] flex items-center justify-between">
                <span>Verify Extracted Biomarkers ({extractedData.length})</span>
                <span className="text-[11px] text-[#77717F] font-normal">Click any value to correct</span>
              </div>

              <div className="border border-[#EFEAF4] rounded-2xl overflow-hidden divide-y divide-[#FAF9FC]">
                {extractedData.map((item, idx) => (
                  <div key={idx} className="p-3 hover:bg-[#FAF9FC]/50 flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#292431] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#77717F]">Ref: {item.normalRange} {item.unit}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={item.value}
                        onChange={(e) => handleUpdateValue(idx, parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-right font-bold text-xs rounded border border-[#EFEAF4] bg-white text-[#292431]"
                      />
                      <span className="text-[11px] text-[#77717F] w-10">{item.unit}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.status === 'Normal'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'Borderline'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <EthicalDisclaimer title="Clinical Verification">
                AI optical character extraction is assistive. Always double-check parsed values with the official paper or PDF report before relying on historical trends.
              </EthicalDisclaimer>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'verify' && (
          <div className="p-5 border-t border-[#FAF9FC] flex items-center justify-end gap-3 bg-white">
            <button
              type="button"
              onClick={() => setStep('upload')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#77717F] hover:bg-[#FAF9FC]"
            >
              Re-upload
            </button>
            <button
              type="button"
              onClick={handleSaveReport}
              className="px-6 py-2.5 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all shadow-xs"
            >
              Confirm & Save Biomarkers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
