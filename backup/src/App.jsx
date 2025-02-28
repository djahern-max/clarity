// App.jsx - Main Financial Clarity application with QuickBooks integration
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import DataFetcher from './components/DataFetcher';
import DataTransformer from './components/DataTransformer';
import Settings from './components/Settings';
import QuickBooksCallback from './components/QuickBooksCallback';
import quickBooksService from './services/QuickBooksService';

function App() {
  const [financialData, setFinancialData] = useState(null);
  const [apiConfig, setApiConfig] = useState({
    baseUrl: localStorage.getItem('financialClarity_apiUrl') || 'https://clarity.ryze.ai',
    realmId: localStorage.getItem('financialClarity_realmId') || ''
  });
  const [timeframe, setTimeframe] = useState('Current Period');
  const [companyName, setCompanyName] = useState('Your Company');
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Update localStorage when config changes
  useEffect(() => {
    localStorage.setItem('financialClarity_apiUrl', apiConfig.baseUrl);
    localStorage.setItem('financialClarity_realmId', apiConfig.realmId);

    // Check connection status when realmId changes
    if (apiConfig.realmId) {
      checkConnectionStatus();
      fetchCompanyName();
    }
  }, [apiConfig]);

  const checkConnectionStatus = async () => {
    try {
      const status = await quickBooksService.checkConnectionStatus(apiConfig.realmId);
      setConnectionStatus(status);
    } catch (error) {
      console.error('Error checking connection status:', error);
      setConnectionStatus({
        connected: false,
        reason: 'Error checking connection: ' + error.message
      });
    }
  };

  const fetchCompanyName = async () => {
    try {
      const data = await quickBooksService.getCompanyName(apiConfig.realmId);
      setCompanyName(data.company_name);
    } catch (error) {
      console.error('Error fetching company name:', error);
    }
  };

  const handleDataFetched = (data, period) => {
    setFinancialData(data);
    setTimeframe(period);
  };

  const handleConfigSave = (config) => {
    setApiConfig(config);
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">✨</span>
            Financial Clarity
          </div>
          <div className="company-name">
            {connectionStatus?.connected ? (
              <div className="connected-badge">
                <span className="connection-dot"></span>
                {companyName}
              </div>
            ) : (
              <div className="disconnected-badge">
                Not connected to QuickBooks
              </div>
            )}
          </div>
          <nav className="main-nav">
            <Link to="/explore" className="nav-link">Explore Data</Link>
            <Link to="/transform" className="nav-link">Transform</Link>
            <Link to="/settings" className="nav-link">Settings</Link>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/explore" replace />} />

            <Route
              path="/explore"
              element={
                <DataFetcher
                  apiConfig={apiConfig}
                  onDataFetched={handleDataFetched}
                />
              }
            />

            <Route
              path="/transform"
              element={
                <DataTransformer
                  jsonData={financialData}
                  timeframe={timeframe}
                />
              }
            />

            <Route
              path="/settings"
              element={
                <Settings
                  apiConfig={apiConfig}
                  onSave={handleConfigSave}
                />
              }
            />

            {/* Handle OAuth callback from QuickBooks */}
            <Route
              path="/callback/quickbooks"
              element={<QuickBooksCallback apiConfig={apiConfig} />}
            />

            {/* Handle OAuth error */}
            <Route
              path="/oauth-error"
              element={
                <div className="oauth-error-page">
                  <h1>QuickBooks Authentication Error</h1>
                  <p>There was an error authenticating with QuickBooks. Please try again.</p>
                  <Link to="/settings" className="retry-button">Return to Settings</Link>
                </div>
              }
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>Financial Clarity &copy; 2025 RYZE.ai</p>
            <p className="tagline">Transforming complex financial data into clear insights</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;