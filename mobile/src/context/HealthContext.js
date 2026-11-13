// PCOS360 Health Context - Central Mobile Auth, State & Persistence
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initialProfile,
  initialCycleData,
  initialRecentActivity,
  initialSymptomTrendData,
  initialLabReports,
  initialCareGaps,
  initialTimeline,
  initialAIInsights,
} from '../data/initialData';
import {
  apiClient,
  getApiBaseUrl,
  getDefaultApiBaseUrl,
  setApiBaseUrl,
  isLocalOrDevUrl,
  loadAuthToken,
  clearAuthToken,
  setUnauthorizedHandler,
} from '../services/api';

const HealthContext = createContext(null);
const API_URL_STORAGE_KEY = '@pcos360_v1_api_url';
const AUTH_USER_STORAGE_KEY = '@pcos360_auth_user_v1';

function getUserCacheKey(userId) {
  return `@pcos360_u_${userId}_v1`;
}

function createEmptyProfile(user) {
  const fullName = user?.full_name || '';
  return {
    name: fullName ? fullName.split(' ')[0] : '',
    fullName,
    age: null,
    heightCm: null,
    weightKg: null,
    pcosStatus: 'Unsure',
    diagnosisYear: new Date().getFullYear(),
    medicalConditions: [],
    medications: [],
    initialized: false,
  };
}

function createEmptyCycleData() {
  return {
    currentDay: 1,
    totalDays: 28,
    phase: 'No cycle logged yet',
    phaseDescription: 'Log your recent period or daily symptoms to begin cycle tracking.',
    nextPeriodEstimated: 'Pending cycle log',
    history: [],
  };
}

function mapSeverityRatingToLabel(val) {
  if (typeof val === 'string') return val;
  const labels = { 1: 'None', 2: 'Minimal', 3: 'Mild', 4: 'Moderate', 5: 'Severe' };
  return labels[Number(val)] || 'Mild';
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
  const nextPeriodEstimated = Number.isFinite(startMs)
    ? nextStart.toISOString().split('T')[0]
    : 'Pending cycle log';

  return {
    currentDay,
    totalDays,
    phase,
    phaseDescription: `Derived from your logged cycle starting ${latest.period_start_date}.`,
    nextPeriodEstimated,
    history: cycles.map((c) => ({
      id: c.id,
      cycle: c.period_start_date,
      length: c.cycle_length,
      flowDays: 5,
      status: c.cycle_length <= 35 ? 'Regular' : 'Irregular',
    })),
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
        filename: row.report_name,
        displayName: row.report_name,
        labName: 'Saved Account Record',
        date: row.report_date,
        status: 'Analyzed',
        verified: true,
        tests: [],
      });
    }
    grouped.get(key).tests.push({
      id: row.id,
      name: row.test_name,
      value: row.test_value,
      unit: row.unit,
      normalRange: row.reference_range,
      status: classifyLabStatus(row),
      interpretation: `Recorded on ${row.report_date}. Reference: ${row.reference_range} ${row.unit}. Informational reference comparison only — not a medical diagnosis.`,
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
      description: 'Add age, height, weight, and diagnosis history.',
      severity: 'Medium',
      dueText: 'Recommended',
    });
  }
  if (!labReports || labReports.length === 0) {
    gaps.push({
      id: 'gap-labs',
      title: 'Upload Baseline Lab Biomarkers',
      description: 'No lab reports saved to your account yet.',
      severity: 'Medium',
      dueText: 'When available',
    });
  }
  if (!symptoms || symptoms.length === 0) {
    gaps.push({
      id: 'gap-symptoms',
      title: 'Log Your First Daily Check-In',
      description: 'Record fatigue, acne, bloating, and sleep duration.',
      severity: 'Low',
      dueText: 'Today',
    });
  }
  return gaps;
}

