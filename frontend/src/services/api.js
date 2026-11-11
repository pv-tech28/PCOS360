// PCOS360 API Service - Authenticated FastAPI client

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
const AUTH_TOKEN_KEY = 'pcos360_auth_token_v1';

let unauthorizedHandler = null;

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // Ignore storage quota / privacy mode failures gracefully
  }
}

export function clearAuthToken() {
  setAuthToken(null);
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
  const url = `${API_BASE_URL}${endpoint}`;
  const { skipAuth = false, headers: customHeaders = {}, ...fetchOptions } = options;
  const token = skipAuth ? null : getAuthToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...defaultHeaders,
        ...customHeaders,
      },
    });

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
        clearAuthToken();
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
    if (err.status) throw err;
    const networkError = new Error(`Offline or backend unreachable at ${API_BASE_URL}`);
    networkError.isNetworkError = true;
    throw networkError;
  }
}

export const apiClient = {
  baseUrl: API_BASE_URL,

  // Base Health (public)
  async checkHealth() {
    try {
      return await request('/api/health', { skipAuth: true });
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
      setAuthToken(data.access_token);
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
      setAuthToken(data.access_token);
    }
    return data;
  },

  async logout() {
    const token = getAuthToken();
    try {
      if (token) {
        await request('/api/auth/logout', { method: 'POST' });
      }
    } catch {
      // Ignore network/already-expired errors when signing out locally
    } finally {
      clearAuthToken();
    }
  },

  async getMe() {
    return await request('/api/auth/me');
  },

  async updateMe({ fullName }) {
    return await request('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify({ full_name: fullName }),
    });
  },

  // Health Profile (derived strictly from authenticated session)
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
