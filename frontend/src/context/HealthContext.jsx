import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import {
  apiClient,
  getAuthToken,
  clearAuthToken,
  setUnauthorizedHandler,
} from '../services/api';

const HealthContext = createContext(null);

const AUTH_USER_CACHE_KEY = 'pcos360_auth_user_v1';

function getUserStoragePrefix(userId) {
  return `pcos360_u_${userId}_v1`;
}

function createEmptyProfile(user) {
  return {
    name: user?.full_name || '',
    age: '',
    heightCm: '',
    weightKg: '',
    pcosStatus: 'Unsure',
    diagnosisYear: new Date().getFullYear(),
    medicalConditions: [],
    medications: [],
    cycleLengthAvg: 28,
    periodDurationAvg: 5,
    lastPeriodDate: null,
    currentCycleDay: 1,
    cyclePhase: 'Not logged yet',
    initialized: false,
  };
}

function createEmptyCycleData() {
  return {
    currentDay: 1,
    totalDays: 28,
    phase: 'No cycle logged yet',
    phaseDescription: 'Log your recent period or daily symptoms to start personalized cycle tracking.',
    nextPeriodEstimated: 'Pending cycle log',
    ovulationEstimated: 'Pending cycle log',
    fertileWindow: 'Pending cycle log',
    history: [],
  };
}

function createDefaultNotifications() {
  return [
    {
      id: 'notif-welcome',
      title: 'Private Account Active',
      text: 'Complete your health profile and log daily symptoms or labs to build personalized insights.',
      unread: true,
      time: 'Now',
      screen: 'settings',
    },
  ];
}

function createDemoNotifications() {
  return [
    {
      id: 'notif-1',
      title: 'Metabolic review recommended (Demo)',
      text: 'Sample HbA1c 5.8% loaded in Demo Mode. Open Care Gaps to preview alerts.',
      unread: true,
      time: '2h ago',
      screen: 'care-gaps',
    },
    {
      id: 'notif-2',
      title: 'Cycle Phase update (Demo)',
      text: 'Sample Day 18 mid-luteal state.',
      unread: true,
      time: '1d ago',
      screen: 'overview',
    },
    {
      id: 'notif-3',
      title: 'Consultation packet ready (Demo)',
      text: 'Sample summary with 4 doctor discussion questions.',
      unread: false,
      time: '3d ago',
      screen: 'consultation-copilot',
    },
  ];
}

function deriveCycleDataFromBackend(cycles) {
  if (!Array.isArray(cycles) || cycles.length === 0) {
    return createEmptyCycleData();
  }
  const latest = cycles[0];
  const totalDays = latest.cycle_length || 28;
  const startMs = new Date(`${latest.period_start_date}T00:00:00`).getTime();
  const elapsed = Number.isFinite(startMs)
    ? Math.max(1, Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24)) + 1)
    : 1;
  const currentDay = Math.min(elapsed, totalDays);
  const ovulationDay = Math.max(8, totalDays - 14);
  const phase =
    currentDay <= 5
      ? 'Menstrual Phase'
      : currentDay < ovulationDay
      ? 'Follicular Phase'
      : currentDay <= ovulationDay + 2
      ? 'Ovulation Window'
      : 'Luteal Phase';
  const nextStart = new Date(startMs + totalDays * 24 * 60 * 60 * 1000);
  const nextPeriodEstimated = Number.isFinite(nextStart.getTime())
    ? nextStart.toISOString().split('T')[0]
    : 'Pending cycle log';

  const history = cycles.map((c) => ({
    id: c.id,
    cycle: new Date(`${c.period_start_date}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    length: c.cycle_length,
    flowDays:
      c.period_end_date && c.period_start_date
        ? Math.max(
            1,
            Math.round(
              (new Date(`${c.period_end_date}T00:00:00`).getTime() -
                new Date(`${c.period_start_date}T00:00:00`).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1
          )
        : 5,
    status: c.cycle_length <= 35 ? 'Regular' : 'Irregular',
  }));

  return {
    currentDay,
    totalDays,
    phase,
    phaseDescription: `Derived from your logged cycle starting ${latest.period_start_date}.`,
    nextPeriodEstimated,
    ovulationEstimated: `~Day ${ovulationDay}`,
    fertileWindow: `Days ${Math.max(1, ovulationDay - 3)} – ${ovulationDay + 1}`,
    history,
  };
}

function classifyLabStatus(test) {
  const val = Number(test.test_value);
  const name = (test.test_name || '').toLowerCase();
  if (name.includes('hba1c') && val >= 5.7) return 'Borderline';
  if (name.includes('cholesterol') && val >= 200) return 'Borderline';
  if (name.includes('triglyceride') && val >= 150) return 'Borderline';
  if (name.includes('insulin') && val >= 12) return 'Borderline';
  if (name.includes('testosterone') && val > 50) return 'Elevated';
  return 'Normal';
}

function groupLabReportsFromBackend(backendLabs) {
  if (!Array.isArray(backendLabs) || backendLabs.length === 0) {
    return [];
  }
  const grouped = new Map();
  for (const row of backendLabs) {
    const key = `${row.report_name}::${row.report_date}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: `rep-${row.id}`,
        dbIds: [row.id],
        filename: row.report_name,
        labName: 'Saved Account Lab Record',
        date: row.report_date,
        status: 'Analyzed',
        verified: true,
        tests: [],
      });
    } else {
      grouped.get(key).dbIds.push(row.id);
    }
    grouped.get(key).tests.push({
      id: row.id,
      name: row.test_name,
      value: row.test_value,
      unit: row.unit,
      normalRange: row.reference_range,
      status: classifyLabStatus(row),
      interpretation: `Recorded on ${row.report_date}. Reference range: ${row.reference_range} ${row.unit}. Informational reference comparison only — not a medical diagnosis.`,
    });
  }
  return Array.from(grouped.values());
}

