// PCOS360 API Client - Integration-ready with Python FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = {
  // Health Profile
  async getProfile() {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return null; // Fallback to frontend state
    }
  },

  async updateProfile(profileData) {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      return await res.json();
    } catch {
      return profileData;
    }
  },

  // Daily Tracker
  async getDailyLogs() {
    try {
      const res = await fetch(`${API_BASE_URL}/tracker/logs`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async createDailyLog(logData) {
    try {
      const res = await fetch(`${API_BASE_URL}/tracker/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
      return await res.json();
    } catch {
      return logData;
    }
  },

  // Metabolic & Labs
  async getLabReports() {
    try {
      const res = await fetch(`${API_BASE_URL}/labs`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async uploadLabReport(formData) {
    try {
      const res = await fetch(`${API_BASE_URL}/labs/upload`, {
        method: 'POST',
        body: formData
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // What-If Simulator calculation
  async simulateWhatIf(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/simulator/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Consultation Copilot
  async generateConsultationReport(params) {
    try {
      const res = await fetch(`${API_BASE_URL}/copilot/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch {
      return null;
    }
  }
};