function buildTimelineAndActivity(cycles, symptoms, lifestyle, labs) {
  const nextTimeline = [];
  const nextActivities = [];

  for (const c of cycles || []) {
    nextTimeline.push({
      id: `cyc-${c.id}`,
      date: c.period_start_date,
      category: 'cycle',
      title: `Cycle Logged (${c.cycle_length} days)`,
      description: `Flow: ${c.flow_intensity || 'Medium'}`,
      badge: 'Cycle',
      badgeColor: '#E8B8D0',
    });
    nextActivities.push({
      id: `act-c-${c.id}`,
      type: 'cycle',
      title: 'Cycle Recorded',
      detail: `${c.period_start_date} • ${c.cycle_length} days`,
      time: c.period_start_date,
      icon: 'Calendar',
    });
  }

  for (const s of symptoms || []) {
    nextTimeline.push({
      id: `sym-${s.id}`,
      date: s.log_date,
      category: 'symptom',
      title: 'Daily Symptoms Logged',
      description: `Fatigue: ${s.fatigue_level ?? '-'}/10, Bloating: ${s.bloating ?? '-'}/10, Acne: ${s.acne_severity || 'None'}`,
      badge: 'Symptoms',
      badgeColor: '#E8B8D0',
    });
    nextActivities.push({
      id: `act-s-${s.id}`,
      type: 'log',
      title: 'Logged Daily Symptoms',
      detail: `Fatigue: ${s.fatigue_level ?? '-'}/10, Mood: ${s.mood || 'N/A'}`,
      time: s.log_date,
      icon: 'Activity',
    });
  }

  for (const l of lifestyle || []) {
    nextActivities.push({
      id: `act-l-${l.id}`,
      type: 'log',
      title: 'Lifestyle Saved',
      detail: `Sleep ${l.sleep_hours}h, Stress ${l.stress_level}/5`,
      time: l.log_date,
      icon: 'Activity',
    });
  }

  for (const rep of labs || []) {
    nextTimeline.push({
      id: `lab-${rep.id}`,
      date: rep.date,
      category: 'lab',
      title: `Lab Panel: ${rep.filename}`,
      description: `${rep.tests?.length || 0} biomarkers saved securely.`,
      badge: 'Lab',
      badgeColor: '#7950A8',
    });
    nextActivities.push({
      id: `act-lab-${rep.id}`,
      type: 'lab',
      title: 'Lab Report Decoded',
      detail: rep.filename,
      time: rep.date,
      icon: 'FileText',
    });
  }

  nextTimeline.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  nextActivities.sort((a, b) => String(b.time).localeCompare(String(a.time)));
  return { timeline: nextTimeline, activities: nextActivities.slice(0, 10) };
}

