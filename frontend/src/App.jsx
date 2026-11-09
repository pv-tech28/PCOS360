import React, { useState } from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import MobileFramePreview from './components/common/MobileFramePreview';

// Modals
import AuthModal from './components/modals/AuthModal';
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

function MainAppContent() {
  const { activeScreen, viewMode } = useHealth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            {viewMode === 'mobile-preview' ? (
              <MobileFramePreview>
                {renderActiveScreen()}
              </MobileFramePreview>
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
