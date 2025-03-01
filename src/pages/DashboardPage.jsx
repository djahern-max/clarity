import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realmId, setRealmId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract realm_id from URL if present
    const params = new URLSearchParams(location.search);
    const realmIdFromUrl = params.get('realm_id');

    if (realmIdFromUrl) {
      setRealmId(realmIdFromUrl);
      localStorage.setItem('realmId', realmIdFromUrl); // Store in localStorage
      fetchCompanyName(realmIdFromUrl);
    } else {
      checkConnection();
    }
  }, [location]);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/financial/connection-status');
      const data = await response.json();

      if (data.connected && data.realmId) {
        setRealmId(data.realmId);
        localStorage.setItem('realmId', data.realmId); // Store in localStorage
        fetchCompanyName(data.realmId);
      } else {
        // Not connected, redirect to landing page
        localStorage.removeItem('realmId'); // Clear localStorage
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setError('Failed to verify connection status');
      setLoading(false);
    }
  };

  const fetchCompanyName = async (id) => {
    try {
      const response = await fetch(`/api/financial/company-name/${id}`);
      const data = await response.json();

      if (data.companyName) {
        setCompanyName(data.companyName);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching company name:', error);
      setError('Failed to load company information');
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/financial/disconnect/${realmId}`, {
        method: 'POST'
      });

      const data = await response.json();

      // Even if the API call succeeds, clear local storage and navigate to home
      localStorage.removeItem('realmId');

      // Log response for debugging
      console.log('Disconnect response:', data);

      navigate('/');
    } catch (error) {
      console.error('Error disconnecting:', error);
      setError('Failed to disconnect from QuickBooks');
      setLoading(false);
    }
  };

  const handleVisualize = (reportType) => {
    navigate(`/visualize/${reportType}?realm_id=${realmId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-red-900 bg-opacity-50 p-6 rounded-lg max-w-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold text-yellow-400 flex items-center">
              <span className="mr-2">⚡</span> Clarity
            </h1>
            {companyName && (
              <span className="ml-4 bg-blue-900 text-blue-100 py-1 px-3 rounded-full text-sm">
                {companyName}
              </span>
            )}
          </div>
          <button
            onClick={handleDisconnect}
            className="text-gray-400 hover:text-red-400 text-sm underline"
          >
            Disconnect QuickBooks
          </button>
        </div>

        {/* Main content */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Choose a financial report to visualize
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button
              onClick={() => handleVisualize('profit-loss')}
              className="bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-xl p-8 text-center transition duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-4">Profit & Loss</h3>
              <p className="text-emerald-100">Analyze revenue, expenses, and profitability with AI-powered insights</p>
            </button>

            <button
              onClick={() => handleVisualize('cash-flow')}
              className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl p-8 text-center transition duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-4">Cash Flow</h3>
              <p className="text-blue-100">Track your money movement and liquidity with advanced analytics</p>
            </button>

            <button
              onClick={() => handleVisualize('balance-sheet')}
              className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white rounded-xl p-8 text-center transition duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <div className="text-5xl mb-4">⚖️</div>
              <h3 className="text-2xl font-bold mb-4">Balance Sheet</h3>
              <p className="text-purple-100">Examine your assets, liabilities, and equity with intelligent visualizations</p>
            </button>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <p>Clarity © 2025 RYZE.ai</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;