import React, { useState } from 'react';
import {
  Sliders,
  Moon,
  Activity,
  Apple,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function WhatIfPage() {
  const [sleepTarget, setSleepTarget] = useState(8);
  const [exerciseMins, setExerciseMins] = useState(35);
  const [mealConsistency, setMealConsistency] = useState('High'); // 'Low' | 'Moderate' | 'High'
  const [stressManagement, setStressManagement] = useState(true);
  const [simulated, setSimulated] = useState(true);

  // Calculate habit resilience score (0-100)
  const calculateHabitScore = () => {
    let score = 50;
    if (sleepTarget >= 7.5) score += 18;
    else if (sleepTarget >= 7) score += 10;

    if (exerciseMins >= 30) score += 16;
    else if (exerciseMins >= 20) score += 8;

    if (mealConsistency === 'High') score += 16;
    else if (mealConsistency === 'Moderate') score += 8;

    if (stressManagement) score += 12;

    return Math.min(96, score);
  };

  const habitScore = calculateHabitScore();

  return (
    <div className="space-y-6">
      {/* Header matching Mockup Screen 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">What-If Simulator</h2>
            <Badge variant="purple" size="xs">Lifestyle Habits</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            See how positive habit consistency and daily routine goals influence overall lifestyle resilience.
          </p>
        </div>

        <button
          onClick={() => {
            setSleepTarget(8);
            setExerciseMins(35);
            setMealConsistency('High');
            setStressManagement(true);
          }}
          className="text-xs font-semibold text-[#7950A8] hover:underline flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Recommended Plan</span>
        </button>
      </div>

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Interactive Scenario Controls (Matches Mockup Screen 6) */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-[#292431]">Configure Hypothetical Lifestyle Scenarios</h3>

          {/* 1. Sleep Consistency */}
          <div className="p-4 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#292431]">Improve Sleep Regularity</h4>
                  <p className="text-[11px] text-[#77717F]">Target: 7–8.5 hrs nightly</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#7950A8] bg-white px-2.5 py-1 rounded-lg border border-[#EFEAF4]">
                {sleepTarget} hrs/night
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="9"
              step="0.5"
              value={sleepTarget}
              onChange={(e) => setSleepTarget(parseFloat(e.target.value))}
              className="w-full accent-[#7950A8] bg-[#EDE5F7] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* 2. Regular Physical Activity */}
          <div className="p-4 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FBEAF3] text-[#A6417A] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#292431]">Add Regular Physical Activity</h4>
                  <p className="text-[11px] text-[#77717F]">Strength + Low-Impact Walking</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#A6417A] bg-white px-2.5 py-1 rounded-lg border border-[#EFEAF4]">
                {exerciseMins} min/day
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={exerciseMins}
              onChange={(e) => setExerciseMins(parseInt(e.target.value))}
              className="w-full accent-[#A6417A] bg-[#FBEAF3] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* 3. Balanced Meal Plan Routine */}
          <div className="p-4 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Apple className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#292431]">Balanced Meal Plan</h4>
                  <p className="text-[11px] text-[#77717F]">Protein-buffered & low-glycemic</p>
                </div>
              </div>
              <Badge variant="green" size="xs">{mealConsistency}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {['Low', 'Moderate', 'High'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setMealConsistency(lvl)}
                  className={`py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    mealConsistency === lvl
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-[#77717F] border-[#EFEAF4] hover:bg-[#FAF9FC]'
                  }`}
                >
                  {lvl} Consistency
                </button>
              ))}
            </div>
          </div>

          {/* 4. Stress Down-Regulation */}
          <div className="p-4 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#292431]">Daily Stress Regulation</h4>
                <p className="text-[11px] text-[#77717F]">10-min breathwork or mindful walk</p>
              </div>
            </div>

            <button
              onClick={() => setStressManagement(!stressManagement)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                stressManagement
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-[#77717F] border-[#EFEAF4]'
              }`}
            >
              {stressManagement ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Right Column: Simulated Habit Projections & Goals */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF9FC]">
              <div>
                <h3 className="text-sm font-bold text-[#292431]">Simulated Routine Resilience</h3>
                <p className="text-xs text-[#77717F]">Projected consistency benchmark</p>
              </div>
              <Badge variant="purple" size="sm">Habit Projection</Badge>
            </div>

            {/* Score Ring / Bar */}
            <div className="p-5 bg-gradient-to-br from-[#FAF9FC] to-[#F8F4FC] rounded-2xl border border-[#DFCDEE] text-center">
              <span className="text-xs text-[#77717F] font-semibold block mb-1">
                Projected Routine Adherence Score
              </span>
              <div className="text-4xl font-black text-[#7950A8]">
                {habitScore} <span className="text-base text-[#77717F] font-normal">/ 100</span>
              </div>

              <div className="w-full h-2.5 bg-[#EDE5F7] rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-[#7950A8] rounded-full transition-all duration-500"
                  style={{ width: `${habitScore}%` }}
                />
              </div>

              <p className="text-xs text-[#553878] mt-2 font-medium">
                {habitScore >= 80 ? '🌟 Highly protective lifestyle consistency profile' : 'Consistent baseline routine'}
              </p>
            </div>

            {/* Simulated Habit Outcomes */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-[#292431] block">
                Projected Behavioral Benefits
              </span>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EFEAF4] text-xs">
                <span className="text-[#292431] font-medium">Afternoon Energy Dip Frequency</span>
                <span className="font-bold text-emerald-700">-34% Projected</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EFEAF4] text-xs">
                <span className="text-[#292431] font-medium">Sleep Latency (Time to fall asleep)</span>
                <span className="font-bold text-[#7950A8]">~15 mins faster</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EFEAF4] text-xs">
                <span className="text-[#292431] font-medium">Dietary Blood Sugar Variability</span>
                <span className="font-bold text-emerald-700">Smoother postprandial curve</span>
              </div>
            </div>
          </div>

          <EthicalDisclaimer type="warning" title="Strict Healthcare Guardrail">
            The What-If Simulator projects habit adherence and routine consistency metrics only. It does <strong>NOT</strong> predict hormonal normalization, cycle restoration, or PCOS recovery. Clinical management requires supervision by a licensed gynecologist.
          </EthicalDisclaimer>
        </div>
      </div>
    </div>
  );
}