export function HealthProvider({ children }) {
  const [authState, setAuthState] = useState('loading'); // 'loading' | 'signed_out' | 'authenticated' | 'demo'
  const [authUser, setAuthUser] = useState(null);

  const [profile, setProfile] = useState(() => createEmptyProfile(null));
  const [cycleData, setCycleData] = useState(() => createEmptyCycleData());
  const [labReports, setLabReports] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [careGaps, setCareGaps] = useState([]);
  const [symptomTrends, setSymptomTrends] = useState([]);
  const [insights, setInsights] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Connection & Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [apiServerUrl, setApiServerUrlState] = useState(getApiBaseUrl());

  const clearAccountState = useCallback(() => {
    setAuthUser(null);
    setProfile(createEmptyProfile(null));
    setCycleData(createEmptyCycleData());
    setLabReports([]);
    setTimeline([]);
    setCareGaps([]);
    setSymptomTrends([]);
    setInsights([]);
    setRecentActivities([]);
  }, []);

  const persistUserCache = useCallback(async (userId, payload) => {
    if (!userId) return;
    try {
      await AsyncStorage.setItem(getUserCacheKey(userId), JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not persist user cache:', e);
    }
  }, []);

  const checkBackendStatus = useCallback(async () => {
    try {
      const health = await apiClient.checkHealth();
      const connected = Boolean(health && health.status === 'healthy');
      setDbConnected(connected);
      return connected;
    } catch {
      setDbConnected(false);
      return false;
    }
  }, []);

  const hydrateAuthenticatedUser = useCallback(
    async (user, { isNewRegistration = false } = {}) => {
      clearAccountState();
      setAuthUser(user);
      setLastError(null);
      setIsSyncing(true);

      try {
        await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      } catch {
        // ignore
      }

      // Load user-scoped offline cache immediately while fresh network fetch executes
      try {
        const cachedRaw = await AsyncStorage.getItem(getUserCacheKey(user.id));
        if (cachedRaw && !isNewRegistration) {
          const cached = JSON.parse(cachedRaw);
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
      } catch {
        // ignore parse errors
      }

      try {
        const [backendProfile, backendCycles, backendSymptoms, backendLifestyle, backendLabs] =
          await Promise.all([
            apiClient.getProfile(),
            apiClient.getCycles(),
            apiClient.getSymptoms(),
            apiClient.getLifestyle(),
            apiClient.getLabReports(),
          ]);

        setDbConnected(true);

        const mappedProfile = backendProfile
          ? {
              name: (user.full_name || '').split(' ')[0] || 'Member',
              fullName: user.full_name,
              age: backendProfile.age,
              heightCm: backendProfile.height,
              weightKg: backendProfile.weight,
              pcosStatus: backendProfile.diagnosis_status || 'Unsure',
              diagnosisYear: backendProfile.diagnosis_year || new Date().getFullYear(),
              medicalConditions: backendProfile.existing_conditions || [],
              medications: backendProfile.medications || [],
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
            acne: s.acne_severity === 'Severe' ? 8 : s.acne_severity === 'Moderate' ? 5 : 2,
            bloating: s.bloating ?? 0,
          }));

        setProfile(mappedProfile);
        setCycleData(mappedCycles);
        setLabReports(mappedLabs);
        setTimeline(mappedTimeline);
        setCareGaps(mappedGaps);
        setSymptomTrends(mappedTrends);
        setInsights([]);
        setRecentActivities(mappedActivities);
        setAuthState('authenticated');

        await persistUserCache(user.id, {
          profile: mappedProfile,
          cycleData: mappedCycles,
          labReports: mappedLabs,
          timeline: mappedTimeline,
          careGaps: mappedGaps,
          symptomTrends: mappedTrends,
          recentActivities: mappedActivities,
        });
      } catch (err) {
        if (err.status === 401) {
          await clearAuthToken();
          await AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY).catch(() => {});
          clearAccountState();
          setAuthState('signed_out');
          setLastError('Your session expired. Please sign in again.');
        } else {
          setDbConnected(false);
          setLastError(`Offline: ${err.message}. Showing cached records for ${user.email}.`);
          setAuthState('authenticated');
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [clearAccountState, persistUserCache]
  );

  // Global 401 session expiration handler
  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY).catch(() => {});
      clearAccountState();
      setAuthState('signed_out');
      setLastError('Session expired or signed out. Please sign in again.');
    });
    return () => setUnauthorizedHandler(null);
  }, [clearAccountState]);

  // Startup: restore saved API URL + verify saved auth session
  useEffect(() => {
    let active = true;

    async function initMobileSession() {
      try {
        const savedUrl = await AsyncStorage.getItem(API_URL_STORAGE_KEY);
        const defaultUrl = getDefaultApiBaseUrl();
        // If savedUrl is a legacy local development IP (192.168.*, localhost, 10.0.2.2) and the build has a cloud HTTPS URL,
        // automatically clear the obsolete local override and adopt the cloud URL.
        if (savedUrl && isLocalOrDevUrl(savedUrl) && /^https:\/\//i.test(defaultUrl)) {
          await AsyncStorage.removeItem(API_URL_STORAGE_KEY);
          const appliedUrl = setApiBaseUrl(defaultUrl);
          if (active) setApiServerUrlState(appliedUrl);
        } else if (savedUrl) {
          const appliedUrl = setApiBaseUrl(savedUrl);
          if (active) setApiServerUrlState(appliedUrl);
        }
      } catch {
        // ignore
      }

      const token = await loadAuthToken();

      if (!token) {
        if (active) {
          clearAccountState();
          setAuthState('signed_out');
        }
        // Check backend reachability asynchronously so WelcomeScreen opens immediately offline.
        void checkBackendStatus();
        return;
      }

      try {
        const user = await apiClient.getMe({ timeoutMs: 3500 });
        if (active && user) {
          setDbConnected(true);
          await hydrateAuthenticatedUser(user);
        }
      } catch (err) {
        if (!active) return;
        if (err.isNetworkError) {
          try {
            const cachedUserRaw = await AsyncStorage.getItem(AUTH_USER_STORAGE_KEY);
            const cachedUser = cachedUserRaw ? JSON.parse(cachedUserRaw) : null;
            if (cachedUser?.id) {
              const cachedDataRaw = await AsyncStorage.getItem(getUserCacheKey(cachedUser.id));
              const cachedData = cachedDataRaw ? JSON.parse(cachedDataRaw) : null;
              setAuthUser(cachedUser);
              setDbConnected(false);
              if (cachedData?.profile) setProfile(cachedData.profile);
              if (cachedData?.cycleData) setCycleData(cachedData.cycleData);
              if (cachedData?.labReports) setLabReports(cachedData.labReports);
              if (cachedData?.timeline) setTimeline(cachedData.timeline);
              if (cachedData?.careGaps) setCareGaps(cachedData.careGaps);
              if (cachedData?.symptomTrends) setSymptomTrends(cachedData.symptomTrends);
              if (cachedData?.recentActivities) setRecentActivities(cachedData.recentActivities);
              setLastError(`Offline mode — cached data for ${cachedUser.email}. Saving requires connection.`);
              setAuthState('authenticated');
              return;
            }
          } catch {
            // fall through to signed_out
          }
        }

        await clearAuthToken();
        await AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY).catch(() => {});
        clearAccountState();
        setAuthState('signed_out');
        setLastError(err.status === 401 ? 'Session expired. Please sign in again.' : err.message);
      }
    }

    initMobileSession();
    const interval = setInterval(checkBackendStatus, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [checkBackendStatus, clearAccountState, hydrateAuthenticatedUser]);

  // Auth Actions
  const login = async ({ email, password }) => {
    setLastError(null);
    const data = await apiClient.login({ email, password });
    await hydrateAuthenticatedUser(data.user, { isNewRegistration: false });
    return data.user;
  };

  const register = async ({ fullName, email, password }) => {
    setLastError(null);
    const data = await apiClient.register({ fullName, email, password });
    await hydrateAuthenticatedUser(data.user, { isNewRegistration: true });
    return data.user;
  };

  const logout = async () => {
    if (authState === 'authenticated') {
      await apiClient.logout();
    } else {
      await clearAuthToken();
    }
    await AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY).catch(() => {});
    clearAccountState();
    setLastError(null);
    setAuthState('signed_out');
  };

  const enterDemoMode = async () => {
    await clearAuthToken();
    await AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY).catch(() => {});
    setLastError(null);
    setAuthState('demo');
    setAuthUser({ id: null, full_name: initialProfile.fullName, email: null, isDemo: true });
    setProfile({ ...initialProfile, initialized: true });
    setCycleData(initialCycleData);
    setLabReports(initialLabReports);
    setTimeline(initialTimeline);
    setCareGaps(initialCareGaps);
    setSymptomTrends(initialSymptomTrendData);
    setInsights(initialAIInsights);
    setRecentActivities(initialRecentActivity);
  };

  // Update Health Profile (preserves existing_conditions/medications arrays & 404 -> createProfile upsert)
  const updateProfile = async (newProfileData) => {
    const updated = { ...profile, ...newProfileData };
    const parsedAge = parseInt(updated.age, 10);
    const parsedHeight = parseFloat(updated.heightCm);
    const parsedWeight = parseFloat(updated.weightKg);

    if (authState === 'demo') {
      setProfile({
        ...updated,
        age: Number.isFinite(parsedAge) ? parsedAge : updated.age,
        heightCm: Number.isFinite(parsedHeight) ? parsedHeight : updated.heightCm,
        weightKg: Number.isFinite(parsedWeight) ? parsedWeight : updated.weightKg,
        initialized: true,
      });
      return { ok: true, demo: true };
    }

    if (authState !== 'authenticated') {
      const msg = 'Please sign in before saving your health profile.';
      setLastError(msg);
      return { ok: false, error: msg };
    }

    if (!Number.isFinite(parsedAge) || parsedAge < 10 || parsedAge > 100) {
      return { ok: false, error: 'Please enter a valid age between 10 and 100.' };
    }
    if (!Number.isFinite(parsedHeight) || parsedHeight < 50 || parsedHeight > 250) {
      return { ok: false, error: 'Please enter height in cm between 50 and 250.' };
    }
    if (!Number.isFinite(parsedWeight) || parsedWeight < 20 || parsedWeight > 300) {
      return { ok: false, error: 'Please enter weight in kg between 20 and 300.' };
    }

    const backendProfile = {
      age: parsedAge,
      height: parsedHeight,
      weight: parsedWeight,
      diagnosis_status: updated.pcosStatus || 'Unsure',
      diagnosis_year: updated.diagnosisYear ? parseInt(updated.diagnosisYear, 10) : null,
      existing_conditions: updated.medicalConditions || [],
      medications: updated.medications || [],
    };

    try {
      setIsSyncing(true);
      let nextUser = authUser;
      const requestedFullName = (updated.fullName || updated.name || '').trim();
      if (requestedFullName && authUser && requestedFullName !== authUser.full_name) {
        nextUser = await apiClient.updateMe({ fullName: requestedFullName });
        setAuthUser(nextUser);
        await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser)).catch(() => {});
      }

      let saved;
      try {
        saved = await apiClient.updateProfile(backendProfile);
      } catch (e) {
        if (e.status !== 404) throw e;
        saved = await apiClient.createProfile(backendProfile);
      }

      setDbConnected(true);
      setLastError(null);
      const syncedProfile = {
        ...updated,
        name: ((nextUser?.full_name || updated.fullName || 'Member').split(' ')[0]),
        fullName: nextUser?.full_name || updated.fullName,
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
      const nextGaps = careGaps.filter((g) => g.id !== 'gap-profile');
      setCareGaps(nextGaps);
      await persistUserCache(authUser.id, {
        profile: syncedProfile,
        cycleData,
        labReports,
        timeline,
        careGaps: nextGaps,
        symptomTrends,
        recentActivities,
      });
      return { ok: true };
    } catch (e) {
      if (e.isNetworkError) setDbConnected(false);
      setLastError(`Could not save profile: ${e.message}`);
      return { ok: false, error: e.message };
    } finally {
      setIsSyncing(false);
    }
  };

  // Log Daily Symptoms & Lifestyle
  const addDailyLog = async (logData) => {
    const todayStr = new Date().toISOString().split('T')[0];

    const newActivity = {
      id: Date.now(),
      type: 'log',
      title: 'Logged Daily Symptoms',
      detail: `Fatigue: ${logData.fatigueLevel}/10, Sleep: ${logData.sleepHours || 7}h, Mood: ${logData.mood || 'Calm'}`,
      time: todayStr,
      icon: 'Activity',
    };

    const newTimelineItem = {
      id: `t-${Date.now()}`,
      date: todayStr,
      category: 'symptom',
      title: 'Daily Symptoms Logged',
      description: `Fatigue: ${logData.fatigueLevel}/10, Pelvic Pain: ${logData.pelvicPain}/10, Bloating: ${logData.bloating}/10`,
      badge: 'Symptoms',
      badgeColor: '#E8B8D0',
    };

    if (authState === 'demo') {
      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
      setTimeline((prev) => [newTimelineItem, ...prev]);
      return { ok: true, demo: true };
    }

    if (authState !== 'authenticated') {
      return { ok: false, error: 'Please sign in before logging symptoms.' };
    }

    const fatigueVal = Number.isFinite(Number(logData.fatigueLevel))
      ? Math.max(1, Math.min(10, Number(logData.fatigueLevel)))
      : 3;
    const bloatingVal = Number.isFinite(Number(logData.bloating))
      ? Math.max(1, Math.min(10, Number(logData.bloating)))
      : 2;
    const pelvicPainVal = Number.isFinite(Number(logData.pelvicPain))
      ? Math.max(1, Math.min(10, Number(logData.pelvicPain)))
      : 1;
    const acneVal = Number.isFinite(Number(logData.acneSeverity))
      ? Math.max(0, Math.min(10, Number(logData.acneSeverity)))
      : 2;
    const sleepVal = Number.isFinite(Number(logData.sleepHours))
      ? Number(logData.sleepHours)
      : 7.0;
    const stressVal = Number.isFinite(Number(logData.stressLevel))
      ? Math.max(1, Math.min(10, Number(logData.stressLevel)))
      : 3;
    const trendPoint = {
      month: todayStr,
      fatigue: fatigueVal,
      acne: acneVal,
      bloating: bloatingVal,
      mood: 5,
      sleepHours: sleepVal,
      stress: stressVal,
    };

    try {
      setIsSyncing(true);
      await apiClient.createSymptom({
        log_date: todayStr,
        fatigue_level: fatigueVal,
        acne_severity: mapSeverityRatingToLabel(logData.acneSeverity),
        bloating: bloatingVal,
        pelvic_pain: pelvicPainVal,
        mood: logData.mood || 'Calm',
        hair_loss: logData.hairLoss ? mapSeverityRatingToLabel(logData.hairLoss) : null,
        unwanted_hair_growth: logData.unwantedHair ? mapSeverityRatingToLabel(logData.unwantedHair) : null,
        notes: logData.notes ? logData.notes.trim() : null,
      });

      await apiClient.createLifestyle({
        log_date: todayStr,
        sleep_hours: sleepVal,
        stress_level: stressVal,
        water_intake: Number.isFinite(Number(logData.waterIntake)) ? Number(logData.waterIntake) : 2.0,
        exercise_minutes: Number.isFinite(Number(logData.exerciseMinutes)) ? Number(logData.exerciseMinutes) : 0,
      });

      setDbConnected(true);
      setLastError(null);
      const updatedActivities = [newActivity, ...recentActivities.slice(0, 9)];
      const updatedTimeline = [newTimelineItem, ...timeline];
      const updatedTrends = [...symptomTrends.slice(-11), trendPoint];
      const nextGaps = careGaps.filter((g) => g.id !== 'gap-symptoms');
      setRecentActivities(updatedActivities);
      setTimeline(updatedTimeline);
      setSymptomTrends(updatedTrends);
      setCareGaps(nextGaps);

      await persistUserCache(authUser.id, {
        profile,
        cycleData,
        labReports,
        timeline: updatedTimeline,
        careGaps: nextGaps,
        symptomTrends: updatedTrends,
        recentActivities: updatedActivities,
      });
      return { ok: true };
    } catch (err) {
      if (err.isNetworkError) setDbConnected(false);
      setLastError(`Could not sync symptom log: ${err.message}`);
      return { ok: false, error: err.message };
    } finally {
      setIsSyncing(false);
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

    const newTimelineItem = {
      id: `t-${Date.now()}`,
      date: newReport.date,
      category: 'lab',
      title: 'Lab Report Decoded',
      description: `${newReport.filename} analyzed successfully`,
      badge: 'Lab',
      badgeColor: '#7950A8',
    };

    if (authState === 'demo') {
      setLabReports((prev) => [newReport, ...prev]);
      setTimeline((prev) => [newTimelineItem, ...prev]);
      return { ok: true, demo: true };
    }

    if (authState !== 'authenticated') {
      return { ok: false, error: 'Please sign in before saving lab reports.' };
    }

    try {
      setIsSyncing(true);
      if (report.tests && report.tests.length > 0) {
        for (const t of report.tests) {
          const parsedVal = Number(t.value);
          if (!Number.isFinite(parsedVal)) {
            throw new Error(`Invalid test value for ${t.name}`);
          }
          await apiClient.createLabReport({
            report_name: newReport.filename,
            test_name: t.name,
            test_value: parsedVal,
            unit: t.unit || 'units',
            reference_range: t.normalRange || 'N/A',
            report_date: newReport.date,
          });
        }
      }

      const backendLabs = await apiClient.getLabReports();
      const updatedReports = groupLabReportsFromBackend(backendLabs);
      const updatedTimeline = [newTimelineItem, ...timeline];
      const nextGaps = careGaps.filter((g) => g.id !== 'gap-labs');
      setDbConnected(true);
      setLastError(null);
      setLabReports(updatedReports);
      setTimeline(updatedTimeline);
      setCareGaps(nextGaps);

      await persistUserCache(authUser.id, {
        profile,
        cycleData,
        labReports: updatedReports,
        timeline: updatedTimeline,
        careGaps: nextGaps,
        symptomTrends,
        recentActivities,
      });
      return { ok: true };
    } catch (e) {
      if (e.isNetworkError) setDbConnected(false);
      setLastError(`Could not save lab report: ${e.message}`);
      return { ok: false, error: e.message };
    } finally {
      setIsSyncing(false);
    }
  };

  // Change backend URL (for physical device on Wi-Fi LAN, USB adb reverse, or Android emulator)
  const updateApiUrl = async (newUrl) => {
    const appliedUrl = setApiBaseUrl(newUrl);
    setApiServerUrlState(appliedUrl);
    if ((newUrl || '').trim()) {
      await AsyncStorage.setItem(API_URL_STORAGE_KEY, appliedUrl);
    } else {
      await AsyncStorage.removeItem(API_URL_STORAGE_KEY);
    }
    return await checkBackendStatus();
  };

  const defaultApiUrl = getDefaultApiBaseUrl();

  return (
    <HealthContext.Provider
      value={{
        authState,
        authUser,
        isDemoMode: authState === 'demo',
        isAuthenticated: authState === 'authenticated',
        login,
        register,
        logout,
        enterDemoMode,
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
        lastError,
        setLastError,
        checkBackendStatus,
        apiServerUrl,
        defaultApiUrl,
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
