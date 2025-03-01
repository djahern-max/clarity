/**
 * Service for interacting with QuickBooks API via our backend
 */

class QuickBooksService {
  /**
   * Get authentication URL for QuickBooks OAuth
   * @returns {Promise<{auth_url: string}>} Authentication URL
   */
  static async getAuthUrl() {
    try {
      const response = await fetch(`/api/financial/auth-url`);
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

  // Add to QuickBooksService.js
  static handleAuthError(error) {
    // Check if error is related to authentication
    if (error.message && error.message.includes('401')) {
      // Clear any stored credentials
      localStorage.removeItem('qbCredentials');

      // Redirect to reconnect page
      window.location.href = '/reconnect';

      return true; // Handled
    }
    return false; // Not handled
  }

  // Then update your getFinancialStatement method
  static async getFinancialStatement(statementType, realmId = '', params = {}) {
    try {
      // ... existing code ...
    } catch (error) {
      // Check if this is an auth error and handle appropriately
      if (this.handleAuthError(error)) {
        throw new Error('Authentication expired. Please reconnect to QuickBooks.');
      }
      console.error(`Failed to get ${statementType} data:`, error);
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
  static async getFinancialStatement(statementType, realmId = '', params = {}) {
    try {
      let queryParams = new URLSearchParams();

      if (realmId) {
        queryParams.append('realm_id', realmId);
      }

      // Add any additional parameters (like as_of_date for balance sheet)
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const endpoint = `/api/financial/statements/${statementType}?${queryParams.toString()}`;

      console.log(`Calling endpoint: ${endpoint}`);

      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API response error: ${errorText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to get ${statementType} data:`, error);
      throw error;
    }
  }

  /**
 * Analyze financial data with AI
 * @param {string} reportType - Type of report (profit-loss, balance-sheet, cash-flow)
 * @param {Object} data - Financial data to analyze
 * @returns {Promise<Object>} Analysis results
 */
  static async analyzeFinancialData(reportType, data) {
    try {
      const response = await fetch(`/api/financial/analyze/${reportType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API analysis error: ${errorText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to analyze ${reportType} data:`, error);
      throw error;
    }
  }

  /**
  * Structure raw financial data using AI
  * @param {string} statementType - Type of statement (profit-loss, balance-sheet, cash-flow)
  * @param {Object} rawData - Raw financial data from QuickBooks
  * @returns {Promise<Object>} Structured financial statement
  */
  static async structureFinancialData(statementType, rawData) {
    try {
      const response = await fetch(`/api/financial/structure/${statementType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rawData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API structuring error: ${errorText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to structure ${statementType} data:`, error);
      throw error;
    }
  }

  /**
 * Get comparative financial statements for two periods
 * @param {string} statementType - Type of statement (profit-loss, balance-sheet, cash-flow)
 * @param {string} realmId - Optional realm ID
 * @param {Object} currentPeriod - Current period dates { startDate, endDate }
 * @param {Object} previousPeriod - Previous period dates { startDate, endDate }
 * @returns {Promise<Object>} Comparative statement data
 */
  static async getComparativeStatement(statementType, realmId = '', currentPeriod, previousPeriod) {
    try {
      let queryParams = new URLSearchParams();

      if (realmId) {
        queryParams.append('realm_id', realmId);
      }

      // Add current period params
      if (currentPeriod) {
        queryParams.append('current_start_date', currentPeriod.startDate);
        queryParams.append('current_end_date', currentPeriod.endDate);
      }

      // Add previous period params
      if (previousPeriod) {
        queryParams.append('previous_start_date', previousPeriod.startDate);
        queryParams.append('previous_end_date', previousPeriod.endDate);
      }

      const endpoint = `/api/financial/comparative/${statementType}?${queryParams.toString()}`;

      console.log(`Calling endpoint: ${endpoint}`);

      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API response error: ${errorText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to get comparative ${statementType} data:`, error);
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