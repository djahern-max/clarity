/**
 * Service for interacting with QuickBooks API via our backend
 */
import API_BASE from '../config/api';

class QuickBooksService {
  /**
   * Get authentication URL for QuickBooks OAuth
   * @returns {Promise<{auth_url: string}>} Authentication URL
   */
  static async getAuthUrl() {
    try {
      const response = await fetch(`${API_BASE}/auth-url`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      throw error;
    }
  }

  /**
   * Check connection status with QuickBooks
   * @param {string} realmId - Optional realm ID to check
   * @returns {Promise<{connected: boolean, realmId: string}>} Connection status
   */
  static async checkConnectionStatus(realmId = '') {
    try {
      const endpoint = realmId
        ? `/api/financial/connection-status/${realmId}`
        : '/api/financial/connection-status';

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to check connection status:', error);
      throw error;
    }
  }

  /**
   * Get company name from QuickBooks
   * @param {string} realmId - Realm ID
   * @returns {Promise<{companyName: string}>} Company name
   */
  static async getCompanyName(realmId) {
    try {
      const response = await fetch(`/api/financial/company-name/${realmId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get company name:', error);
      throw error;
    }
  }

  /**
   * Get financial statement data
   * @param {string} statementType - Type of statement (profit-loss, balance-sheet, cash-flow)
   * @param {string} realmId - Optional realm ID
   * @returns {Promise<Object>} Statement data
   */
  static async getFinancialStatement(statementType, realmId = '') {
    try {
      const queryParams = realmId ? `?realm_id=${realmId}` : '';
      const response = await fetch(`/api/financial/statements/${statementType}${queryParams}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to get ${statementType} data:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from QuickBooks
   * @param {string} realmId - Realm ID to disconnect
   * @returns {Promise<Object>} Result of disconnect operation
   */
  static async disconnect(realmId) {
    try {
      const response = await fetch(`/api/financial/disconnect/${realmId}`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to disconnect from QuickBooks:', error);
      throw error;
    }
  }
}

export default QuickBooksService;
