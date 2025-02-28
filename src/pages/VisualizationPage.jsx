import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FinancialInsights from '../components/FinancialInsights';
import DataVortex from '../components/animations/DataVortex';

const VisualizationPage = () => {
  const { reportType } = useParams();
  const [data, setData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [realmId, setRealmId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Array of loading messages to cycle through
  const loadingMessages = [
    "Analyzing financial patterns...",
    "Extracting key financial insights...",
    "Calculating performance metrics...",
    "Identifying growth opportunities...",
    "Evaluating financial health...",
    "Detecting spending patterns...",
    "Comparing with industry benchmarks...",
    "Generating recommendations...",
    "Finalizing your personalized analysis..."
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Title mapping for different report types
  const reportTitles = {
    'profit-loss': 'Profit & Loss',
    'balance-sheet': 'Balance Sheet',
    'cash-flow': 'Cash Flow'
  };

  useEffect(() => {
    // Extract realm_id from URL
    const params = new URLSearchParams(location.search);
    const realmIdFromUrl = params.get('realm_id');

    if (realmIdFromUrl) {
      setRealmId(realmIdFromUrl);
      // Store in localStorage for persistence
      localStorage.setItem('realmId', realmIdFromUrl);
      fetchFinancialData(realmIdFromUrl, reportType);
    } else {
      // Try to get from localStorage
      const storedRealmId = localStorage.getItem('realmId');
      if (storedRealmId) {
        setRealmId(storedRealmId);
        fetchFinancialData(storedRealmId, reportType);
      } else {
        setError('No company connection found');
        setLoading(false);
      }
    }
  }, [reportType, location]);

  // Cycle through loading messages
  useEffect(() => {
    let interval;

    if (analyzeLoading) {
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) =>
          (prevIndex + 1) % loadingMessages.length
        );
      }, 3000); // Change message every 3 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [analyzeLoading, loadingMessages.length]);

  const fetchFinancialData = async (realm, type) => {
    try {
      setLoading(true);

      // Determine which endpoint to call based on report type
      let endpoint;
      switch (type) {
        case 'profit-loss':
          endpoint = `/api/financial/statements/profit-loss`;
          break;
        case 'balance-sheet':
          endpoint = `/api/financial/statements/balance-sheet`;
          break;
        case 'cash-flow':
          endpoint = `/api/financial/statements/cash-flow`;
          break;
        default:
          throw new Error('Invalid report type');
      }

      const response = await fetch(`${endpoint}?realm_id=${realm}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data`);
      }

      const result = await response.json();
      setData(result);
      setLoading(false);

      // Start AI analysis immediately
      analyzeData(result, type);
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      setError(error.message);
      setLoading(false);
    }
  };

  const analyzeData = async (financialData, type) => {
    try {
      setAnalyzeLoading(true);
      setAnalysis(null); // Clear previous analysis

      const response = await fetch(`/api/financial/analyze/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: financialData }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();

      // Add a slight delay to show the loading animation
      // This helps avoid a jarring transition
      setTimeout(() => {
        setAnalysis(result);
        setAnalyzeLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error analyzing data:', error);
      setAnalyzeLoading(false);
      setAnalysis({
        error: 'Analysis failed',
        summary: 'Unable to complete analysis at this time.',
        insights: ['The financial analysis service is currently unavailable.'],
        recommendations: ['Please try again later.'],
      });
    }
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard?realm_id=${realmId}`);
  };

  // Main render function
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-300">Loading financial data...</p>
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
            onClick={handleBackToDashboard}
            className="mt-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">{reportTitles[reportType] || 'Financial Report'}</h1>
          <button
            onClick={handleBackToDashboard}
            className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl overflow-hidden shadow-xl mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-2">🤖</span> AI Analysis
            </h2>

            {analyzeLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <DataVortex />
                <div className="mt-6 text-center">
                  <p className="text-xl font-semibold text-blue-200 mb-2">
                    {loadingMessages[currentMessageIndex]}
                  </p>
                  <p className="text-sm text-blue-300 animate-pulse">
                    This may take a minute as we're using advanced AI to analyze your data
                  </p>
                </div>
              </div>
            ) : (
              analysis ? (
                <FinancialInsights insights={analysis} />
              ) : (
                <div className="text-center p-6 text-gray-300">
                  <p>Analysis not available. Please try again.</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Financial Data Visualization (placeholder for now) */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Financial Visualization</h2>
          <div className="bg-gray-700 p-4 rounded">
            <pre className="text-gray-300 overflow-auto max-h-96 text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;