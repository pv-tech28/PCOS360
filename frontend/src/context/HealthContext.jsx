import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialProfile,
  initialCycleData,
  initialRecentActivity,
  initialSymptomTrendData,
  initialCorrelations,
  initialLabReports,
  initialHistoricalMetabolic,
  initialCareGaps,
  initialTimeline,
  initialAIInsights
} from '../data/initialData';

const HealthContext = createContext(null);

const STORAGE_KEY = 'pcos360_data_v1';

export function HealthProvider({ children }) {
  // Load initial state from localStorage if available
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [cycleData, setCycleData] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cycle`);
      return saved ? JSON.parse(saved) : initialCycleData;
    } catch {
      return initialCycleData;
    }
  });

  const [labReports, setLabReports] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_labs`);
      return saved ? JSON.parse(saved) : initialLabReports;
    } catch {
      return initialLabReports;
    }
  });

  const [timeline, setTimeline] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_timeline`);
      return saved ? JSON.parse(saved) : initialTimeline;
    } catch {
      return initialTimeline;
    }
  });

  const [careGaps, setCareGaps] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_gaps`);
      return saved ? JSON.parse(saved) : initialCareGaps;
    } catch {
      return initialCareGaps;
    }
  });

  const [symptomTrends, setSymptomTrends] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_trends`);
      return saved ? JSON.parse(saved) : initialSymptomTrendData;
    } catch {
      return initialSymptomTrendData;
    }
  });

  const [insights, setInsights] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_insights`);
      return saved ? JSON.parse(saved) : initialAIInsights;
    } catch {
      return initialAIInsights;
    }
  });

  const [recentActivities, setRecentActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activity`);
      return saved ? JSON.parse(saved) : initialRecentActivity;
    } catch {
      return initialRecentActivity;
    }
  });

  // UI state
  const [activeScreen, setActiveScreen] = useState('overview');
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile-preview'
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLabUploadModalOpen, setIsLabUploadModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Metabolic review recommended', text: 'Recent HbA1c 5.8% logged. Click to review in Care Gaps.', unread: true, time: '2h ago', screen: 'care-gaps' },
    { id: 'notif-2', title: 'Cycle Phase update', text: 'You are now in mid-luteal phase (Day 18). Expect steady energy.', unread: true, time: '1d ago', screen: 'overview' },
    { id: 'notif-3', title: 'Consultation packet ready', text: 'Summary generated with 4 doctor discussion questions.', unread: false, time: '3d ago', screen: 'consultation-copilot' }
  ]);

  // Save to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
      localStorage.setItem(`${STORAGE_KEY}_cycle`, JSON.stringify(cycleData));
      localStorage.setItem(`${STORAGE_KEY}_labs`, JSON.stringify(labReports));
      localStorage.setItem(`${STORAGE_KEY}_timeline`, JSON.stringify(timeline));
      localStorage.setItem(`${STORAGE_KEY}_gaps`, JSON.stringify(careGaps));
      localStorage.setItem(`${STORAGE_KEY}_trends`, JSON.stringify(symptomTrends));
      localStorage.setItem(`${STORAGE_KEY}_insights`, JSON.stringify(insights));
      localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(recentActivities));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  }, [profile, cycleData, labReports, timeline, careGaps, symptomTrends, insights, recentActivities]);

  // Actions
  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addDailyLog = (newLog) => {
    // Add to recent activity
    const activity = {
      id: Date.now(),
      type: 'log',
      title: 'Logged Daily Symptoms',
      detail: `Sleep ${newLog.sleepHours || 7}h, Stress ${newLog.stressLevel || 2}/5, Symptoms: ${newLog.symptoms?.join(', ') || 'None noted'}`,
      time: 'Just now',
      icon: 'Activity'
    };
    setRecentActivities(prev => [activity, ...prev.slice(0, 9)]);

    // Add to timeline
    const timelineEntry = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: 'symptom',
      title: `Daily Log - Cycle Day ${cycleData.currentDay}`,
      description: `Symptoms recorded: ${newLog.symptoms?.join(', ') || 'Mild/Normal'}. Sleep: ${newLog.sleepHours || 7} hrs. Energy: ${newLog.energyLevel || 'Moderate'}.`,
      badge: 'Symptom Log',
      badgeColor: 'amber'
    };
    setTimeline(prev => [timelineEntry, ...prev]);

    // Check if symptom logging gap was present and resolve it
    setCareGaps(prev => prev.filter(g => g.id !== 'gap-3'));
  };

  const addLabReport = (newReport) => {
    setLabReports(prev => [newReport, ...prev]);
    // Add to timeline
    const timelineEntry = {
      id: `t-${Date.now()}`,
      date: newReport.date || new Date().toISOString().split('T')[0],
      category: 'lab',
      title: `Lab Report Uploaded: ${newReport.filename || 'New Panel'}`,
      description: `Extracted ${newReport.tests?.length || 0} biomarkers. Status: Verified.`,
      badge: 'Lab Results',
      badgeColor: 'purple'
    };
    setTimeline(prev => [timelineEntry, ...prev]);

    // Add activity
    const activity = {
      id: Date.now(),
      type: 'lab',
      title: 'Lab Report Decoded',
      detail: newReport.filename || 'New Diagnostic Panel',
      time: 'Just now',
      icon: 'FileText'
    };
    setRecentActivities(prev => [activity, ...prev.slice(0, 9)]);

    // Update Care Gap if HbA1c/Metabolic was added
    setCareGaps(prev => prev.filter(g => g.id !== 'gap-1'));
  };

  const addTimelineEvent = (event) => {
    const newEntry = {
      id: `t-${Date.now()}`,
      ...event
    };
    setTimeline(prev => [newEntry, ...prev]);
  };

  const resolveCareGap = (gapId) => {
    setCareGaps(prev => prev.filter(g => g.id !== gapId));
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, unread: false } : n));
  };

  const resetToDemo = () => {
    setProfile(initialProfile);
    setCycleData(initialCycleData);
    setLabReports(initialLabReports);
    setTimeline(initialTimeline);
    setCareGaps(initialCareGaps);
    setSymptomTrends(initialSymptomTrendData);
    setInsights(initialAIInsights);
    setRecentActivities(initialRecentActivity);
    localStorage.clear();
  };

  return (
    <HealthContext.Provider value={{
      profile,
      updateProfile,
      cycleData,
      setCycleData,
      labReports,
      addLabReport,
      setLabReports,
      timeline,
      addTimelineEvent,
      careGaps,
      resolveCareGap,
      symptomTrends,
      correlations: initialCorrelations,
      historicalMetabolic: initialHistoricalMetabolic,
      insights,
      recentActivities,
      activeScreen,
      setActiveScreen,
      viewMode,
      setViewMode,
      isLogModalOpen,
      setIsLogModalOpen,
      isOnboardingOpen,
      setIsOnboardingOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isLabUploadModalOpen,
      setIsLabUploadModalOpen,
      isUserLoggedIn,
      setIsUserLoggedIn,
      notifications,
      markNotificationRead,
      addDailyLog,
      resetToDemo
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}
