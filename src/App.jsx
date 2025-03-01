import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import VisualizationPage from './pages/VisualizationPage';
import QuickBooksCallback from './components/QuickBooksCallback';
import FinancialAnalysisPage from './pages/FinancialAnalysisPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/visualize/:reportType" element={<VisualizationPage />} />
      <Route path="/api/financial/callback/quickbooks" element={<QuickBooksCallback />} />
      <Route path="/financial/:statementType" element={<FinancialAnalysisPage />} />
    </Routes>
  );
}

export default App;
