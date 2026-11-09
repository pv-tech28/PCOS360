import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  PlusCircle,
  Moon,
  Zap,
  Activity,
  Heart,
  Droplets,
  Pill,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function TrackerPage() {
  const {
    cycleData,
    profile,
    setIsLogModalOpen,
    recentActivities
  } = useHealth();

  const [selectedCycleTab, setSelectedCycleTab] = useState('current');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">Daily Health & Cycle Tracker</h2>
            <Badge variant="pink" size="xs">Phase: {cycleData.phase}</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Log your daily symptoms, sleep hours, stress, and monitor menstrual cycle regularities.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Today's Symptoms</span>
        </button>
      </div>

      {/* Cycle Overview & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cycle Wheel / Bar */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#292431]">Current Cycle: Day {cycleData.currentDay}</h3>
              <p className="text-xs text-[#77717F]">Expected length: {cycleData.totalDays} days (Based on 35-day average)</p>
            </div>
            <span className="text-xs font-bold text-[#7950A8] bg-[#EDE5F7] px-3 py-1 rounded-full">
              Luteal Phase
            </span>
          </div>

          {/* Interactive Visual Cycle Strip */}
          <div className="p-4 bg-[#FAF9FC] rounded-2xl border border-[#EFEAF4] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#292431]">
              <span>Day 1 (Period)</span>
              <span className="text-[#A6417A]">Day 17 (Ovulation Window)</span>
              <span>Day 35 (Next Period)</span>
            </div>

            <div className="w-full h-4 rounded-full bg-white border border-[#EFEAF4] overflow-hidden p-0.5 flex">
              <div className="h-full bg-rose-400 rounded-l-full" style={{ width: '17%' }} title="Menstrual Flow (Days 1-6)" />
              <div className="h-full bg-purple-200" style={{ width: '31%' }} title="Follicular Phase (Days 7-17)" />
              <div className="h-full bg-[#7950A8]" style={{ width: '52%' }} title="Luteal Phase (Days 18-35)" />
            </div>

            <div className="flex justify-between text-[11px] text-[#77717F]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Menses (6d)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-200" /> Follicular
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#7950A8]">
                <span className="w-2 h-2 rounded-full bg-[#7950A8]" /> Current (Luteal)
              </span>
            </div>
          </div>

          {/* Clinical Cycle Phase Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl border border-[#EFEAF4] bg-white">
              <span className="text-xs font-bold text-[#7950A8] block">Hormonal Profile</span>
              <p className="text-xs text-[#77717F] mt-1 leading-relaxed">
                Progesterone is elevated post-ovulation. In women with PCOS, luteal phase length may fluctuate depending on follicular maturity.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#EFEAF4] bg-white">
              <span className="text-xs font-bold text-[#1B7878] block">Self-Care & Nutrition Tip</span>
              <p className="text-xs text-[#77717F] mt-1 leading-relaxed">
                Prioritize magnesium-rich foods (pumpkin seeds, spinach) and healthy fats to buffer evening carbohydrate cravings.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Cycle History Log */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#FAF9FC]">
              <h3 className="text-sm font-bold text-[#292431]">Cycle History</h3>
              <span className="text-xs text-[#77717F]">Last 4 Cycles</span>
            </div>

            {cycleData.history?.map((c, idx) => (
              <div key={idx} className="p-3 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#292431]">{c.cycle}</p>
                  <p className="text-[11px] text-[#77717F]">{c.flowDays} days flow</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#7950A8]">{c.length} days</span>
                  <Badge variant={c.status === 'Regular' ? 'green' : c.status === 'Improving' ? 'teal' : 'neutral'} size="xs" className="block mt-0.5">
                    {c.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#FAF9FC] text-[11px] text-[#77717F]">
            Cycles between 24–38 days are classified as normal reproductive intervals under Monash 2023 guidelines.
          </div>
        </div>
      </div>

      {/* Logged Daily Records Table */}
      <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#292431]">Recent Health Activity Logs</h3>
            <p className="text-xs text-[#77717F]">Daily entries contributing to PCOSCOPE pattern discovery</p>
          </div>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="text-xs font-semibold text-[#7950A8] hover:underline"
          >
            + Add New Log
          </button>
        </div>

        <div className="space-y-2">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-3.5 rounded-2xl border border-[#EFEAF4] hover:bg-[#FAF9FC] transition-colors flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center font-bold">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#292431] block">{act.title}</span>
                  <span className="text-[11px] text-[#77717F] block">{act.detail}</span>
                </div>
              </div>
              <span className="text-[11px] text-[#9E98A8] shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      <EthicalDisclaimer title="Cycle Variation Context">
        Menstrual cycle intervals naturally vary due to stress, travel, illness, and metabolic shifts. Consistent tracking over 3–6 months gives the most accurate clinical clarity.
      </EthicalDisclaimer>
    </div>
  );
}
