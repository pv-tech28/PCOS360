import React, { useState } from 'react';
import { X, Moon, Heart, Droplets, Pill, Smile, Frown, Meh, AlertCircle, Check } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export default function DailyLogModal() {
  const { isLogModalOpen, setIsLogModalOpen, addDailyLog, cycleData } = useHealth();

  const [sleepHours, setSleepHours] = useState(7.5);
  const [stressLevel, setStressLevel] = useState(2); // 1 to 5
  const [energyLevel, setEnergyLevel] = useState('Moderate');
  const [waterGlasses, setWaterGlasses] = useState(7);
  const [medsTaken, setMedsTaken] = useState(true);
  const [notes, setNotes] = useState('');

  const commonSymptoms = [
    'Mild Fatigue',
    'Severe Fatigue',
    'Pelvic Cramping',
    'Bloating / Water Retention',
    'Acne Breakout',
    'Headache',
    'Sugar Cravings',
    'Mood Swings',
    'Brain Fog',
    'Lower Back Aches'
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState(['Mild Fatigue', 'Bloating / Water Retention']);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);
    const res = await addDailyLog({
      sleepHours,
      stressLevel,
      energyLevel,
      waterGlasses,
      medsTaken,
      symptoms: selectedSymptoms,
      notes
    });
    setSaving(false);
    if (res?.ok) {
      setIsLogModalOpen(false);
    } else {
      setErrorMsg(res?.error || 'Could not save daily log.');
    }
  };

  if (!isLogModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292431]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-[0_20px_60px_rgba(41,36,49,0.2)] border border-[#EFEAF4] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#FAF9FC] flex items-center justify-between bg-gradient-to-r from-[#FAF9FC] to-white">
          <div>
            <h2 className="text-base font-bold text-[#292431]">Daily Health & Symptom Log</h2>
            <p className="text-xs text-[#77717F]">Cycle Day {cycleData.currentDay} • {cycleData.phase}</p>
          </div>
          <button
            onClick={() => setIsLogModalOpen(false)}
            className="p-1.5 rounded-full text-[#77717F] hover:bg-[#FAF9FC] hover:text-[#292431]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
          {/* Sleep Hours Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#292431] mb-1.5">
              <span className="flex items-center gap-1.5 text-[#7950A8]">
                <Moon className="w-4 h-4" /> Sleep Duration
              </span>
              <span className="font-bold text-sm text-[#7950A8]">{sleepHours} hrs</span>
            </div>
            <input
              type="range"
              min="4"
              max="11"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-[#7950A8] bg-[#EDE5F7] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9E98A8] mt-1">
              <span>4 hrs</span>
              <span>7-8 hrs (Recommended)</span>
              <span>11 hrs</span>
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-xs font-semibold text-[#292431] mb-2">
              Perceived Stress Level (1 to 5)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { lvl: 1, label: 'Very Low' },
                { lvl: 2, label: 'Manageable' },
                { lvl: 3, label: 'Moderate' },
                { lvl: 4, label: 'High' },
                { lvl: 5, label: 'Overwhelmed' }
              ].map((item) => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => setStressLevel(item.lvl)}
                  className={`p-2 rounded-xl text-center border text-xs transition-all ${
                    stressLevel === item.lvl
                      ? 'bg-[#EDE5F7] border-[#7950A8] text-[#7950A8] font-bold'
                      : 'bg-white border-[#EFEAF4] text-[#77717F] hover:bg-[#FAF9FC]'
                  }`}
                >
                  <span className="block text-sm mb-0.5">{item.lvl}</span>
                  <span className="text-[10px] block leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div>
            <label className="block text-xs font-semibold text-[#292431] mb-2">
              Symptoms Experienced Today
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                      isSelected
                        ? 'bg-[#EDE5F7] text-[#7950A8] border-[#7950A8] font-semibold'
                        : 'bg-white text-[#77717F] border-[#EFEAF4] hover:bg-[#FAF9FC]'
                    }`}
                  >
                    {isSelected && <span className="mr-1 font-bold">✓</span>}
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lifestyle quick switches: Water & Meds */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/60">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#292431] mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" /> Water Intake
              </span>
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setWaterGlasses(Math.max(1, waterGlasses - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#EFEAF4] font-bold text-xs"
                >
                  -
                </button>
                <span className="text-xs font-bold text-[#292431]">{waterGlasses} glasses</span>
                <button
                  type="button"
                  onClick={() => setWaterGlasses(waterGlasses + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-[#EFEAF4] font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/60">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#292431] mb-1">
                <Pill className="w-3.5 h-3.5 text-[#7950A8]" /> Daily Inositol / Meds
              </span>
              <button
                type="button"
                onClick={() => setMedsTaken(!medsTaken)}
                className={`w-full mt-2 py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                  medsTaken
                    ? 'bg-[#EAF7EE] text-[#247A46] border-[#CEEFD7]'
                    : 'bg-stone-100 text-stone-500 border-stone-200'
                }`}
              >
                {medsTaken ? '✓ Taken Today' : 'Missed / Not Taken'}
              </button>
            </div>
          </div>

          {/* Quick Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#292431] mb-1">
              Personal Notes / Triggers (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Higher carb lunch, woke up feeling refreshed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8] bg-[#FAF9FC]/30"
            />
          </div>

          {/* Submit Action */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#77717F] hover:bg-[#FAF9FC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] disabled:opacity-60 transition-all shadow-xs cursor-pointer"
            >
              {saving ? 'Saving...' : "Save Today's Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