function buildCareGapsForUser(profile, labReports, symptoms) {
  const gaps = [];
  if (!profile?.initialized) {
    gaps.push({
      id: 'gap-profile',
      title: 'Complete Your Baseline Health Profile',
      description: 'Add age, height, weight, and diagnosis history so insights are tailored accurately.',
      severity: 'Medium',
      dueText: 'Recommended',
    });
  }
  if (!labReports || labReports.length === 0) {
    gaps.push({
      id: 'gap-1',
      title: 'Upload Baseline Metabolic or Hormone Lab Panel',
      description: 'No lab biomarkers stored on this account yet.',
      severity: 'Medium',
      dueText: 'When available',
    });
  }
  if (!symptoms || symptoms.length === 0) {
    gaps.push({
      id: 'gap-3',
      title: 'Log Your First Daily Symptom Check-In',
      description: 'Track sleep, stress, fatigue, and cycle symptoms to uncover personal patterns.',
      severity: 'Low',
      dueText: 'Today',
    });
  }
  return gaps;
}

function buildTimelineAndActivity(cycles, symptoms, lifestyle, labs) {
  const timeline = [];
  const activities = [];

  for (const c of cycles || []) {
    timeline.push({
      id: `cyc-${c.id}`,
      date: c.period_start_date,
      category: 'cycle',
      title: `Menstrual Cycle Logged (${c.cycle_length} days)`,
      description: `Flow: ${c.flow_intensity || 'Medium'}${c.notes ? ` — ${c.notes}` : ''}`,
      badge: 'Cycle',
      badgeColor: 'pink',
    });
    activities.push({
      id: `act-c-${c.id}`,
      type: 'cycle',
      title: 'Cycle Recorded',
      detail: `${c.period_start_date} • ${c.cycle_length} day cycle`,
      time: c.period_start_date,
      icon: 'Calendar',
    });
  }

  for (const s of symptoms || []) {
    timeline.push({
      id: `sym-${s.id}`,
      date: s.log_date,
      category: 'symptom',
      title: `Symptom Check-In (${s.mood || 'Logged'})`,
      description: `Fatigue: ${s.fatigue_level ?? 'N/A'}/10 • Acne: ${s.acne_severity || 'None'}${s.notes ? ` • ${s.notes}` : ''}`,
      badge: 'Symptom Log',
      badgeColor: 'amber',
    });
    activities.push({
      id: `act-s-${s.id}`,
      type: 'log',
      title: 'Logged Daily Symptoms',
      detail: `Mood: ${s.mood || 'N/A'}, Fatigue ${s.fatigue_level ?? '-'}/10`,
      time: s.log_date,
      icon: 'Activity',
    });
  }

  for (const l of lifestyle || []) {
    activities.push({
      id: `act-l-${l.id}`,
      type: 'log',
      title: 'Lifestyle Metrics Saved',
      detail: `Sleep ${l.sleep_hours}h, Stress ${l.stress_level}/5, Water ${l.water_intake} glasses`,
      time: l.log_date,
      icon: 'Activity',
    });
  }

  for (const rep of labs || []) {
    timeline.push({
      id: `lab-${rep.id}`,
      date: rep.date,
      category: 'lab',
      title: `Lab Panel: ${rep.filename}`,
      description: `${rep.tests?.length || 0} biomarkers stored securely in your account.`,
      badge: 'Lab Results',
      badgeColor: 'purple',
    });
    activities.push({
      id: `act-lab-${rep.id}`,
      type: 'lab',
      title: 'Lab Report Saved',
      detail: rep.filename,
      time: rep.date,
      icon: 'FileText',
    });
  }

  timeline.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  activities.sort((a, b) => String(b.time).localeCompare(String(a.time)));
  return { timeline, activities: activities.slice(0, 10) };
}

