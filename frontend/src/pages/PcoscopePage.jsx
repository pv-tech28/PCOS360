import React, { useState } from 'react';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Brain,
  Moon,
  Zap,
  Activity,
  AlertCircle,
  HelpCircle,
  Sparkles,
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
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useHealth } from '../context/HealthContext';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function PcoscopePage() {
  const { symptomTrends, correlations, setIsLogModalOpen } = useHealth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'correlations' | 'trends'
  const [selectedMetric, setSelectedMetric] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header with Subtabs matching Mockup Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">PCOSCOPE</h2>
            <Badge variant="purple" size="xs">Pattern Discovery</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Analyzing multi-variable associations across sleep, stress, menstrual cycle, and reported symptoms.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center p-1 bg-[#FAF9FC] rounded-2xl border border-[#EFEAF4]">
          {['overview', 'correlations', 'trends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#7950A8] text-white shadow-xs'
                  : 'text-[#77717F] hover:text-[#292431]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {(activeTab === 'overview' || activeTab === 'trends') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Pattern Insights (Matches Mockup Screen 4) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl border border-[#EFEAF4] p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#7950A8]" />
                <h3 className="text-sm font-bold text-[#292431]">Key Observed Insights</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#FAF9FC] rounded-2xl border border-[#EFEAF4] hover:border-[#DFCDEE] transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#292431]">
                    <Moon className="w-3.5 h-3.5 text-[#7950A8]" />
                    <span>Sleep & Fatigue Link</span>
                  </div>
                  <p className="text-xs text-[#77717F] mt-1 leading-relaxed">
                    Lower sleep (&lt;6 hrs) is strongly linked with higher daytime fatigue scores (r = +0.78).
                  </p>
                  <span className="inline-block mt-2 text-[10px] bg-[#EDE5F7] text-[#7950A8] px-2 py-0.5 rounded font-semibold">
                    Statistical Pattern • 45 logs
                  </span>
                </div>

                <div className="p-3.5 bg-[#FAF9FC] rounded-2xl border border-[#EFEAF4] hover:border-[#DFCDEE] transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#292431]">
                    <Zap className="w-3.5 h-3.5 text-[#A6417A]" />
                    <span>Stress & Cycle Interval</span>
                  </div>
                  <p className="text-xs text-[#77717F] mt-1 leading-relaxed">
                    Sustained stress spikes coincide with 3–5 day longer cycle lengths in past 4 cycles.
                  </p>
                  <span className="inline-block mt-2 text-[10px] bg-[#FBEAF3] text-[#A6417A] px-2 py-0.5 rounded font-semibold">
                    Moderate Correlation (0.64)
                  </span>
                </div>

                <div className="p-3.5 bg-[#FAF9FC] rounded-2xl border border-[#EFEAF4] hover:border-[#DFCDEE] transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#292431]">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Inositol Adherence</span>
                  </div>
                  <p className="text-xs text-[#77717F] mt-1 leading-relaxed">
                    Cycles with &gt;90% inositol compliance had shorter cycle variation (34 vs 38 days).
                  </p>
                  <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                    Positive Routine Effect
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="w-full py-3 bg-[#EDE5F7] text-[#7950A8] font-bold text-xs rounded-2xl border border-[#DFCDEE] hover:bg-[#E3D6F2] transition-all"
            >
              + Log Today to Update Patterns
            </button>
          </div>

          {/* Symptom Trend Chart (Last 6 Months) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#292431]">Symptom Trends (Last 6 Months)</h3>
                  <p className="text-xs text-[#77717F]">Visualized on a standardized 1–10 severity scale</p>
                </div>

                <div className="flex items-center gap-1 bg-[#FAF9FC] p-1 rounded-xl border border-[#EFEAF4] text-[11px]">
                  <button
                    onClick={() => setSelectedMetric('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold ${selectedMetric === 'all' ? 'bg-white text-[#7950A8] shadow-2xs' : 'text-[#77717F]'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedMetric('fatigue')}
                    className={`px-2.5 py-1 rounded-lg font-semibold ${selectedMetric === 'fatigue' ? 'bg-white text-[#7950A8] shadow-2xs' : 'text-[#77717F]'}`}
                  >
                    Fatigue
                  </button>
                  <button
                    onClick={() => setSelectedMetric('acne')}
                    className={`px-2.5 py-1 rounded-lg font-semibold ${selectedMetric === 'acne' ? 'bg-white text-[#7950A8] shadow-2xs' : 'text-[#77717F]'}`}
                  >
                    Acne
                  </button>
                  <button
                    onClick={() => setSelectedMetric('bloating')}
                    className={`px-2.5 py-1 rounded-lg font-semibold ${selectedMetric === 'bloating' ? 'bg-white text-[#7950A8] shadow-2xs' : 'text-[#77717F]'}`}
                  >
                    Bloating
                  </button>
                </div>
              </div>

              {/* Recharts Area / Line Chart */}
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={symptomTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7950A8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#7950A8" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E8B8D0" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#E8B8D0" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2ECF8" />
                    <XAxis dataKey="month" stroke="#9E98A8" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 10]} stroke="#9E98A8" fontSize={11} tickLine={false} />
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

                    {(selectedMetric === 'all' || selectedMetric === 'fatigue') && (
                      <Area
                        type="monotone"
                        dataKey="fatigue"
                        name="Fatigue"
                        stroke="#7950A8"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#purpleGrad)"
                      />
                    )}
                    {(selectedMetric === 'all' || selectedMetric === 'acne') && (
                      <Line
                        type="monotone"
                        dataKey="acne"
                        name="Acne"
                        stroke="#A6417A"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    )}
                    {(selectedMetric === 'all' || selectedMetric === 'bloating') && (
                      <Line
                        type="monotone"
                        dataKey="bloating"
                        name="Bloating"
                        stroke="#B26B00"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                      />
                    )}
                    {(selectedMetric === 'all') && (
                      <Line
                        type="monotone"
                        dataKey="sleepHours"
                        name="Sleep (hrs)"
                        stroke="#1B7878"
                        strokeWidth={1.8}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <EthicalDisclaimer className="mt-4" title="Statistical Association vs Causality">
              Observed correlations describe co-occurrence in your logged routines. They demonstrate personal patterns and do not prove definitive medical causation.
            </EthicalDisclaimer>
          </div>
        </div>
      )}

      {/* CORRELATIONS TAB */}
      {(activeTab === 'correlations' || activeTab === 'overview') && (
        <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#292431]">Lifestyle Correlation Matrix</h3>
              <p className="text-xs text-[#77717F]">Calculated across your last 6 months of daily health entries</p>
            </div>
            <Badge variant="teal" size="sm">Pearson r Coefficients</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {correlations.map((corr, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-[#EFEAF4] bg-[#FAF9FC]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7950A8]">{corr.factorA}</span>
                  <span className="text-xs font-black text-[#292431] bg-white px-2 py-0.5 rounded-md border border-[#EFEAF4]">
                    {corr.strength}
                  </span>
                </div>
                <div className="text-[11px] text-[#292431] font-semibold">↔ {corr.factorB}</div>
                <p className="text-xs text-[#77717F] leading-relaxed">{corr.description}</p>
                <div className="pt-2 border-t border-[#FAF9FC] text-[11px] text-[#553878]">
                  <strong>Routine Focus:</strong> {corr.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
