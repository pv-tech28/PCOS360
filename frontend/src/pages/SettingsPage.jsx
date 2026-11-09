import React, { useState } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  Pill,
  Save
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function SettingsPage() {
  const {
    profile,
    updateProfile,
    resetToDemo,
    labReports,
    timeline,
    cycleData
  } = useHealth();

  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    pcosStatus: profile.pcosStatus,
    diagnosisYear: profile.diagnosisYear,
    medications: profile.medications?.join(', ') || ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      age: parseInt(formData.age) || 23,
      heightCm: parseInt(formData.heightCm) || 160,
      weightKg: parseFloat(formData.weightKg) || 65,
      pcosStatus: formData.pcosStatus,
      diagnosisYear: parseInt(formData.diagnosisYear) || 2023,
      medications: formData.medications.split(',').map(m => m.trim()).filter(Boolean)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const exportData = () => {
    const data = {
      profile,
      cycleData,
      labReports,
      timeline,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PCOS360_Health_Records_${profile.name.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">Settings & Profile</h2>
            <Badge variant="purple" size="xs">Personal Health Data</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Manage your personal metrics, diagnosis information, security preferences, and export full records.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Changes Saved!
          </span>
        )}
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-[#292431]">Personal Health Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292431] mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:border-[#7950A8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292431] mb-1">Age (Years)</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:border-[#7950A8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292431] mb-1">Height (cm)</label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:border-[#7950A8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292431] mb-1">Weight (kg)</label>
              <input
                type="number"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:border-[#7950A8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292431] mb-1">PCOS Diagnosis Status</label>
              <select
                value={formData.pcosStatus}
                onChange={(e) => setFormData({ ...formData, pcosStatus: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC] focus:bg-white"
              >
                <option value="Diagnosed">Formally Diagnosed</option>
                <option value="Not diagnosed">Not diagnosed / Exploring</option>
                <option value="Unsure">Unsure / In Assessment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292431] mb-1">Diagnosis Year</label>
              <input
                type="number"
                value={formData.diagnosisYear}
                onChange={(e) => setFormData({ ...formData, diagnosisYear: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:border-[#7950A8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292431] mb-1">
              Current Medications & Supplements (comma separated)
            </label>
            <input
              type="text"
              value={formData.medications}
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:border-[#7950A8]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Health Profile</span>
            </button>
          </div>
        </form>

        {/* Security & Data Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#292431] font-bold text-sm">
              <Shield className="w-4 h-4 text-[#7950A8]" />
              <span>Data Export & Security</span>
            </div>

            <p className="text-xs text-[#77717F] leading-relaxed">
              Your health data is stored locally in your browser session and encrypted client-side. You own 100% of your health history.
            </p>

            <button
              type="button"
              onClick={exportData}
              className="w-full py-2.5 rounded-xl bg-[#EDE5F7] text-[#7950A8] text-xs font-semibold hover:bg-[#E3D6F2] transition-all flex items-center justify-center gap-2 border border-[#DFCDEE] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Records (JSON)</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#292431] font-bold text-sm">
              <RotateCcw className="w-4 h-4 text-stone-500" />
              <span>Demo Controls</span>
            </div>

            <p className="text-xs text-[#77717F]">
              Reset all logs, lab reports, and metrics back to initial Ananya Sharma demo state.
            </p>

            <button
              type="button"
              onClick={resetToDemo}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-all cursor-pointer"
            >
              Reset to Initial Demo State
            </button>
          </div>
        </div>
      </div>

      <EthicalDisclaimer title="Privacy & Health Data Autonomy">
        PCOS360 is built with patient data autonomy at its foundation. Your biomarker trends and cycle logs are strictly confidential and will never be shared without explicit authorization.
      </EthicalDisclaimer>
    </div>
  );
}
