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
  initialAIInsights,
} from '../data/initialData';
import { apiClient } from '../services/api';

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

  // Database synchronization state
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);

  // UI state
  const [activeScreen, setActiveScreen] = useState('overview');
  const [viewMode, setViewMode] = useState('desktop');
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

  // Initial fetch from FastAPI PostgreSQL backend
  useEffect(() => {
    let isMounted = true;

    async function syncFromDatabase() {
      setIsSyncing(true);
      try {
        // Check health & database connectivity
        const health = await apiClient.checkHealth();
        if (!isMounted) return;

        if (health && health.status === 'healthy') {
          setDbConnected(true);
          setSyncNotice({ type: 'success', text: `Connected to ${health.database?.type || 'Database'}` });

          // 1. Fetch Health Profile
          const backendProfile = await apiClient.getProfile(1);
          if (backendProfile && isMounted) {
            setProfile(prev => ({
              ...prev,
              age: backendProfile.age || prev.age,
              heightCm: backendProfile.height || prev.heightCm,
              weightKg: backendProfile.weight || prev.weightKg,
              pcosStatus: backendProfile.diagnosis_status || prev.pcosStatus,
              diagnosisYear: backendProfile.diagnosis_year || prev.diagnosisYear,
              medicalConditions: backendProfile.existing_conditions || prev.medicalConditions,
              medications: backendProfile.medications || prev.medications,
            }));
          }

          // 2. Fetch Menstrual Cycles
          const backendCycles = await apiClient.getCycles(1);
          if (backendCycles && backendCycles.length > 0 && isMounted) {
            const formattedHistory = backendCycles.map(c => ({
              cycle: new Date(c.period_start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              length: c.cycle_length,
              flowDays: 6,
              status: c.cycle_length <= 35 ? 'Regular' : 'Irregular',
            }));
            setCycleData(prev => ({
              ...prev,
              totalDays: backendCycles[0].cycle_length || prev.totalDays,
              history: formattedHistory,
            }));
          }

          // 3. Fetch Lab Reports
          const backendLabs = await apiClient.getLabReports(1);
          if (backendLabs && backendLabs.length > 0 && isMounted) {
            // Group flat test records or merge
            const formattedTests = backendLabs.map(l => ({
              name: l.test_name,
              value: l.test_value,
              unit: l.unit,
              normalRange: l.reference_range,
              status: l.test_value > 150 || (l.test_name === 'HbA1c' && l.test_value >= 5.7) ? 'Borderline' : 'Normal',
              interpretation: `Database record recorded on ${l.report_date}. Reference interval: ${l.reference_range} ${l.unit}.`,
            }));

            setLabReports(prev => [
              {
                id: 'rep-db-live',
                filename: 'PostgreSQL_Synchronized_Panel.pdf',
                labName: 'Verified Clinical Records',
                date: backendLabs[0].report_date,
                status: 'Analyzed',
                verified: true,
                tests: formattedTests,
              },
              ...prev.filter(r => r.id !== 'rep-db-live'),
            ]);
          }
        } else {
          setDbConnected(false);
          setSyncNotice({ type: 'warning', text: 'Backend offline - Using local storage cache' });
        }
      } catch (err) {
        console.warn('Backend database synchronization check:', err);
        if (isMounted) {
          setDbConnected(false);
          setSyncNotice({ type: 'info', text: 'Running in Local Prototype Mode' });
        }
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }

    syncFromDatabase();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to localStorage whenever state updates as an offline safeguard
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

  // Actions with Backend Database Persistence
  const updateProfile = async (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));

    // Persist to backend database
    try {
      await apiClient.updateProfile(1, {
        age: updates.age,
        height: updates.heightCm,
        weight: updates.weightKg,
        diagnosis_status: updates.pcosStatus,
        diagnosis_year: updates.diagnosisYear,
        existing_conditions: updates.medicalConditions,
        medications: updates.medications,
      });
      setSyncNotice({ type: 'success', text: 'Profile saved to PostgreSQL database' });
    } catch (err) {
      console.warn('Profile persisted to local state only:', err.message);
    }
  };

  const addDailyLog = async (newLog) => {
    const todayStr = new Date().toISOString().split('T')[0];

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
      date: todayStr,
      category: 'symptom',
      title: `Daily Log - Cycle Day ${cycleData.currentDay}`,
      description: `Symptoms recorded: ${newLog.symptoms?.join(', ') || 'Mild/Normal'}. Sleep: ${newLog.sleepHours || 7} hrs. Energy: ${newLog.energyLevel || 'Moderate'}.`,
      badge: 'Symptom Log',
      badgeColor: 'amber'
    };
    setTimeline(prev => [timelineEntry, ...prev]);

    // Check if symptom logging gap was present and resolve it
    setCareGaps(prev => prev.filter(g => g.id !== 'gap-3'));

    // Persist to backend database (Symptoms + Lifestyle)
    try {
      await apiClient.createSymptom({
        log_date: todayStr,
        acne_severity: newLog.symptoms?.includes('Acne Breakout') ? 'Moderate' : 'None',
        fatigue_level: newLog.symptoms?.includes('Severe Fatigue') ? 8 : newLog.symptoms?.includes('Mild Fatigue') ? 4 : 2,
        bloating: newLog.symptoms?.includes('Bloating / Water Retention') ? 5 : 1,
        pelvic_pain: newLog.symptoms?.includes('Pelvic Cramping') ? 6 : 1,
        mood: newLog.energyLevel || 'Moderate',
        notes: newLog.notes || null,
      });

      await apiClient.createLifestyle({
        log_date: todayStr,
        sleep_hours: parseFloat(newLog.sleepHours) || 7.5,
        stress_level: parseInt(newLog.stressLevel) || 2,
        water_intake: parseFloat(newLog.waterGlasses) || 8.0,
        exercise_minutes: 30,
        food_habits: 'Balanced',
        meal_regularity: 'Regular',
      });
      setSyncNotice({ type: 'success', text: 'Daily symptoms & lifestyle saved to PostgreSQL' });
    } catch (err) {
      console.warn('Daily log saved to local cache:', err.message);
    }
  };

  const addLabReport = async (newReport) => {
    setLabReports(prev => [newReport, ...prev]);

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

    const activity = {
      id: Date.now(),
      type: 'lab',
      title: 'Lab Report Decoded',
      detail: newReport.filename || 'New Diagnostic Panel',
      time: 'Just now',
      icon: 'FileText'
    };
    setRecentActivities(prev => [activity, ...prev.slice(0, 9)]);

    setCareGaps(prev => prev.filter(g => g.id !== 'gap-1'));

    // Persist extracted tests to backend database
    if (newReport.tests && newReport.tests.length > 0) {
      try {
        for (const test of newReport.tests) {
          await apiClient.createLabReport({
            report_name: newReport.filename || 'Diagnostic Panel',
            test_name: test.name,
            test_value: parseFloat(test.value) || 0.0,
            unit: test.unit || '',
            reference_range: test.normalRange || '',
            report_date: newReport.date || new Date().toISOString().split('T')[0],
          });
        }
        setSyncNotice({ type: 'success', text: 'Biomarkers stored in PostgreSQL lab_reports table' });
      } catch (err) {
        console.warn('Lab report saved to local state:', err.message);
      }
    }
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
      resetToDemo,
      isSyncing,
      dbConnected,
      syncNotice
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
