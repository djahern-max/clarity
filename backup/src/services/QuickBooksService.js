// src/services/QuickBooksService.js - Service for communicating with the QuickBooks API

import axios from 'axios';

// Base API URL - should match your FastAPI server
const API_BASE_URL = 'https://clarity.ryze.ai/api';

class QuickBooksService {
    /**
     * Get the QuickBooks authorization URL
     * @returns {Promise<string>} The authorization URL
     */
    async getAuthUrl() {
        try {
            const response = await axios.get(`${API_BASE_URL}/financial/auth-url`);
            return response.data.auth_url;
        } catch (error) {
            console.error('Error getting auth URL:', error);
            throw error;
        }
    }

    /**
     * Check if connected to QuickBooks
     * @param {string} realmId - The QuickBooks realm ID
     * @returns {Promise<Object>} Connection status info
     */
    async checkConnectionStatus(realmId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/financial/connection-status/${realmId}`);
            return response.data;
        } catch (error) {
            console.error('Error checking connection status:', error);
            throw error;
        }
    }

    /**
     * Get company name from QuickBooks
     * @param {string} realmId - The QuickBooks realm ID
     * @returns {Promise<Object>} Company information
     */
    async getCompanyName(realmId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/financial/company-name/${realmId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting company name:', error);
            return { company_name: 'Your Company' }; // Fallback name
        }
    }

    /**
     * Get Profit & Loss statement from QuickBooks
     * @param {string} realmId - The QuickBooks realm ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<Object>} Profit & Loss data
     */
    async getProfitAndLoss(realmId, startDate, endDate) {
        try {
            // Construct query parameters
            let params = new URLSearchParams();
            if (realmId) params.append('realm_id', realmId);
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);

            const response = await axios.get(
                `${API_BASE_URL}/financial/statements/profit-loss?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching Profit & Loss statement:', error);
            throw error;
        }
    }

    /**
     * Get Balance Sheet from QuickBooks
     * @param {string} realmId - The QuickBooks realm ID
     * @param {string} asOfDate - As of date (YYYY-MM-DD)
     * @returns {Promise<Object>} Balance Sheet data
     */
    async getBalanceSheet(realmId, asOfDate) {
        try {
            // Construct query parameters
            let params = new URLSearchParams();
            if (realmId) params.append('realm_id', realmId);
            if (asOfDate) params.append('as_of_date', asOfDate);

            const response = await axios.get(
                `${API_BASE_URL}/financial/statements/balance-sheet?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching Balance Sheet:', error);
            throw error;
        }
    }

    /**
     * Get Cash Flow statement from QuickBooks
     * @param {string} realmId - The QuickBooks realm ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<Object>} Cash Flow data
     */
    async getCashFlow(realmId, startDate, endDate) {
        try {
            // Construct query parameters
            let params = new URLSearchParams();
            if (realmId) params.append('realm_id', realmId);
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);

            const response = await axios.get(
                `${API_BASE_URL}/financial/statements/cash-flow?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching Cash Flow statement:', error);
            throw error;
        }
    }

    /**
     * Disconnect from QuickBooks
     * @param {string} realmId - The QuickBooks realm ID
     * @returns {Promise<Object>} Disconnect status
     */
    async disconnect(realmId) {
        try {
            const response = await axios.post(`${API_BASE_URL}/financial/disconnect/${realmId}`);
            return response.data;
        } catch (error) {
            console.error('Error disconnecting from QuickBooks:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const quickBooksService = new QuickBooksService();

export default quickBooksService;