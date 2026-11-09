import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, User, Heart, Pill, Calendar, Activity } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export default function OnboardingModal() {
  const { isOnboardingOpen, setIsOnboardingOpen, profile, updateProfile } = useHealth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: profile.name || 'Ananya Sharma',
    age: profile.age || 23,
    heightCm: profile.heightCm || 160,
    weightKg: profile.weightKg || 65,
    pcosStatus: profile.pcosStatus || 'Diagnosed',
    diagnosisYear: profile.diagnosisYear || 2023,
    medicalConditions: profile.medicalConditions || ['Insulin Resistance'],
    medications: profile.medications || ['Myo-Inositol & D-Chiro Inositol (40:1)'],
  });

  const bmi = (formData.weightKg / Math.pow(formData.heightCm / 100, 2)).toFixed(1);

  const conditionOptions = [
    'Insulin Resistance',
    'Mild Vitamin D Deficiency',
    'Hypothyroidism / Hashimoto\'s',
    'Elevated Cortisol / Adrenal Dysregulation',
    'Acne Vulgaris',
    'Hair Thinning / Alopecia',
    'Anxiety or Depressive Episodes'
  ];

  const medicationOptions = [
    'Myo-Inositol & D-Chiro Inositol (40:1)',
    'Metformin',
    'Oral Contraceptive Pill (OCP)',
    'Spironolactone',
    'Vitamin D3',
    'Omega-3 Fish Oil',
    'Magnesium Glycinate',
    'Berberine'
  ];

  const toggleArrayItem = (field, item) => {
    const list = formData[field] || [];
    if (list.includes(item)) {
      setFormData({ ...formData, [field]: list.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...list, item] });
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateProfile(formData);
      setIsOnboardingOpen(false);
      setStep(1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!isOnboardingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292431]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-[0_25px_70px_rgba(41,36,49,0.25)] border border-[#EFEAF4] overflow-hidden flex flex-col">
        {/* Header with Progress dots matching mockup */}
        <div className="px-6 pt-6 pb-4 border-b border-[#FAF9FC] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="p-1 rounded-full text-[#77717F] hover:bg-[#FAF9FC]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : <div className="w-5" />}

            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-7 bg-[#7950A8]'
                      : s < step
                      ? 'w-2 bg-[#7950A8]/60'
                      : 'w-2 bg-[#EDE5F7]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setIsOnboardingOpen(false)}
              className="p-1 rounded-full text-[#77717F] hover:bg-[#FAF9FC]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#292431]">
              {step === 1 && "Tell us about you"}
              {step === 2 && "PCOS Diagnosis Status"}
              {step === 3 && "Health Conditions & Routine"}
            </h2>
            <p className="text-xs text-[#77717F] mt-0.5">
              {step === 1 && "Let's set up your foundational health metrics."}
              {step === 2 && "Helps us calibrate clinical thresholds and Rotterdam models."}
              {step === 3 && "Select any conditions or supplements you currently take."}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[65vh]">
          {/* STEP 1: Biometrics */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292431] mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292431] mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="13"
                  max="65"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#292431] mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="120"
                    max="220"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) || 160 })}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292431] mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 60 })}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF9FC] border border-[#EFEAF4] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#77717F] block">Calculated BMI</span>
                  <span className="text-base font-bold text-[#7950A8]">{bmi} kg/m²</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#EDE5F7] text-[#7950A8] font-semibold">
                  {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal BMI' : bmi < 30 ? 'Overweight' : 'Higher BMI'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: PCOS Status */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#292431] mb-1">
                Have you been clinically diagnosed with PCOS or PCOD?
              </label>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'Diagnosed',
                    title: 'Formally Diagnosed by Doctor',
                    desc: 'Confirmed by a gynecologist or endocrinologist via ultrasound or lab tests.'
                  },
                  {
                    id: 'Not diagnosed',
                    title: 'Not Diagnosed / Exploring Symptoms',
                    desc: 'I experience symptoms and want to understand my health patterns better.'
                  },
                  {
                    id: 'Unsure',
                    title: 'Unsure / In Assessment',
                    desc: 'I have had tests done but no clear diagnosis was provided.'
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setFormData({ ...formData, pcosStatus: item.id })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.pcosStatus === item.id
                        ? 'border-[#7950A8] bg-[#EDE5F7]/30 ring-1 ring-[#7950A8]'
                        : 'border-[#EFEAF4] hover:bg-[#FAF9FC]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#292431]">{item.title}</span>
                      {formData.pcosStatus === item.id && (
                        <div className="w-5 h-5 rounded-full bg-[#7950A8] text-white flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#77717F] mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>

              {formData.pcosStatus === 'Diagnosed' && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#292431] mb-1">
                    Year of Diagnosis (Optional)
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max="2026"
                    value={formData.diagnosisYear}
                    onChange={(e) => setFormData({ ...formData, diagnosisYear: parseInt(e.target.value) || 2023 })}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8]"
                    placeholder="e.g. 2023"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Conditions & Medications */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292431] mb-1.5">
                  Existing Medical Conditions (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {conditionOptions.map((cond) => {
                    const isSelected = formData.medicalConditions?.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleArrayItem('medicalConditions', cond)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-[#EDE5F7] text-[#7950A8] border-[#7950A8] font-semibold'
                            : 'bg-white text-[#77717F] border-[#EFEAF4] hover:bg-[#FAF9FC]'
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#292431] mb-1.5">
                  Current Medications & Supplements
                </label>
                <div className="flex flex-wrap gap-2">
                  {medicationOptions.map((med) => {
                    const isSelected = formData.medications?.includes(med);
                    return (
                      <button
                        key={med}
                        type="button"
                        onClick={() => toggleArrayItem('medications', med)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-[#FBEAF3] text-[#A6417A] border-[#A6417A] font-semibold'
                            : 'bg-white text-[#77717F] border-[#EFEAF4] hover:bg-[#FAF9FC]'
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {med}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#FAF9FC] bg-gradient-to-t from-[#FAF9FC] to-white flex items-center justify-between">
          <span className="text-xs text-[#77717F]">Step {step} of 3</span>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7950A8] text-white text-xs sm:text-sm font-semibold hover:bg-[#694195] transition-all shadow-xs"
          >
            <span>{step === 3 ? 'Save Profile' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
