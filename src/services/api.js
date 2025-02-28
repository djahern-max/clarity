/**
 * API service for Clarity application
 */
import API_BASE from '../config/api';

// Helper function for fetch requests
const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// API Methods
const api = {
  // Authentication
  getAuthUrl: () => fetchApi('/auth-url'),
  getConnectionStatus: (realmId) => fetchApi(`/connection-status/${realmId || ''}`),
  disconnect: (realmId) => fetchApi(`/disconnect/${realmId}`, { method: 'POST' }),

  // Company Info
  getCompanyName: (realmId) => fetchApi(`/company-name/${realmId}`),

  // Financial Data
  getAccounts: (realmId) => fetchApi(realmId ? `/accounts/${realmId}` : '/accounts'),
  getProfitLoss: (realmId) => fetchApi(`/statements/profit-loss${realmId ? `?realm_id=${realmId}` : ''}`),
  getBalanceSheet: (realmId) => fetchApi(`/statements/balance-sheet${realmId ? `?realm_id=${realmId}` : ''}`),
  getCashFlow: (realmId) => fetchApi(`/statements/cash-flow${realmId ? `?realm_id=${realmId}` : ''}`),
  getTrends: (realmId) => fetchApi(`/trends/${realmId}`),
  getStatementTrends: (realmId) => fetchApi(`/statements/trends/${realmId}`)
};

export default api;