import React from 'react';
import {
  Calendar,
  LineChart,
  Activity,
  Dna,
  Sparkles,
  ArrowRight,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  FileText,
  Stethoscope,
  Heart
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Card, Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function OverviewPage() {
  const {
    profile,
    cycleData,
    recentActivities,
    insights,
    careGaps,
    setActiveScreen,
    setIsLogModalOpen,
    setIsOnboardingOpen,
    labReports
  } = useHealth();

  const cyclePercent = Math.min(100, Math.round((cycleData.currentDay / cycleData.totalDays) * 100));

  const intelligenceModules = [
    {
      id: 'pcoscope',
      title: 'PCOSCOPE',
      subtitle: 'Pattern Insights',
      icon: LineChart,
      color: '#7950A8',
      bg: '#EDE5F7',
      desc: 'Correlate sleep, stress & symptoms'
    },
    {
      id: 'metabolic-health',
      title: 'Metabolic Health',
      subtitle: 'Lab & Trends',
      icon: Activity,
      color: '#A6417A',
      bg: '#FBEAF3',
      desc: 'Glucose, HbA1c & lipid tracking'
    },
    {
      id: 'clinical-explorer',
      title: 'Clinical Explorer',
      subtitle: 'PCOS Profiles',
      icon: Dna,
      color: '#1B7878',
      bg: '#E6F7F7',
      desc: 'Rotterdam presentation analysis'
    },
    {
      id: 'consultation-copilot',
      title: 'Consultation Copilot',
      subtitle: 'Doctor Visit Summary',
      icon: Stethoscope,
      color: '#B26B00',
      bg: '#FEF6E6',
      desc: 'Ready clinical summaries & questions'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-[#F8F4FC] p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#292431]">
              Hi, {(profile.name || 'there').split(' ')[0]} 👋
            </h2>
            <Badge variant="purple" size="xs">
              {profile.pcosStatus}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#77717F] mt-1">
            Here's your comprehensive health overview and pattern intelligence for today.
          </p>
        </div>

        {/* Profile Quick Stats Pill */}
        <div
          onClick={() => setIsOnboardingOpen(true)}
          className="flex items-center gap-3 p-2.5 px-4 bg-white rounded-2xl border border-[#EFEAF4] hover:border-[#DFCDEE] transition-all cursor-pointer shrink-0 shadow-2xs"
          title="Click to view/edit profile"
        >
          <div className="text-right">
            <p className="text-xs font-bold text-[#292431]">
              {profile.initialized
                ? `${profile.age} yrs • ${profile.heightCm} cm • ${profile.weightKg} kg`
                : 'Profile not set up yet'}
            </p>
            <p className="text-[11px] text-[#7950A8] font-medium">
              {profile.initialized ? `Status: ${profile.pcosStatus}` : 'Click to initialize'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9E98A8]" />
        </div>
      </div>

      {/* Primary Row: Cycle Progress + Care Gap Notification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cycle Progress Card (Matches Mockup Screen 3) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#292431]">Cycle Progress</h3>
                <p className="text-xs text-[#77717F]">{cycleData.phase}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('health-tracker')}
              className="text-xs font-semibold text-[#7950A8] hover:underline flex items-center gap-1"
            >
              <span>Cycle Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#292431]">
                Day {cycleData.currentDay} <span className="text-sm font-normal text-[#77717F]">of {cycleData.totalDays}</span>
              </span>
              <span className="text-xs font-semibold text-[#7950A8]">
                {cyclePercent}% Completed
              </span>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full h-3 rounded-full bg-[#FAF9FC] border border-[#EFEAF4] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#EDE5F7] via-[#A87AC9] to-[#7950A8] transition-all duration-700"
                style={{ width: `${cyclePercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-[#77717F] pt-1">
              <span>Day 1 (Period Start)</span>
              <span className="text-[#A6417A] font-medium">Ovulation ~ Day 17</span>
              <span>Next Expected: {cycleData.nextPeriodEstimated}</span>
            </div>
          </div>

          <p className="text-xs text-[#553878] bg-[#FAF9FC] p-3 rounded-2xl border border-[#EFEAF4] mt-4 leading-relaxed">
            💡 <span className="font-semibold">{cycleData.phase}:</span> {cycleData.phaseDescription}
          </p>
        </div>

        {/* Care Gaps Summary Alert */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#292431]">Care Gap Alerts</h3>
              </div>
              <Badge variant="amber" size="xs">
                {careGaps.length} Action{careGaps.length === 1 ? '' : 's'}
              </Badge>
            </div>

            {careGaps.length > 0 ? (
              <div className="space-y-3 mt-3">
                <div className="p-3 bg-[#FAF9FC] rounded-2xl border border-[#EFEAF4]">
                  <p className="text-xs font-bold text-[#292431]">{careGaps[0].title}</p>
                  <p className="text-[11px] text-[#77717F] mt-0.5 line-clamp-2">{careGaps[0].description}</p>
                  <span className="inline-block mt-2 text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {careGaps[0].dueText}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#77717F] mt-4">All proactive screenings and logs are up to date! Great consistency.</p>
            )}
          </div>

          <button
            onClick={() => setActiveScreen('care-gaps')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-[#FAF9FC] hover:bg-[#EDE5F7]/50 text-[#7950A8] text-xs font-semibold border border-[#EFEAF4] hover:border-[#DFCDEE] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Review All Care Gaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Access to the Four Main Intelligence Modules (Matches Mockup Screen 3 Grid) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#292431] uppercase tracking-wider">
            Core Intelligence Modules
          </h3>
          <span className="text-xs text-[#77717F]">Click to explore deep analysis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {intelligenceModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => setActiveScreen(mod.id)}
                className="bg-white rounded-3xl border border-[#EFEAF4] p-5 hover:border-[#DFCDEE] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: mod.bg, color: mod.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#292431] group-hover:text-[#7950A8] transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs font-medium text-[#7950A8]">{mod.subtitle}</p>
                  <p className="text-xs text-[#77717F] mt-2 leading-relaxed">{mod.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#FAF9FC] flex items-center justify-between text-xs font-semibold text-[#7950A8]">
                  <span>Explore Module</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split Row: Latest AI Insights & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest AI Insights with Explain trigger */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#292431]">Latest AI Insights</h3>
            </div>
            <button
              onClick={() => setActiveScreen('ai-insights')}
              className="text-xs font-semibold text-[#7950A8] hover:underline flex items-center gap-1"
            >
              <span>Explain Reasoning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {insights.length === 0 ? (
              <div className="p-4 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/60 text-xs text-[#77717F]">
                No personalized insights yet. Complete your profile, log daily symptoms, or upload lab biomarkers to populate your overview.
              </div>
            ) : (
              insights.slice(0, 2).map((insight) => (
                <div
                  key={insight.id}
                  onClick={() => setActiveScreen('ai-insights')}
                  className="p-4 rounded-2xl border border-[#EFEAF4] hover:border-[#DFCDEE] bg-[#FAF9FC]/50 hover:bg-[#FAF9FC] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7950A8] bg-[#EDE5F7] px-2 py-0.5 rounded-md">
                      {insight.module}
                    </span>
                    <span className="text-[11px] text-[#9E98A8]">{insight.confidence}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#292431] mt-1">{insight.title}</h4>
                  <p className="text-xs text-[#77717F] mt-1 leading-relaxed">{insight.summary}</p>
                  <p className="text-xs text-[#553878] mt-2 font-medium">✨ Recommendation: {insight.actionableTip}</p>
                </div>
              ))
            )}
          </div>

          <EthicalDisclaimer className="mt-4" title="Decision-Support Only">
            Insights highlight statistically observed patterns and guideline reference values. Not medical diagnosis.
          </EthicalDisclaimer>
        </div>

        {/* Recent Health Activity */}
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF9FC] text-[#7950A8] flex items-center justify-center border border-[#EFEAF4]">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#292431]">Recent Activity</h3>
              </div>

              <button
                onClick={() => setIsLogModalOpen(true)}
                className="text-xs font-semibold text-[#7950A8] hover:underline"
              >
                + Log
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-[#77717F] py-3">
                  No recent activity logged to this account yet.
                </p>
              ) : (
                recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF9FC] transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center shrink-0 mt-0.5">
                      {act.type === 'log' ? <Heart className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#292431] truncate">{act.title}</p>
                      <p className="text-[11px] text-[#77717F] truncate">{act.detail}</p>
                      <span className="text-[10px] text-[#9E98A8] block mt-0.5">{act.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveScreen('timeline')}
            className="w-full mt-4 py-2 text-xs font-semibold text-[#7950A8] bg-[#FAF9FC] hover:bg-[#EDE5F7]/40 rounded-xl border border-[#EFEAF4] transition-all"
          >
            View Full Health Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
