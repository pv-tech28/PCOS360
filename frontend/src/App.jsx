import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info, Loader2, LogOut, UserPlus, WifiOff, X } from 'lucide-react';
import { HealthProvider, useHealth } from './context/HealthContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import MobileFramePreview from './components/common/MobileFramePreview';

// Modals
import AuthModal, { AuthFormCard } from './components/modals/AuthModal';
import OnboardingModal from './components/modals/OnboardingModal';
import DailyLogModal from './components/modals/DailyLogModal';
import LabUploadModal from './components/modals/LabUploadModal';

// Pages
import OverviewPage from './pages/OverviewPage';
import TrackerPage from './pages/TrackerPage';
import PcoscopePage from './pages/PcoscopePage';
import MetabolicPage from './pages/MetabolicPage';
import ClinicalExplorerPage from './pages/ClinicalExplorerPage';
import ExplainPage from './pages/ExplainPage';
import LabReportsPage from './pages/LabReportsPage';
import WhatIfPage from './pages/WhatIfPage';
import ConsultationCopilotPage from './pages/ConsultationCopilotPage';
import MythBusterPage from './pages/MythBusterPage';
import TimelinePage from './pages/TimelinePage';
import CareGapsPage from './pages/CareGapsPage';
import SettingsPage from './pages/SettingsPage';

function StatusBanner() {
  const {
    isDemoMode,
    logout,
    setIsAuthModalOpen,
    syncNotice,
    setSyncNotice,
    dbConnected,
    profile,
    setIsOnboardingOpen,
  } = useHealth();

  if (isDemoMode) {
    return (
      <div className="mb-5 rounded-2xl border border-[#DFCDEE] bg-[#F5EEFC] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5 text-xs text-[#4E2F72]">
          <Info className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0 text-[#7950A8]" />
          <span>
            <strong>Demo Mode (Sample Data):</strong> Viewing local sample profile only. Changes are not saved to any user account.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DFCDEE] text-[#553878] text-xs font-semibold hover:bg-[#FAF9FC] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Demo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-5">
      {!dbConnected && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 flex items-center gap-2 text-xs text-amber-900">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-700" />
          <span>
            Offline mode — backend API unavailable. Viewing cached session data; saving changes requires connection.
          </span>
        </div>
      )}

      {!profile.initialized && (
        <div className="rounded-2xl border border-[#DFCDEE] bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <span className="text-xs text-[#292431]">
            Complete your baseline health profile (age, height, weight, PCOS status) to personalize insights.
          </span>
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] shrink-0 cursor-pointer"
          >
            Complete Profile
          </button>
        </div>
      )}

      {syncNotice && syncNotice.type !== 'success' && (
        <div
          className={`rounded-2xl border px-4 py-2.5 flex items-center justify-between gap-3 text-xs ${
            syncNotice.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : syncNotice.type === 'warning'
              ? 'border-amber-200 bg-amber-50 text-amber-900'
              : 'border-[#EFEAF4] bg-white text-[#553878]'
          }`}
        >
          <div className="flex items-center gap-2">
            {syncNotice.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{syncNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncNotice(null)}
            className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function MainAppContent() {
  const { authState, activeScreen, viewMode } = useHealth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#FAF9FC] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-[#7950A8] animate-spin" />
          <p className="text-sm font-semibold text-[#292431]">Verifying your PCOS360 session...</p>
          <p className="text-xs text-[#77717F]">Checking credentials & syncing health profile</p>
        </div>
      </div>
    );
  }

  if (authState === 'signed_out') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9FC] via-white to-[#F4ECF9] flex items-center justify-center p-4 sm:p-6">
        <AuthFormCard isModal={false} />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'overview':
        return <OverviewPage />;
      case 'health-tracker':
        return <TrackerPage />;
      case 'pcoscope':
        return <PcoscopePage />;
      case 'metabolic-health':
        return <MetabolicPage />;
      case 'clinical-explorer':
        return <ClinicalExplorerPage />;
      case 'ai-insights':
        return <ExplainPage />;
      case 'lab-reports':
        return <LabReportsPage />;
      case 'what-if':
        return <WhatIfPage />;
      case 'consultation-copilot':
        return <ConsultationCopilotPage />;
      case 'learning-hub':
        return <MythBusterPage />;
      case 'timeline':
        return <TimelinePage />;
      case 'care-gaps':
        return <CareGapsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-[#292431] flex flex-col font-sans">
      {/* Modals */}
      <AuthModal />
      <OnboardingModal />
      <DailyLogModal />
      <LabUploadModal />

      {/* Main Layout Container */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <StatusBanner />
            {viewMode === 'mobile-preview' ? (
              <MobileFramePreview>{renderActiveScreen()}</MobileFramePreview>
            ) : (
              renderActiveScreen()
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HealthProvider>
      <MainAppContent />
    </HealthProvider>
  );
}
