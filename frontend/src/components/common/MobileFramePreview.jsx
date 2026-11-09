import React from 'react';
import {
  Home,
  Calendar,
  LineChart,
  BookOpen,
  Wifi,
  Battery,
  Bell,
  ChevronLeft,
  Share2
} from 'lucide-react';
import Logo from './Logo';
import { useHealth } from '../../context/HealthContext';

export default function MobileFramePreview({ children }) {
  const {
    activeScreen,
    setActiveScreen,
    setViewMode,
    notifications,
    setIsLogModalOpen
  } = useHealth();

  const bottomTabs = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'health-tracker', label: 'Track', icon: Calendar },
    { id: 'pcoscope', label: 'Insights', icon: LineChart },
    { id: 'learning-hub', label: 'Learn', icon: BookOpen },
  ];

  const quickScreens = [
    { id: 'overview', name: 'Dashboard' },
    { id: 'health-tracker', name: 'Cycle Track' },
    { id: 'pcoscope', name: 'PCOSCOPE' },
    { id: 'metabolic-health', name: 'Metabolic' },
    { id: 'clinical-explorer', name: 'Genome' },
    { id: 'ai-insights', name: 'Explain AI' },
    { id: 'lab-reports', name: 'Lab Decoder' },
    { id: 'what-if', name: 'What-If' },
    { id: 'consultation-copilot', name: 'Copilot' },
    { id: 'learning-hub', name: 'Myth Buster' },
    { id: 'timeline', name: 'Timeline' },
    { id: 'care-gaps', name: 'Care Gaps' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 min-h-[calc(100vh-5rem)]">
      {/* Quick Screen Switcher Bar */}
      <div className="w-full max-w-2xl mb-4 bg-white p-2.5 rounded-2xl border border-[#EFEAF4] shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-[#7950A8] uppercase tracking-wider shrink-0 pl-1">
          Mobile Mockup Screens:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {quickScreens.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScreen(s.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                activeScreen === s.id
                  ? 'bg-[#7950A8] text-white shadow-2xs'
                  : 'bg-[#FAF9FC] text-[#77717F] hover:bg-[#EDE5F7]'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => setViewMode('desktop')}
          className="text-xs font-semibold text-[#7950A8] hover:underline shrink-0 pr-1"
        >
          Exit Preview
        </button>
      </div>

      {/* Phone Hardware Mockup Frame */}
      <div className="w-full max-w-[400px] h-[820px] bg-[#292431] rounded-[52px] p-3.5 shadow-[0_25px_80px_rgba(41,36,49,0.35)] ring-1 ring-white/20 relative flex flex-col">
        {/* Phone Speaker & Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] mr-3" />
          <div className="w-2 h-2 rounded-full bg-[#18233C]" />
        </div>

        {/* Screen Bezel inner content */}
        <div className="w-full h-full bg-[#FAF9FC] rounded-[42px] overflow-hidden flex flex-col relative">
          {/* Top Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-[#292431] z-40 bg-[#FAF9FC]">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Mobile Screen Header */}
          <div className="h-14 px-5 flex items-center justify-between border-b border-[#F4EFFB] bg-white shrink-0">
            {activeScreen !== 'overview' ? (
              <button
                onClick={() => setActiveScreen('overview')}
                className="p-1 -ml-1 text-[#292431]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-5" />
            )}

            <Logo size="sm" showTagline={false} />

            <button
              onClick={() => setActiveScreen('care-gaps')}
              className="p-1 -mr-1 text-[#292431] relative"
            >
              <Bell className="w-5 h-5 text-[#77717F]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#A6417A] rounded-full ring-2 ring-white" />
            </button>
          </div>

          {/* Scrollable Main Screen Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {children}
          </div>

          {/* Bottom Mobile Navigation Bar (Matching Mockup Screen 3) */}
          <div className="h-16 px-6 bg-white border-t border-[#F4EFFB] flex items-center justify-between shrink-0 z-40">
            {bottomTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveScreen(tab.id)}
                  className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
                    isActive ? 'text-[#7950A8]' : 'text-[#9E98A8] hover:text-[#7950A8]'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.8} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Home Indicator bar */}
          <div className="h-4 bg-white flex items-center justify-center pb-1">
            <div className="w-32 h-1 bg-stone-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
