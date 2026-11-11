// PCOS360 Mobile API Service - Communicates with FastAPI backend
import { NativeModules, Platform } from 'react-native';
import Constants from 'expo-constants';

// Auto-resolve backend host from Metro/Expo dev server URL:
// - Physical device via USB (`adb reverse`): localhost -> http://localhost:8000
// - Physical device via Wi-Fi LAN: <PC_IP> -> http://<PC_IP>:8000
// - Android Emulator: 10.0.2.2 -> http://10.0.2.2:8000
const resolveDefaultHost = () => {
  if (Platform.OS !== 'android') {
    return 'http://localhost:8000';
  }

  const scriptURL = NativeModules.SourceCode?.scriptURL;
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

  return 'http://10.0.2.2:8000';
};

const DEFAULT_HOST = resolveDefaultHost();

let currentBaseUrl = DEFAULT_HOST;

export const setApiBaseUrl = (newUrl) => {
  if (newUrl) {
    currentBaseUrl = newUrl.replace(/\/$/, '');
  }
};

export const getApiBaseUrl = () => currentBaseUrl;

async function request(endpoint, options = {}) {
  const url = `${currentBaseUrl}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for mobile

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(errorBody.detail || `HTTP Error ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.detail = errorBody.detail;
      throw error;
    }

    return await response.json();
  } catch (err) {
    if (err.status) throw err;
    const networkError = new Error(`Cannot connect to backend at ${currentBaseUrl}`);
    networkError.isNetworkError = true;
    throw networkError;
  }
}

export const apiClient = {
  // Base Health Check
  async checkHealth() {
    try {
      return await request('/api/health');
    } catch {
      return null;
    }
  },

  // Health Profile
  async getProfile(userId = 1) {
    try {
      return await request(`/api/profile/${userId}`);
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  async updateProfile(userId = 1, profileData) {
    return await request(`/api/profile/${userId}`, {
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
  async getCycles(userId = 1) {
    try {
      return await request(`/api/cycles/${userId}`);
    } catch (err) {
      console.warn('Could not fetch cycles from backend:', err.message);
      return [];
    }
  },

  async createCycle(cycleData) {
    return await request('/api/cycles/', {
      method: 'POST',
      body: JSON.stringify({ user_id: 1, ...cycleData }),
    });
  },

  async deleteCycle(cycleId) {
    return await request(`/api/cycles/${cycleId}`, {
      method: 'DELETE',
    });
  },

  // Daily Symptoms
  async getSymptoms(userId = 1) {
    try {
      return await request(`/api/symptoms/${userId}`);
    } catch (err) {
      console.warn('Could not fetch symptoms from backend:', err.message);
      return [];
    }
  },

  async createSymptom(symptomData) {
    return await request('/api/symptoms/', {
      method: 'POST',
      body: JSON.stringify({ user_id: 1, ...symptomData }),
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
  async getLifestyle(userId = 1) {
    try {
      return await request(`/api/lifestyle/${userId}`);
    } catch (err) {
      console.warn('Could not fetch lifestyle logs from backend:', err.message);
      return [];
    }
  },

  async createLifestyle(lifestyleData) {
    return await request('/api/lifestyle/', {
      method: 'POST',
      body: JSON.stringify({ user_id: 1, ...lifestyleData }),
    });
  },

  // Lab Reports
  async getLabReports(userId = 1) {
    try {
      return await request(`/api/lab-reports/${userId}`);
    } catch (err) {
      console.warn('Could not fetch lab reports from backend:', err.message);
      return [];
    }
  },

  async createLabReport(reportData) {
    return await request('/api/lab-reports/', {
      method: 'POST',
      body: JSON.stringify({ user_id: 1, ...reportData }),
    });
  },

  async deleteLabReport(reportId) {
    return await request(`/api/lab-reports/${reportId}`, {
      method: 'DELETE',
    });
  },

  // Clinical Records
  async getClinicalRecords(userId = 1) {
    try {
      return await request(`/api/clinical-records/${userId}`);
    } catch (err) {
      console.warn('Could not fetch clinical records from backend:', err.message);
      return [];
    }
  },

  async createClinicalRecord(recordData) {
    return await request('/api/clinical-records/', {
      method: 'POST',
      body: JSON.stringify({ user_id: 1, ...recordData }),
    });
  },
};

export default apiClient;

