import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Calendar,
  PlusCircle,
  Smartphone,
  Monitor,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export default function Navbar({ onMenuToggle }) {
  const {
    activeScreen,
    setActiveScreen,
    cycleData,
    notifications,
    markNotificationRead,
    setIsLogModalOpen,
    setIsOnboardingOpen,
    profile,
    viewMode,
    setViewMode
  } = useHealth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Screen title lookup
  const screenTitles = {
    overview: 'Clinical Dashboard',
    'health-tracker': 'Daily Health & Cycle Tracker',
    pcoscope: 'PCOSCOPE – Personal Pattern Discovery',
    'metabolic-health': 'Metabolic Health – PCOS PREDICT',
    'clinical-explorer': 'Clinical Explorer – PCOS GENOME',
    'ai-insights': 'AI Insights – PCOS EXPLAIN',
    'lab-reports': 'AI Lab Report Decoder',
    'what-if': 'What-If Lifestyle Simulator',
    'consultation-copilot': 'Doctor Consultation Copilot',
    'learning-hub': 'PCOS Learning Hub & Myth Buster',
    timeline: 'My Health Timeline',
    'care-gaps': 'Care Gap Detector',
    settings: 'Settings & Health Profile'
  };

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b border-[#EFEAF4] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger + Active Screen Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-xl text-[#292431] hover:bg-[#FAF9FC] lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#292431] tracking-tight">
            {screenTitles[activeScreen] || 'Dashboard'}
          </h1>
          <p className="text-[11px] text-[#77717F] hidden sm:flex items-center gap-1.5 font-medium">
            <span>PCOS360 Intelligence</span>
            <span className="text-stone-300">•</span>
            <span className="text-[#7950A8] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA-conscious Clinical Model
            </span>
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Cycle status pill */}
        <div
          onClick={() => setActiveScreen('health-tracker')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF9FC] border border-[#EFEAF4] text-xs font-medium text-[#292431] cursor-pointer hover:border-[#DFCDEE] hover:bg-[#EDE5F7]/30 transition-all"
          title="Cycle Progress (Click to view tracker)"
        >
          <Calendar className="w-3.5 h-3.5 text-[#7950A8]" />
          <span>Day {cycleData.currentDay} of {cycleData.totalDays}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8B8D0]" />
          <span className="text-[#7950A8] font-semibold">{cycleData.phase}</span>
        </div>

        {/* View Mode Toggle (Desktop Dashboard vs Mobile Device View) */}
        <div className="hidden xl:flex items-center p-1 bg-[#FAF9FC] rounded-xl border border-[#EFEAF4]">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'desktop'
                ? 'bg-white text-[#7950A8] shadow-xs'
                : 'text-[#77717F] hover:text-[#292431]'
            }`}
            title="Spacious desktop dashboard view"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile-preview')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'mobile-preview'
                ? 'bg-white text-[#7950A8] shadow-xs'
                : 'text-[#77717F] hover:text-[#292431]'
            }`}
            title="Mobile device simulator view matching prototype reference"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Preview</span>
          </button>
        </div>

        {/* Quick Log Action Button */}
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7950A8] text-white text-xs sm:text-sm font-semibold hover:bg-[#694195] transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Log Today</span>
          <span className="sm:hidden">Log</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2.5 rounded-xl text-[#292431] hover:bg-[#FAF9FC] hover:text-[#7950A8] border border-transparent hover:border-[#EFEAF4] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#77717F]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#A6417A] ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#EFEAF4] shadow-[0_10px_35px_rgba(41,36,49,0.12)] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF9FC]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#292431]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-[#EDE5F7] text-[#7950A8] text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#77717F]">PCOS360 Real-time Alerts</span>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.screen) setActiveScreen(notif.screen);
                      setIsNotifOpen(false);
                    }}
                    className={`p-3 rounded-xl cursor-pointer text-left transition-all ${
                      notif.unread
                        ? 'bg-[#FAF9FC] border border-[#DFCDEE] hover:bg-[#EDE5F7]/40'
                        : 'bg-white hover:bg-stone-50 border border-[#F4EFFB]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[#292431]">{notif.title}</p>
                      <span className="text-[10px] text-[#9E98A8] shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[#77717F] mt-1 leading-relaxed">{notif.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-[#EFEAF4] bg-white hover:border-[#DFCDEE] transition-all"
          title="Edit Health Profile"
        >
          <div className="w-8 h-8 rounded-full bg-[#EDE5F7] text-[#7950A8] flex items-center justify-center font-bold text-xs">
            {profile.name ? profile.name.charAt(0) : 'A'}
          </div>
          <span className="text-xs font-semibold text-[#292431] hidden sm:inline max-w-24 truncate">
            {profile.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
