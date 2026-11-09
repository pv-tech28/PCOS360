import React, { useState } from 'react';
import {
  Dna,
  ShieldAlert,
  Info,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { rotterdamFeatures, phenotypesList, userClinicalAssessment } from '../data/phenotypesData';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';
import { useHealth } from '../context/HealthContext';

export default function ClinicalExplorerPage() {
  const { profile, setActiveScreen } = useHealth();
  const [selectedPhenotypeId, setSelectedPhenotypeId] = useState('phenotype-b');

  const selectedPhenotype = phenotypesList.find(p => p.id === selectedPhenotypeId) || phenotypesList[0];

  // Radar chart data comparing User's profile vs selected phenotype
  const radarData = [
    { subject: 'Androgen Excess', user: 80, phenotype: selectedPhenotype.radarMetrics.androgenExcess },
    { subject: 'Ovulatory Delay', user: 85, phenotype: selectedPhenotype.radarMetrics.ovulatoryIrregularity },
    { subject: 'Metabolic Load', user: 70, phenotype: selectedPhenotype.radarMetrics.metabolicSensitivity },
    { subject: 'Follicle Density', user: 0, phenotype: selectedPhenotype.radarMetrics.follicularDensity }, // Missing ultrasound
    { subject: 'Symptom Fluctuation', user: 65, phenotype: selectedPhenotype.radarMetrics.symptomVariability },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">Clinical Explorer</h2>
            <Badge variant="teal" size="xs">PCOS GENOME</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Rotterdam Consensus criteria breakdown: explore the 4 recognized clinical phenotypes and compare your documented records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">Rotterdam 2003 / Monash 2023 Guidelines</Badge>
        </div>
      </div>

      {/* Rotterdam Diagnostic Criteria Checklist (Available vs Missing) */}
      <div className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#292431]">Your Rotterdam Diagnostic Pillars</h3>
            <p className="text-xs text-[#77717F]">PCOS clinical definition requires at least 2 of these 3 features</p>
          </div>
          <span className="text-xs text-[#7950A8] font-semibold bg-[#EDE5F7] px-3 py-1 rounded-full">
            2 of 3 Criteria Documented
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rotterdamFeatures.map((feat) => {
            const isMissing = feat.userStatus.includes('Missing');
            return (
              <div
                key={feat.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isMissing
                    ? 'border-dashed border-amber-300 bg-amber-50/40'
                    : 'border-[#DFCDEE] bg-[#FAF9FC]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#7950A8] bg-[#EDE5F7] px-2 py-0.5 rounded">
                    {feat.code}
                  </span>
                  <Badge variant={isMissing ? 'amber' : 'green'} size="xs">
                    {feat.userStatus}
                  </Badge>
                </div>

                <h4 className="text-xs font-bold text-[#292431]">{feat.name}</h4>
                <p className="text-[11px] text-[#77717F] mt-1 leading-relaxed">{feat.description}</p>

                <div className="mt-3 pt-2 border-t border-[#FAF9FC] text-[10px] text-[#553878]">
                  <strong>Evidence:</strong> {feat.confidence}
                </div>

                {isMissing && (
                  <button
                    onClick={() => setActiveScreen('care-gaps')}
                    className="w-full mt-2.5 py-1.5 text-[11px] font-semibold text-amber-800 bg-amber-100/70 hover:bg-amber-100 rounded-lg transition-all"
                  >
                    Action: Address in Care Gaps
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phenotype Selection & Interactive Exploration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phenotypes List (A, B, C, D) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#292431] uppercase tracking-wider px-1">
            Explore 4 Clinical Presentations
          </h3>

          {phenotypesList.map((pt) => {
            const isSelected = selectedPhenotypeId === pt.id;
            const isCandidate = pt.id === 'phenotype-b';

            return (
              <div
                key={pt.id}
                onClick={() => setSelectedPhenotypeId(pt.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#7950A8] bg-white ring-2 ring-[#7950A8]/20 shadow-sm'
                    : 'border-[#EFEAF4] bg-white hover:border-[#DFCDEE]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center font-bold text-xs">
                      {pt.code}
                    </span>
                    <span className="text-xs font-bold text-[#292431]">{pt.name}</span>
                  </div>
                  {isCandidate && (
                    <Badge variant="purple" size="xs">Your Records Match</Badge>
                  )}
                </div>
                <p className="text-[11px] text-[#77717F] mt-1.5">{pt.subtitle}</p>
                <p className="text-[10px] text-[#9E98A8] mt-1">Prevalence: {pt.prevalence}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Phenotype Deep-Dive Details */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FAF9FC]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#292431]">{selectedPhenotype.name}</h3>
                  <Badge variant="purple" size="xs">Rotterdam Criteria</Badge>
                </div>
                <p className="text-xs text-[#7950A8] font-medium mt-0.5">{selectedPhenotype.subtitle}</p>
              </div>
              <span className="text-xs text-[#77717F] bg-[#FAF9FC] px-3 py-1 rounded-full border border-[#EFEAF4]">
                {selectedPhenotype.prevalence}
              </span>
            </div>

            <p className="text-xs text-[#292431] leading-relaxed">
              {selectedPhenotype.description}
            </p>

            {/* Radar Comparison Chart */}
            <div className="p-4 bg-[#FAF9FC] rounded-2xl border border-[#EFEAF4]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#292431]">Clinical Characteristic Profile</span>
                <span className="text-[10px] text-[#77717F]">User Logged Data vs Typical Phenotype Pattern</span>
              </div>
              <div className="h-56 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#EFEAF4" />
                    <PolarAngleAxis dataKey="subject" stroke="#77717F" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#C9C2D4" fontSize={9} />
                    <Radar
                      name="Your Recorded Metrics"
                      dataKey="user"
                      stroke="#7950A8"
                      fill="#7950A8"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name={selectedPhenotype.name}
                      dataKey="phenotype"
                      stroke="#A6417A"
                      fill="#A6417A"
                      fillOpacity={0.2}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-[#77717F] text-center italic mt-1">
                *Follicle density displays as 0 because pelvic ultrasound imaging has not yet been uploaded.
              </p>
            </div>

            {/* Clinical Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white border border-[#EFEAF4]">
                <span className="text-xs font-bold text-[#7950A8] block">Metabolic Tendency</span>
                <p className="text-xs text-[#77717F] mt-1 leading-relaxed">{selectedPhenotype.metabolicRisk}</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#EFEAF4]">
                <span className="text-xs font-bold text-[#1B7878] block">Evidence-Based Clinical Focus</span>
                <p className="text-xs text-[#77717F] mt-1 leading-relaxed">{selectedPhenotype.managementFocus}</p>
              </div>
            </div>
          </div>

          <EthicalDisclaimer type="clinical" className="mt-4" title="Strictly Educational Explorer">
            {userClinicalAssessment.ethicalNotice}
          </EthicalDisclaimer>
        </div>
      </div>
    </div>
  );
}
