// PCOS360 Mobile API Service - Authenticated FastAPI client
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const AUTH_TOKEN_KEY = '@pcos360_auth_token_v1';

export const normalizeApiBaseUrl = (rawUrl) => {
  const trimmed = (rawUrl || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
};

// Auto-resolve backend host:
// 1. Metro dev server host when running via USB (`adb reverse` -> localhost) or Wi-Fi Expo Go
// 2. Build-time EXPO_PUBLIC_API_URL from mobile/.env (for standalone Release APK over Wi-Fi)
// 3. Emulator host fallback (10.0.2.2) or localhost
const resolveDefaultHost = () => {
  if (Platform.OS !== 'android') {
    return 'http://localhost:8000';
  }

  const scriptURL =
    NativeModules.SourceCode?.getConstants?.()?.scriptURL ||
    NativeModules.SourceCode?.scriptURL;
  if (scriptURL && /^https?:\/\//i.test(scriptURL)) {
    const match = scriptURL.match(/^https?:\/\/([^/:]+)/i);
    if (match?.[1]) {
      return `http://${match[1]}:8000`;
    }
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host) {
      return `http://${host}:8000`;
    }
  }

  const configuredPublicUrl = normalizeApiBaseUrl(process.env.EXPO_PUBLIC_API_URL);
  if (configuredPublicUrl) {
    return configuredPublicUrl;
  }

  return Constants.isDevice ? 'http://localhost:8000' : 'http://10.0.2.2:8000';
};

const DEFAULT_HOST = resolveDefaultHost();

let currentBaseUrl = DEFAULT_HOST;
let cachedToken = null;
let unauthorizedHandler = null;

export const getDefaultApiBaseUrl = () => DEFAULT_HOST;

export const setApiBaseUrl = (newUrl) => {
  const normalized = normalizeApiBaseUrl(newUrl);
  currentBaseUrl = normalized || DEFAULT_HOST;
  return currentBaseUrl;
};

export const getApiBaseUrl = () => currentBaseUrl;

export async function loadAuthToken() {
  try {
    const stored = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    cachedToken = stored || null;
    return cachedToken;
  } catch {
    return cachedToken;
  }
}

export async function setAuthToken(token) {
  cachedToken = token || null;
  try {
    if (token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors gracefully
  }
}

export async function clearAuthToken() {
  await setAuthToken(null);
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;
}

function formatErrorDetail(detail, fallbackText) {
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item) => {
        const loc = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : '';
        const msg = item.msg || 'Invalid value';
        return loc ? `${loc}: ${msg}` : msg;
      })
      .join('; ');
  }
  return fallbackText;
}

async function request(endpoint, options = {}) {
  const url = `${currentBaseUrl}${endpoint}`;
  const {
    skipAuth = false,
    timeoutMs = 8000,
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  let token = cachedToken;
  if (!skipAuth && !token) {
    token = await loadAuthToken();
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (!skipAuth && token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  let timeoutId;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...defaultHeaders,
        ...customHeaders,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = formatErrorDetail(
        errorBody.detail,
        `HTTP Error ${response.status}: ${response.statusText}`
      );
      const error = new Error(message);
      error.status = response.status;
      error.detail = errorBody.detail;

      if (response.status === 401 && !skipAuth) {
        await clearAuthToken();
        if (unauthorizedHandler) {
          unauthorizedHandler(error);
        }
      }

      throw error;
    }

    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.status) throw err;
    const networkError = new Error(`Offline or cannot reach backend at ${currentBaseUrl}`);
    networkError.isNetworkError = true;
    throw networkError;
  }
}

export const apiClient = {
  // Base Health Check (public, fast timeout so offline startup never stalls)
  async checkHealth(options = {}) {
    try {
      return await request('/api/health', { skipAuth: true, timeoutMs: 2500, ...options });
    } catch {
      return null;
    }
  },

  // Authentication & Session
  async register({ fullName, email, password }) {
    const data = await request('/api/auth/register', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
      }),
    });
    if (data?.access_token) {
      await setAuthToken(data.access_token);
    }
    return data;
  },

  async login({ email, password }) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });
    if (data?.access_token) {
      await setAuthToken(data.access_token);
    }
    return data;
  },

  async logout() {
    const token = cachedToken || (await loadAuthToken());
    try {
      if (token) {
        await request('/api/auth/logout', { method: 'POST' });
      }
    } catch {
      // Ignore network/already-expired errors when signing out locally
    } finally {
      await clearAuthToken();
    }
  },

  async getMe(options = {}) {
    return await request('/api/auth/me', options);
  },

  async updateMe({ fullName }) {
    return await request('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify({ full_name: fullName }),
    });
  },

  // Health Profile
  async getProfile() {
    try {
      return await request('/api/profile/me');
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  async updateProfile(profileData) {
    return await request('/api/profile/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async createProfile(profileData) {
    return await request('/api/profile/', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // Menstrual Cycles
  async getCycles() {
    return await request('/api/cycles/');
  },

  async createCycle(cycleData) {
    return await request('/api/cycles/', {
      method: 'POST',
      body: JSON.stringify(cycleData),
    });
  },

  async deleteCycle(cycleId) {
    return await request(`/api/cycles/${cycleId}`, {
      method: 'DELETE',
    });
  },

  // Daily Symptoms
  async getSymptoms() {
    return await request('/api/symptoms/');
  },

  async createSymptom(symptomData) {
    return await request('/api/symptoms/', {
      method: 'POST',
      body: JSON.stringify(symptomData),
    });
  },

  async updateSymptom(symptomId, symptomData) {
    return await request(`/api/symptoms/${symptomId}`, {
      method: 'PUT',
      body: JSON.stringify(symptomData),
    });
  },

  async deleteSymptom(symptomId) {
    return await request(`/api/symptoms/${symptomId}`, {
      method: 'DELETE',
    });
  },

  // Lifestyle Logs
  async getLifestyle() {
    return await request('/api/lifestyle/');
  },

  async createLifestyle(lifestyleData) {
    return await request('/api/lifestyle/', {
      method: 'POST',
      body: JSON.stringify(lifestyleData),
    });
  },

  // Lab Reports
  async getLabReports() {
    return await request('/api/lab-reports/');
  },

  async createLabReport(reportData) {
    return await request('/api/lab-reports/', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  async deleteLabReport(reportId) {
    return await request(`/api/lab-reports/${reportId}`, {
      method: 'DELETE',
    });
  },

  // Clinical Records
  async getClinicalRecords() {
    return await request('/api/clinical-records/');
  },

  async createClinicalRecord(recordData) {
    return await request('/api/clinical-records/', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  },
};

export default apiClient;
