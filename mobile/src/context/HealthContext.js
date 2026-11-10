// PCOS360 Health Context - Central Mobile State & Persistence
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { apiClient, getApiBaseUrl, setApiBaseUrl } from '../services/api';

const HealthContext = createContext(null);
const STORAGE_PREFIX = '@pcos360_v1_';

export function HealthProvider({ children }) {
  const [profile, setProfile] = useState(initialProfile);
  const [cycleData, setCycleData] = useState(initialCycleData);
  const [labReports, setLabReports] = useState(initialLabReports);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [careGaps, setCareGaps] = useState(initialCareGaps);
  const [symptomTrends, setSymptomTrends] = useState(initialSymptomTrendData);
  const [insights, setInsights] = useState(initialAIInsights);
  const [recentActivities, setRecentActivities] = useState(initialRecentActivity);

  // Connection & Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [apiServerUrl, setApiServerUrlState] = useState(getApiBaseUrl());

  // Load cached data from AsyncStorage on startup
  useEffect(() => {
    async function loadStoredData() {
      try {
        const [
          savedProfile,
          savedCycle,
          savedLabs,
          savedTimeline,
          savedGaps,
          savedTrends,
          savedActivities,
          savedUrl,
        ] = await Promise.all([
          AsyncStorage.getItem(`${STORAGE_PREFIX}profile`),
          AsyncStorage.getItem(`${STORAGE_PREFIX}cycle`),
          AsyncStorage.getItem(`${STORAGE_PREFIX}labs`),
          AsyncStorage.getItem(`${STORAGE_PREFIX}timeline`),
          AsyncStorage.getItem(`${STORAGE_PREFIX}careGaps`),
          AsyncStorage.getItem(`${STORAGE_PREFIX}trends`),
          AsyncStorage.getItem(`${STORAGE_PREFIX}activities`),
          AsyncStorage.getItem(`${STORAGE_PREFIX}api_url`),
        ]);

        if (savedProfile) setProfile(JSON.parse(savedProfile));
        if (savedCycle) setCycleData(JSON.parse(savedCycle));
        if (savedLabs) setLabReports(JSON.parse(savedLabs));
        if (savedTimeline) setTimeline(JSON.parse(savedTimeline));
        if (savedGaps) setCareGaps(JSON.parse(savedGaps));
        if (savedTrends) setSymptomTrends(JSON.parse(savedTrends));
        if (savedActivities) setRecentActivities(JSON.parse(savedActivities));
        if (savedUrl) {
          setApiBaseUrl(savedUrl);
          setApiServerUrlState(savedUrl);
        }
      } catch (err) {
        console.warn('Error reading from AsyncStorage:', err);
      }
    }

    loadStoredData();
  }, []);

  // Check backend health periodically
  const checkBackendStatus = useCallback(async () => {
    try {
      const health = await apiClient.checkHealth();
      if (health && health.status === 'healthy') {
        setDbConnected(true);
        return true;
      }
      setDbConnected(false);
      return false;
    } catch {
      setDbConnected(false);
      return false;
    }
  }, []);

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 15000);
    return () => clearInterval(interval);
  }, [checkBackendStatus]);

  // Update Profile
  const updateProfile = async (newProfileData) => {
    const updated = { ...profile, ...newProfileData };
    setProfile(updated);
    await AsyncStorage.setItem(`${STORAGE_PREFIX}profile`, JSON.stringify(updated));

    if (dbConnected) {
      try {
        await apiClient.updateProfile(1, {
          age: updated.age,
          height: updated.heightCm,
          weight: updated.weightKg,
          diagnosis_status: updated.pcosStatus,
          diagnosis_year: updated.diagnosisYear,
          existing_conditions: (updated.medicalConditions || []).join(', '),
          medications: (updated.medications || []).join(', '),
        });
      } catch (e) {
        console.warn('Backend update failed, kept in local storage:', e.message);
      }
    }
  };

  // Log Daily Symptoms
  const addDailyLog = async (logData) => {
    const newActivity = {
      id: Date.now(),
      type: 'log',
      title: 'Logged Daily Symptoms',
      detail: `Fatigue: ${logData.fatigueLevel}/10, Sleep: ${logData.sleepHours || 7}h, Mood: ${logData.mood || 'Calm'}`,
      time: 'Just now',
      icon: 'Activity',
    };

    const updatedActivities = [newActivity, ...recentActivities.slice(0, 9)];
    setRecentActivities(updatedActivities);
    await AsyncStorage.setItem(`${STORAGE_PREFIX}activities`, JSON.stringify(updatedActivities));

    // Also add to timeline
    const newTimelineItem = {
      id: `t-${Date.now()}`,
      date: 'Today',
      category: 'symptom',
      title: 'Daily Symptoms Logged',
      description: `Fatigue: ${logData.fatigueLevel}/10, Pelvic Pain: ${logData.pelvicPain}/10, Bloating: ${logData.bloating}/10`,
      badge: 'Symptoms',
      badgeColor: '#E8B8D0',
    };
    const updatedTimeline = [newTimelineItem, ...timeline];
    setTimeline(updatedTimeline);
    await AsyncStorage.setItem(`${STORAGE_PREFIX}timeline`, JSON.stringify(updatedTimeline));

    // Try posting to backend
    if (dbConnected) {
      try {
        await apiClient.createSymptom({
          log_date: new Date().toISOString().split('T')[0],
          fatigue_level: logData.fatigueLevel || 3,
          acne_severity: logData.acneSeverity || 2,
          bloating: logData.bloating || 2,
          pelvic_pain: logData.pelvicPain || 1,
          mood: logData.mood || 'Calm',
          hair_loss: logData.hairLoss || 1,
          unwanted_hair_growth: logData.unwantedHair || 1,
          notes: logData.notes || '',
        });
      } catch (err) {
        console.warn('Failed to sync symptom to backend:', err.message);
      }
    }
  };

  // Add Lab Report
  const addLabReport = async (report) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      filename: report.filename || 'Lab_Report.pdf',
      displayName: report.filename || 'Lab_Report.pdf',
      labName: report.labName || 'Diagnostic Center',
      date: report.date || new Date().toISOString().split('T')[0],
      status: 'Analyzed',
      verified: true,
      tests: report.tests || [],
    };

    const updatedReports = [newReport, ...labReports];
    setLabReports(updatedReports);
    await AsyncStorage.setItem(`${STORAGE_PREFIX}labs`, JSON.stringify(updatedReports));

    // Update timeline
    const newTimelineItem = {
      id: `t-${Date.now()}`,
      date: newReport.date,
      category: 'lab',
      title: 'Lab Report Decoded',
      description: `${newReport.filename} analyzed successfully`,
      badge: 'Lab',
      badgeColor: '#7950A8',
    };
    const updatedTimeline = [newTimelineItem, ...timeline];
    setTimeline(updatedTimeline);
    await AsyncStorage.setItem(`${STORAGE_PREFIX}timeline`, JSON.stringify(updatedTimeline));

    // Try sending to backend
    if (dbConnected && report.tests && report.tests.length > 0) {
      for (const t of report.tests) {
        try {
          await apiClient.createLabReport({
            report_name: newReport.filename,
            test_name: t.name,
            test_value: String(t.value),
            unit: t.unit || '',
            reference_range: t.normalRange || '',
            report_date: newReport.date,
          });
        } catch (e) {
          console.warn('Could not sync lab test item:', e.message);
        }
      }
    }
  };

  // Change backend IP address (for testing on real devices)
  const updateApiUrl = async (newUrl) => {
    setApiBaseUrl(newUrl);
    setApiServerUrlState(newUrl);
    await AsyncStorage.setItem(`${STORAGE_PREFIX}api_url`, newUrl);
    await checkBackendStatus();
  };

  return (
    <HealthContext.Provider
      value={{
        profile,
        updateProfile,
        cycleData,
        labReports,
        addLabReport,
        timeline,
        careGaps,
        symptomTrends,
        insights,
        recentActivities,
        addDailyLog,
        dbConnected,
        isSyncing,
        checkBackendStatus,
        apiServerUrl,
        updateApiUrl,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export default HealthContext;

