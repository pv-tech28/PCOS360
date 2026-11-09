import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  LineChart,
  Activity,
  Dna,
  Sparkles,
  FileText,
  Sliders,
  Stethoscope,
  BookOpen,
  Clock,
  AlertCircle,
  Settings,
  HelpCircle,
  User,
  LogOut
} from 'lucide-react';
import Logo from '../common/Logo';
import { useHealth } from '../../context/HealthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const {
    activeScreen,
    setActiveScreen,
    careGaps,
    profile,
    setIsOnboardingOpen,
    setIsAuthModalOpen,
    isUserLoggedIn
  } = useHealth();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'health-tracker', label: 'Health Tracker', icon: CalendarCheck },
    { id: 'pcoscope', label: 'PCOSCOPE', sublabel: 'Pattern Discovery', icon: LineChart },
    { id: 'metabolic-health', label: 'Metabolic Health', sublabel: 'PCOS PREDICT', icon: Activity },
    { id: 'clinical-explorer', label: 'Clinical Explorer', sublabel: 'PCOS GENOME', icon: Dna },
    { id: 'ai-insights', label: 'AI Insights', sublabel: 'PCOS EXPLAIN', icon: Sparkles },
    { id: 'lab-reports', label: 'Lab Reports', sublabel: 'Decoder', icon: FileText },
    { id: 'what-if', label: 'What-If Simulator', icon: Sliders },
    { id: 'consultation-copilot', label: 'Consultation Copilot', icon: Stethoscope },
    { id: 'learning-hub', label: 'PCOS Learning Hub', sublabel: 'Myth Buster', icon: BookOpen },
    { id: 'timeline', label: 'Health Timeline', icon: Clock },
    {
      id: 'care-gaps',
      label: 'Care Gap Detector',
      icon: AlertCircle,
      badge: careGaps.length > 0 ? careGaps.length : null,
      badgeVariant: 'amber'
    },
    { id: 'settings', label: 'Settings & Profile', icon: Settings }
  ];

  const handleNavClick = (id) => {
    setActiveScreen(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#292431]/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-[#EFEAF4] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#F4EFFB]">
          <Logo size="md" showTagline={true} />
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#9E98A8] uppercase">
            Intelligence Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#EDE5F7] text-[#7950A8] font-semibold shadow-xs'
                    : 'text-[#292431] hover:bg-[#FAF9FC] hover:text-[#7950A8]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-[#7950A8]' : 'text-[#77717F] group-hover:text-[#7950A8]'
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <div className="truncate">
                    <span className="text-sm block truncate">{item.label}</span>
                    {item.sublabel && (
                      <span className={`text-[10px] block font-medium -mt-0.5 truncate ${
                        isActive ? 'text-[#7950A8]/80' : 'text-[#9E98A8]'
                      }`}>
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      item.badgeVariant === 'amber'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#7950A8] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-[#F4EFFB] bg-[#FAF9FC]/70">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-[#EFEAF4]">
            <div
              className="flex items-center gap-3 min-w-0 cursor-pointer"
              onClick={() => setIsOnboardingOpen(true)}
              title="Click to view or edit health profile"
            >
              <div className="w-9 h-9 rounded-full bg-[#EDE5F7] flex items-center justify-center font-bold text-sm text-[#7950A8] border border-[#DFCDEE] shrink-0">
                {profile.name ? profile.name.charAt(0) : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#292431] truncate">{profile.name}</p>
                <p className="text-[10px] text-[#77717F] truncate">
                  {profile.pcosStatus} • {profile.age} yrs
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-1.5 rounded-lg text-[#77717F] hover:text-[#7950A8] hover:bg-[#EDE5F7]/50"
              title={isUserLoggedIn ? "Account Switch / Sign Out" : "Sign In"}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