function loadUserCache(userId) {
  try {
    const raw = localStorage.getItem(getUserStoragePrefix(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUserCache(userId, payload) {
  if (!userId) return;
  try {
    localStorage.setItem(getUserStoragePrefix(userId), JSON.stringify(payload));
  } catch (e) {
    console.warn('Could not save offline user cache:', e);
  }
}

export function HealthProvider({ children }) {
  const [authState, setAuthState] = useState('loading'); // 'loading' | 'signed_out' | 'authenticated' | 'demo'
  const [authUser, setAuthUser] = useState(null);

  const [profile, setProfile] = useState(() => createEmptyProfile(null));
  const [cycleData, setCycleData] = useState(() => createEmptyCycleData());
  const [labReports, setLabReports] = useState([]);
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [careGaps, setCareGaps] = useState([]);
  const [symptomTrends, setSymptomTrends] = useState([]);
  const [insights, setInsights] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  const [historicalMetabolic, setHistoricalMetabolic] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState(() => createDefaultNotifications());

  // Sync / UI State
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);
  const [activeScreen, setActiveScreen] = useState('overview');
  const [viewMode, setViewMode] = useState('desktop');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLabUploadModalOpen, setIsLabUploadModalOpen] = useState(false);

  const clearAccountState = useCallback(() => {
    setAuthUser(null);
    setProfile(createEmptyProfile(null));
    setCycleData(createEmptyCycleData());
    setLabReports([]);
    setClinicalRecords([]);
    setTimeline([]);
    setCareGaps([]);
    setSymptomTrends([]);
    setInsights([]);
    setCorrelations([]);
    setHistoricalMetabolic([]);
    setRecentActivities([]);
    setNotifications(createDefaultNotifications());
    setIsOnboardingOpen(false);
    setIsLogModalOpen(false);
    setIsLabUploadModalOpen(false);
  }, []);

  const applyDemoState = useCallback(() => {
    clearAuthToken();
    try {
      localStorage.removeItem(AUTH_USER_CACHE_KEY);
    } catch {
      // ignore
    }
    setAuthState('demo');
    setAuthUser({ id: null, full_name: initialProfile.name, email: null, isDemo: true });
    setProfile({ ...initialProfile, initialized: true });
    setCycleData(initialCycleData);
    setLabReports(initialLabReports);
    setClinicalRecords([]);
    setTimeline(initialTimeline);
    setCareGaps(initialCareGaps);
    setSymptomTrends(initialSymptomTrendData);
    setInsights(initialAIInsights);
    setCorrelations(initialCorrelations);
    setHistoricalMetabolic(initialHistoricalMetabolic);
    setRecentActivities(initialRecentActivity);
    setNotifications(createDemoNotifications());
    setActiveScreen('overview');
    setIsAuthModalOpen(false);
    setIsOnboardingOpen(false);
    setSyncNotice({
      type: 'info',
      text: 'Demo Mode active (sample data only — changes are not saved to a user account)',
    });
  }, []);

  const hydrateAuthenticatedUser = useCallback(async (user, options = {}) => {
    const { isNewRegistration = false } = options;
    clearAccountState();
    setAuthUser(user);
    setAuthState('authenticated');
    setIsSyncing(true);

    try {
      localStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }

    // Apply user-scoped offline cache immediately while live fetch runs (only for THIS user)
    const cached = loadUserCache(user.id);
    if (cached && !isNewRegistration) {
      if (cached.profile) setProfile(cached.profile);
      if (cached.cycleData) setCycleData(cached.cycleData);
      if (cached.labReports) setLabReports(cached.labReports);
      if (cached.timeline) setTimeline(cached.timeline);
      if (cached.careGaps) setCareGaps(cached.careGaps);
      if (cached.symptomTrends) setSymptomTrends(cached.symptomTrends);
      if (cached.recentActivities) setRecentActivities(cached.recentActivities);
    } else {
      setProfile(createEmptyProfile(user));
      setCareGaps(buildCareGapsForUser({ initialized: false }, [], []));
    }

    try {
      const [backendProfile, backendCycles, backendSymptoms, backendLifestyle, backendLabs, backendClinical] =
        await Promise.all([
          apiClient.getProfile(),
          apiClient.getCycles(),
          apiClient.getSymptoms(),
          apiClient.getLifestyle(),
          apiClient.getLabReports(),
          apiClient.getClinicalRecords(),
        ]);

      setDbConnected(true);

      const mappedProfile = backendProfile
        ? {
            name: user.full_name,
            age: backendProfile.age,
            heightCm: backendProfile.height,
            weightKg: backendProfile.weight,
            pcosStatus: backendProfile.diagnosis_status || 'Unsure',
            diagnosisYear: backendProfile.diagnosis_year || new Date().getFullYear(),
            medicalConditions: backendProfile.existing_conditions || [],
            medications: backendProfile.medications || [],
            cycleLengthAvg: backendCycles[0]?.cycle_length || 28,
            periodDurationAvg: 5,
            lastPeriodDate: backendCycles[0]?.period_start_date || null,
            currentCycleDay: deriveCycleDataFromBackend(backendCycles).currentDay,
            cyclePhase: deriveCycleDataFromBackend(backendCycles).phase,
            initialized: true,
          }
        : createEmptyProfile(user);

      const mappedCycles = deriveCycleDataFromBackend(backendCycles);
      const mappedLabs = groupLabReportsFromBackend(backendLabs);
      const { timeline: mappedTimeline, activities: mappedActivities } = buildTimelineAndActivity(
        backendCycles,
        backendSymptoms,
        backendLifestyle,
        mappedLabs
      );
      const mappedGaps = buildCareGapsForUser(mappedProfile, mappedLabs, backendSymptoms);

      const mappedTrends = (backendSymptoms || [])
        .slice(0, 12)
        .reverse()
        .map((s) => ({
          month: s.log_date,
          fatigue: s.fatigue_level ?? 0,
          acne: s.acne_severity === 'Severe' ? 8 : s.acne_severity === 'Moderate' ? 5 : s.acne_severity === 'Mild' ? 3 : 1,
          bloating: s.bloating ?? 0,
          mood: 5,
          sleepHours: 7,
          stress: 3,
        }));

      setProfile(mappedProfile);
      setCycleData(mappedCycles);
      setLabReports(mappedLabs);
      setClinicalRecords(backendClinical || []);
      setTimeline(mappedTimeline);
      setRecentActivities(mappedActivities);
      setCareGaps(mappedGaps);
      setSymptomTrends(mappedTrends);
      setInsights([]);
      setCorrelations([]);
      setHistoricalMetabolic([]);
      setNotifications(createDefaultNotifications());

      saveUserCache(user.id, {
        profile: mappedProfile,
        cycleData: mappedCycles,
        labReports: mappedLabs,
        timeline: mappedTimeline,
        careGaps: mappedGaps,
        symptomTrends: mappedTrends,
        recentActivities: mappedActivities,
      });

      setSyncNotice({ type: 'success', text: `Signed in as ${user.email}` });

      if (!backendProfile && isNewRegistration) {
        setIsOnboardingOpen(true);
      }
    } catch (err) {
      if (err.status === 401) {
        clearAuthToken();
        try {
          localStorage.removeItem(AUTH_USER_CACHE_KEY);
        } catch {
          // ignore
        }
        clearAccountState();
        setAuthState('signed_out');
        setSyncNotice({ type: 'error', text: 'Your session expired. Please sign in again.' });
      } else {
        setDbConnected(false);
        setSyncNotice({
          type: 'warning',
          text: `Offline: ${err.message}. Showing locally cached records for ${user.email}.`,
        });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [clearAccountState]);

  // Register global 401 handler so stale/revoked tokens always drop back to signed_out
  useEffect(() => {
    setUnauthorizedHandler(() => {
      try {
        localStorage.removeItem(AUTH_USER_CACHE_KEY);
      } catch {
        // ignore
      }
      clearAccountState();
      setAuthState('signed_out');
      setSyncNotice({ type: 'error', text: 'Session expired or signed out. Please sign in again.' });
    });
    return () => setUnauthorizedHandler(null);
  }, [clearAccountState]);

  // Restore session on startup
  useEffect(() => {
    let active = true;

    async function initSession() {
      const health = await apiClient.checkHealth();
      if (active) {
        setDbConnected(Boolean(health && health.status === 'healthy'));
      }

      const token = getAuthToken();
      if (!token) {
        if (active) {
          clearAccountState();
          setAuthState('signed_out');
        }
        return;
      }

      try {
        const user = await apiClient.getMe();
        if (active && user) {
          await hydrateAuthenticatedUser(user);
        }
      } catch (err) {
        if (!active) return;
        if (err.isNetworkError) {
          let cachedUser = null;
          try {
            const raw = localStorage.getItem(AUTH_USER_CACHE_KEY);
            cachedUser = raw ? JSON.parse(raw) : null;
          } catch {
            cachedUser = null;
          }

          if (cachedUser?.id) {
            const cachedData = loadUserCache(cachedUser.id);
            setAuthUser(cachedUser);
            setAuthState('authenticated');
            setDbConnected(false);
            if (cachedData?.profile) setProfile(cachedData.profile);
            if (cachedData?.cycleData) setCycleData(cachedData.cycleData);
            if (cachedData?.labReports) setLabReports(cachedData.labReports);
            if (cachedData?.timeline) setTimeline(cachedData.timeline);
            if (cachedData?.careGaps) setCareGaps(cachedData.careGaps);
            if (cachedData?.symptomTrends) setSymptomTrends(cachedData.symptomTrends);
            if (cachedData?.recentActivities) setRecentActivities(cachedData.recentActivities);
            setSyncNotice({
              type: 'warning',
              text: `Backend offline — showing cached data for ${cachedUser.email}. Saving requires connection.`,
            });
            return;
          }
        }

        clearAuthToken();
        try {
          localStorage.removeItem(AUTH_USER_CACHE_KEY);
        } catch {
          // ignore
        }
        clearAccountState();
        setAuthState('signed_out');
        setSyncNotice({
          type: 'error',
          text: err.status === 401 ? 'Session expired. Please sign in again.' : err.message,
        });
      }
    }

    initSession();
    return () => {
      active = false;
    };
  }, [clearAccountState, hydrateAuthenticatedUser]);

  // Auth Actions
  const login = async ({ email, password }) => {
    setSyncNotice(null);
    const data = await apiClient.login({ email, password });
    setActiveScreen('overview');
    setActiveScreen('overview');
    setIsAuthModalOpen(false);
    await hydrateAuthenticatedUser(data.user, { isNewRegistration: false });
    return data.user;
  };

  const register = async ({ fullName, email, password }) => {
    setSyncNotice(null);
    const data = await apiClient.register({ fullName, email, password });
    setActiveScreen('overview');
    setIsAuthModalOpen(false);
    await hydrateAuthenticatedUser(data.user, { isNewRegistration: true });
    return data.user;
  };

  const logout = async () => {
    if (authState === 'authenticated') {
      await apiClient.logout();
    } else {
      clearAuthToken();
    }
    try {
      localStorage.removeItem(AUTH_USER_CACHE_KEY);
    } catch {
      // ignore
    }
    clearAccountState();
    setActiveScreen('overview');
    setIsAuthModalOpen(false);
    setAuthState('signed_out');
    setSyncNotice({ type: 'info', text: 'Signed out cleanly.' });
  };

  const enterDemoMode = () => {
    applyDemoState();
  };

  const resetToDemo = () => {
    if (authState === 'demo') {
      applyDemoState();
    }
  };

  // Persist user-scoped cache when authenticated state changes
  useEffect(() => {
    if (authState === 'authenticated' && authUser?.id) {
      saveUserCache(authUser.id, {
        profile,
        cycleData,
        labReports,
        timeline,
        careGaps,
        symptomTrends,
        recentActivities,
      });
    }
  }, [authState, authUser, profile, cycleData, labReports, timeline, careGaps, symptomTrends, recentActivities]);

  // Health Profile Mutation (preserves array fields & 404 -> createProfile upsert)
  const updateProfile = async (updates) => {
    const mergedProfile = { ...profile, ...updates };
    const parsedAge = parseInt(mergedProfile.age, 10);
    const parsedHeight = parseFloat(mergedProfile.heightCm);
    const parsedWeight = parseFloat(mergedProfile.weightKg);

    if (authState === 'demo') {
      const nextDemo = {
        ...mergedProfile,
        age: Number.isFinite(parsedAge) ? parsedAge : mergedProfile.age,
        heightCm: Number.isFinite(parsedHeight) ? parsedHeight : mergedProfile.heightCm,
        weightKg: Number.isFinite(parsedWeight) ? parsedWeight : mergedProfile.weightKg,
        initialized: true,
      };
      setProfile(nextDemo);
      setSyncNotice({ type: 'info', text: 'Demo Mode: Profile updated in local demo view only.' });
      return { ok: true };
    }

    if (authState !== 'authenticated') {
      const msg = 'Please sign in before saving your health profile.';
      setSyncNotice({ type: 'error', text: msg });
      return { ok: false, error: msg };
    }

    if (!Number.isFinite(parsedAge) || parsedAge < 10 || parsedAge > 100) {
      const msg = 'Please enter a valid age between 10 and 100.';
      setSyncNotice({ type: 'error', text: msg });
      return { ok: false, error: msg };
    }
    if (!Number.isFinite(parsedHeight) || parsedHeight < 50 || parsedHeight > 250) {
      const msg = 'Please enter height in cm between 50 and 250.';
      setSyncNotice({ type: 'error', text: msg });
      return { ok: false, error: msg };
    }
    if (!Number.isFinite(parsedWeight) || parsedWeight < 20 || parsedWeight > 300) {
      const msg = 'Please enter weight in kg between 20 and 300.';
      setSyncNotice({ type: 'error', text: msg });
      return { ok: false, error: msg };
    }

    const backendProfile = {
      age: parsedAge,
      height: parsedHeight,
      weight: parsedWeight,
      diagnosis_status: mergedProfile.pcosStatus || 'Unsure',
      diagnosis_year: mergedProfile.diagnosisYear ? parseInt(mergedProfile.diagnosisYear, 10) : null,
      existing_conditions: mergedProfile.medicalConditions || [],
      medications: mergedProfile.medications || [],
    };

    try {
      setIsSyncing(true);
      let nextUser = authUser;
      const trimmedName = (mergedProfile.name || '').trim();
      if (trimmedName && authUser && trimmedName !== authUser.full_name) {
        nextUser = await apiClient.updateMe({ fullName: trimmedName });
        setAuthUser(nextUser);
        try {
          localStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(nextUser));
        } catch {
          // ignore
        }
      }

      let saved;
      try {
        saved = await apiClient.updateProfile(backendProfile);
      } catch (err) {
        if (err.status !== 404) throw err;
        saved = await apiClient.createProfile(backendProfile);
      }

      setDbConnected(true);
      const syncedProfile = {
        ...mergedProfile,
        name: nextUser?.full_name || mergedProfile.name,
        age: saved.age,
        heightCm: saved.height,
        weightKg: saved.weight,
        pcosStatus: saved.diagnosis_status,
        diagnosisYear: saved.diagnosis_year,
        medicalConditions: saved.existing_conditions || [],
        medications: saved.medications || [],
        initialized: true,
      };
      setProfile(syncedProfile);
      setCareGaps((prev) => prev.filter((g) => g.id !== 'gap-profile'));
      setSyncNotice({ type: 'success', text: 'Health profile saved to your account.' });
      return { ok: true };
    } catch (err) {
      if (err.isNetworkError) setDbConnected(false);
      setSyncNotice({ type: 'error', text: `Could not save profile: ${err.message}` });
      return { ok: false, error: err.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const logCycle = async ({ periodStartDate, periodEndDate, cycleLength, flowIntensity, notes }) => {
    const payload = {
      period_start_date: periodStartDate,
      period_end_date: periodEndDate || null,
      cycle_length: parseInt(cycleLength, 10) || 28,
      flow_intensity: flowIntensity || 'Medium',
      notes: notes || null,
    };

    if (authState === 'demo') {
      const nextHistory = [
        {
          cycle: new Date(`${payload.period_start_date}T00:00:00`).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
          length: payload.cycle_length,
          flowDays: 5,
          status: payload.cycle_length <= 35 ? 'Regular' : 'Irregular',
        },
        ...(cycleData.history || []),
      ];
      setCycleData((prev) => ({ ...prev, totalDays: payload.cycle_length, history: nextHistory }));
      setSyncNotice({ type: 'info', text: 'Demo Mode: Cycle updated locally only.' });
      return { ok: true };
    }

    if (authState !== 'authenticated') {
      return { ok: false, error: 'Please sign in to save cycle records.' };
    }

    try {
      setIsSyncing(true);
      await apiClient.createCycle(payload);
      const updatedCycles = await apiClient.getCycles();
      setDbConnected(true);
      setCycleData(deriveCycleDataFromBackend(updatedCycles));
      setSyncNotice({ type: 'success', text: 'Cycle record saved to your account.' });
      return { ok: true };
    } catch (err) {
      if (err.isNetworkError) setDbConnected(false);
      setSyncNotice({ type: 'error', text: `Could not save cycle: ${err.message}` });
      return { ok: false, error: err.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const addDailyLog = async (newLog) => {
    const todayStr = new Date().toISOString().split('T')[0];

    const activity = {
      id: Date.now(),
      type: 'log',
      title: 'Logged Daily Symptoms',
      detail: `Sleep ${newLog.sleepHours || 7}h, Stress ${newLog.stressLevel || 2}/5, Symptoms: ${newLog.symptoms?.join(', ') || 'None noted'}`,
      time: todayStr,
      icon: 'Activity',
    };

    const timelineEntry = {
      id: `t-${Date.now()}`,
      date: todayStr,
      category: 'symptom',
      title: `Daily Log - Cycle Day ${cycleData.currentDay}`,
      description: `Symptoms recorded: ${newLog.symptoms?.join(', ') || 'Mild/Normal'}. Sleep: ${newLog.sleepHours || 7} hrs. Energy: ${newLog.energyLevel || 'Moderate'}.`,
      badge: 'Symptom Log',
      badgeColor: 'amber',
    };

    if (authState === 'demo') {
      setRecentActivities((prev) => [activity, ...prev.slice(0, 9)]);
      setTimeline((prev) => [timelineEntry, ...prev]);
      setCareGaps((prev) => prev.filter((g) => g.id !== 'gap-3'));
      setSyncNotice({ type: 'info', text: 'Demo Mode: Daily log kept locally only.' });
      return { ok: true };
    }

    if (authState !== 'authenticated') {
      return { ok: false, error: 'Please sign in to save daily logs.' };
    }

    const acneSeverity = newLog.symptoms?.includes('Acne Breakout') ? 'Moderate' : 'None';
    const fatigueLevel = newLog.symptoms?.includes('Severe Fatigue')
      ? 8
      : newLog.symptoms?.includes('Mild Fatigue')
      ? 4
      : 2;
    const bloatingLevel = newLog.symptoms?.includes('Bloating / Water Retention') ? 5 : 1;
    const pelvicPainLevel = newLog.symptoms?.includes('Pelvic Cramping') ? 6 : 1;
    const sleepHoursVal = parseFloat(newLog.sleepHours) || 7.5;
    const stressLevelVal = parseInt(newLog.stressLevel, 10) || 2;
    const trendPoint = {
      month: todayStr,
      fatigue: fatigueLevel,
      acne: acneSeverity === 'Moderate' ? 5 : 1,
      bloating: bloatingLevel,
      mood: 5,
      sleepHours: sleepHoursVal,
      stress: stressLevelVal,
    };

    try {
      setIsSyncing(true);
      await apiClient.createSymptom({
        log_date: todayStr,
        acne_severity: acneSeverity,
        fatigue_level: fatigueLevel,
        bloating: bloatingLevel,
        pelvic_pain: pelvicPainLevel,
        mood: newLog.energyLevel || 'Moderate',
        notes: newLog.notes || null,
      });

      await apiClient.createLifestyle({
        log_date: todayStr,
        sleep_hours: sleepHoursVal,
        stress_level: stressLevelVal,
        water_intake: parseFloat(newLog.waterGlasses) || 8.0,
        exercise_minutes: 30,
        food_habits: 'Balanced',
        meal_regularity: 'Regular',
      });

      setDbConnected(true);
      setRecentActivities((prev) => [activity, ...prev.slice(0, 9)]);
      setTimeline((prev) => [timelineEntry, ...prev]);
      setSymptomTrends((prev) => [...prev.slice(-11), trendPoint]);
      setCareGaps((prev) => prev.filter((g) => g.id !== 'gap-3'));
      setSyncNotice({ type: 'success', text: 'Daily symptoms and lifestyle log saved.' });
      return { ok: true };
    } catch (err) {
      if (err.isNetworkError) setDbConnected(false);
      setSyncNotice({ type: 'error', text: `Could not save daily log: ${err.message}` });
      return { ok: false, error: err.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const addLabReport = async (newReport) => {
    const timelineEntry = {
      id: `t-${Date.now()}`,
      date: newReport.date || new Date().toISOString().split('T')[0],
      category: 'lab',
      title: `Lab Report Uploaded: ${newReport.filename || 'New Panel'}`,
      description: `Extracted ${newReport.tests?.length || 0} biomarkers. Status: Verified.`,
      badge: 'Lab Results',
      badgeColor: 'purple',
    };

    const activity = {
      id: Date.now(),
      type: 'lab',
      title: 'Lab Report Decoded',
      detail: newReport.filename || 'New Diagnostic Panel',
      time: newReport.date || new Date().toISOString().split('T')[0],
      icon: 'FileText',
    };

    if (authState === 'demo') {
      setLabReports((prev) => [newReport, ...prev]);
      setTimeline((prev) => [timelineEntry, ...prev]);
      setRecentActivities((prev) => [activity, ...prev.slice(0, 9)]);
      setCareGaps((prev) => prev.filter((g) => g.id !== 'gap-1'));
      setSyncNotice({ type: 'info', text: 'Demo Mode: Sample lab added locally only.' });
      return { ok: true };
    }

    if (authState !== 'authenticated') {
      return { ok: false, error: 'Please sign in to save lab reports.' };
    }

    try {
      setIsSyncing(true);
      if (newReport.tests && newReport.tests.length > 0) {
        for (const test of newReport.tests) {
          const parsedValue = Number(test.value);
          if (!Number.isFinite(parsedValue)) {
            throw new Error(`Invalid numeric value for ${test.name || 'biomarker'}`);
          }
          await apiClient.createLabReport({
            report_name: newReport.filename || 'Diagnostic Panel',
            test_name: test.name,
            test_value: parsedValue,
            unit: test.unit || 'units',
            reference_range: test.normalRange || 'N/A',
            report_date: newReport.date || new Date().toISOString().split('T')[0],
          });
        }
      }
      const backendLabs = await apiClient.getLabReports();
      setDbConnected(true);
      setLabReports(groupLabReportsFromBackend(backendLabs));
      setTimeline((prev) => [timelineEntry, ...prev]);
      setRecentActivities((prev) => [activity, ...prev.slice(0, 9)]);
      setCareGaps((prev) => prev.filter((g) => g.id !== 'gap-1'));
      setSyncNotice({ type: 'success', text: 'Lab biomarkers saved to your account.' });
      return { ok: true };
    } catch (err) {
      if (err.isNetworkError) setDbConnected(false);
      setSyncNotice({ type: 'error', text: `Could not save lab report: ${err.message}` });
      return { ok: false, error: err.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const addTimelineEvent = (event) => {
    const newEntry = {
      id: `t-${Date.now()}`,
      ...event,
    };
    setTimeline((prev) => [newEntry, ...prev]);
  };

  const resolveCareGap = (gapId) => {
    setCareGaps((prev) => prev.filter((g) => g.id !== gapId));
  };

  const markNotificationRead = (notifId) => {
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, unread: false } : n)));
  };

  const isDemoMode = authState === 'demo';
  const isUserLoggedIn = authState === 'authenticated';

  return (
    <HealthContext.Provider
      value={{
        authState,
        authUser,
        isDemoMode,
        isUserLoggedIn,
        login,
        register,
        logout,
        enterDemoMode,
        profile,
        updateProfile,
        cycleData,
        setCycleData,
        logCycle,
        labReports,
        addLabReport,
        setLabReports,
        clinicalRecords,
        timeline,
        addTimelineEvent,
        careGaps,
        resolveCareGap,
        symptomTrends,
        correlations: isDemoMode ? correlations : [],
        historicalMetabolic: isDemoMode ? historicalMetabolic : [],
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
        notifications,
        markNotificationRead,
        addDailyLog,
        resetToDemo,
        isSyncing,
        dbConnected,
        syncNotice,
        setSyncNotice,
      }}
    >
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
