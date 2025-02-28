// App.jsx - Main Clarity application
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import DataFetcher from './components/DataFetcher';
import DataTransformer from './components/DataTransformer';
import Settings from './components/Settings';

function App() {
  const [financialData, setFinancialData] = useState(null);
  const [apiConfig, setApiConfig] = useState({
    baseUrl: localStorage.getItem('financialClarity_apiUrl') || 'https://agent1.ryze.ai',
    realmId: localStorage.getItem('financialClarity_realmId') || ''
  });
  const [timeframe, setTimeframe] = useState('Current Period');

  // Update localStorage when config changes
  useEffect(() => {
    localStorage.setItem('financialClarity_apiUrl', apiConfig.baseUrl);
    localStorage.setItem('financialClarity_realmId', apiConfig.realmId);
  }, [apiConfig]);

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
            Clarity
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
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>Clarity &copy; 2025 RYZE.ai</p>
            <p className="tagline">Transforming complex financial data into clear insights</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;