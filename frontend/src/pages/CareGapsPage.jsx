import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
  Activity,
  Stethoscope,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function CareGapsPage() {
  const {
    careGaps,
    resolveCareGap,
    setActiveScreen,
    setIsLogModalOpen,
    setIsLabUploadModalOpen
  } = useHealth();

  const handleAction = (gap) => {
    if (gap.id === 'gap-1') {
      setIsLabUploadModalOpen(true);
    } else if (gap.id === 'gap-2') {
      setActiveScreen('consultation-copilot');
    } else if (gap.id === 'gap-3') {
      setIsLogModalOpen(true);
    } else if (gap.id === 'gap-4') {
      setActiveScreen('clinical-explorer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">Care Gap Detector</h2>
            <Badge variant="amber" size="xs">
              {careGaps.length} Action{careGaps.length === 1 ? '' : 's'} Due
            </Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Find what's missing in your PCOS care and stay on track with international follow-up recommendations.
          </p>
        </div>

        <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>Care Monitoring Guidelines</span>
        </span>
      </div>

      {/* Care Gaps Cards List matching Mockup Screen 10 */}
      <div className="space-y-4">
        {careGaps.map((gap) => {
          let Icon = AlertTriangle;
          let iconColor = 'text-amber-600';
          let iconBg = 'bg-amber-50';

          if (gap.category === 'Clinical') {
            Icon = Stethoscope;
            iconColor = 'text-[#7950A8]';
            iconBg = 'bg-[#EDE5F7]';
          } else if (gap.category === 'Tracking') {
            Icon = Clock;
            iconColor = 'text-[#A6417A]';
            iconBg = 'bg-[#FBEAF3]';
          } else if (gap.category === 'Diagnostic') {
            Icon = FileText;
            iconColor = 'text-[#1B7878]';
            iconBg = 'bg-[#E6F7F7]';
          }

          return (
            <div
              key={gap.id}
              className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs hover:border-[#DFCDEE] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-[#292431]">{gap.title}</h3>
                    <Badge variant={gap.severity === 'High' ? 'red' : gap.severity === 'Medium' ? 'amber' : 'neutral'} size="xs">
                      {gap.dueText}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#77717F] leading-relaxed max-w-2xl">{gap.description}</p>

                  {/* Suggested questions for doctor if applicable */}
                  {gap.suggestedQuestions?.length > 0 && (
                    <div className="pt-2 text-[11px] text-[#553878]">
                      <span className="font-semibold block">Suggested Discussion Point:</span>
                      <span className="italic">"{gap.suggestedQuestions[0]}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => resolveCareGap(gap.id)}
                  className="px-3 py-2 text-xs font-semibold text-[#77717F] hover:bg-[#FAF9FC] rounded-xl border border-[#EFEAF4] transition-all"
                  title="Mark as addressed"
                >
                  <Check className="w-4 h-4 inline mr-1" /> Dismiss
                </button>

                <button
                  onClick={() => handleAction(gap)}
                  className="px-5 py-2.5 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{gap.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {careGaps.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EFEAF4] p-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#292431]">No Open Care Gaps!</h3>
            <p className="text-xs text-[#77717F] max-w-md mx-auto">
              All your routine follow-ups, metabolic screenings, and daily symptom records are up to date under international guidelines.
            </p>
          </div>
        )}
      </div>

      <EthicalDisclaimer title="Clinical Care Guidelines Reference">
        Care gaps are identified in accordance with international evidence-based recommendations (Monash 2023 Guidelines). Regular metabolic and clinical evaluations lower risks of undetected insulin resistance and cardiovascular dyslipidemia.
      </EthicalDisclaimer>
    </div>
  );
}
