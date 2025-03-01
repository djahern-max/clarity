import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const VisualizationPage = () => {
  const { reportType } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realmId, setRealmId] = useState('');

  // Date range state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [structuredView, setStructuredView] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Title mapping for different report types
  const reportTitles = {
    'profit-loss': 'Profit & Loss',
    'balance-sheet': 'Balance Sheet',
    'cash-flow': 'Cash Flow'
  };

  useEffect(() => {
    // Set default date range to current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    setStartDate(formatDate(firstDayOfMonth));
    setEndDate(formatDate(lastDayOfMonth));

    // Extract realm_id from URL
    const params = new URLSearchParams(location.search);
    const realmIdFromUrl = params.get('realm_id');

    if (realmIdFromUrl) {
      setRealmId(realmIdFromUrl);
      // Store in localStorage for persistence
      localStorage.setItem('realmId', realmIdFromUrl);
      console.log("Set realmId from URL:", realmIdFromUrl); // Debug log
    } else {
      // Try to get from localStorage
      const storedRealmId = localStorage.getItem('realmId');
      if (storedRealmId) {
        setRealmId(storedRealmId);
        console.log("Set realmId from localStorage:", storedRealmId); // Debug log
      } else {
        setError('No company connection found');
        setLoading(false);
      }
    }
  }, [reportType, location]);

  // Add this function inside your VisualizationPage component
  const handleAuthenticationError = (error) => {
    if (error.message && error.message.includes('401')) {
      // Clear stored realm ID
      localStorage.removeItem('realmId');

      // Show error
      setError('Your QuickBooks authentication has expired. Please reconnect.');

      // Add a reconnect button
      setReconnectNeeded(true);
    }
  };

  // Add this function
  const handleStructureData = () => {
    setStructuredView(!structuredView);
  };

  // Add function to render structured statement
  const renderStructuredStatement = () => {
    try {
      // For profit/loss report
      if (reportType === 'profit-loss') {
        return renderProfitLossStatement();
      }
      // For balance sheet
      else if (reportType === 'balance-sheet') {
        return renderBalanceSheet();
      }
      // For cash flow
      else if (reportType === 'cash-flow') {
        return renderCashFlow();
      }
      return "Unknown report type";
    } catch (e) {
      console.error("Error rendering structured view:", e);
      return "Error structuring data: " + e.message;
    }
  };

  // Functions to render each report type
  const renderProfitLossStatement = () => {
    const header = data.Header || {};
    const rows = data.Rows?.Row || [];

    // Function to extract values from rows
    const extractValues = (rows, sectionName) => {
      let result = [];
      for (const row of rows) {
        if (row.group === sectionName) {
          const subRows = row.Rows?.Row || [];
          for (const subRow of subRows) {
            if (subRow.ColData && subRow.ColData.length >= 2) {
              result.push({
                name: subRow.ColData[0].value,
                amount: subRow.ColData[1].value
              });
            }
          }
        }
      }
      return result;
    };

    // Extract revenue, expenses, etc.
    const revenue = extractValues(rows, "Income");
    const expenses = extractValues(rows, "Expenses");

    // Format the statement
    let statement = `\n================ PROFIT & LOSS STATEMENT ================\n`;
    statement += `Period: ${header.StartPeriod} to ${header.EndPeriod}\n`;
    statement += `Basis: ${header.ReportBasis}\n\n`;

    statement += `REVENUE\n`;
    statement += `========\n`;
    let totalRevenue = 0;
    revenue.forEach(item => {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      totalRevenue += isNaN(amount) ? 0 : amount;
      statement += `${item.name.padEnd(40)} $${item.amount.padStart(12)}\n`;
    });
    statement += `${'TOTAL REVENUE'.padEnd(40)} $${totalRevenue.toFixed(2).padStart(12)}\n\n`;

    statement += `EXPENSES\n`;
    statement += `========\n`;
    let totalExpenses = 0;
    expenses.forEach(item => {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      totalExpenses += isNaN(amount) ? 0 : amount;
      statement += `${item.name.padEnd(40)} $${item.amount.padStart(12)}\n`;
    });
    statement += `${'TOTAL EXPENSES'.padEnd(40)} $${totalExpenses.toFixed(2).padStart(12)}\n\n`;

    const netIncome = totalRevenue - totalExpenses;
    statement += `${'NET INCOME'.padEnd(40)} $${netIncome.toFixed(2).padStart(12)}\n`;
    statement += `===========================================================\n`;

    return statement;
  };

  // Similar functions for balance sheet and cash flow
  const renderBalanceSheet = () => {
    const header = data.Header || {};
    const rows = data.Rows?.Row || [];

    // Function to extract values from rows
    const extractValues = (rows, sectionName) => {
      let result = [];
      for (const row of rows) {
        if (row.group === sectionName) {
          const subRows = row.Rows?.Row || [];
          for (const subRow of subRows) {
            if (subRow.ColData && subRow.ColData.length >= 2) {
              result.push({
                name: subRow.ColData[0].value,
                amount: subRow.ColData[1].value
              });
            }
          }
        }
      }
      return result;
    };

    // Extract assets, liabilities, equity
    const assets = extractValues(rows, "Assets");
    const liabilities = extractValues(rows, "Liabilities");
    const equity = extractValues(rows, "Equity");

    // Format the statement
    let statement = `\n================ BALANCE SHEET ================\n`;
    statement += `As of: ${header.EndPeriod}\n`;
    statement += `Basis: ${header.ReportBasis}\n\n`;

    statement += `ASSETS\n`;
    statement += `======\n`;
    let totalAssets = 0;
    assets.forEach(item => {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      totalAssets += isNaN(amount) ? 0 : amount;
      statement += `${item.name.padEnd(40)} $${item.amount.padStart(12)}\n`;
    });
    statement += `${'TOTAL ASSETS'.padEnd(40)} $${totalAssets.toFixed(2).padStart(12)}\n\n`;

    statement += `LIABILITIES\n`;
    statement += `===========\n`;
    let totalLiabilities = 0;
    liabilities.forEach(item => {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      totalLiabilities += isNaN(amount) ? 0 : amount;
      statement += `${item.name.padEnd(40)} $${item.amount.padStart(12)}\n`;
    });
    statement += `${'TOTAL LIABILITIES'.padEnd(40)} $${totalLiabilities.toFixed(2).padStart(12)}\n\n`;

    statement += `EQUITY\n`;
    statement += `======\n`;
    let totalEquity = 0;
    equity.forEach(item => {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      totalEquity += isNaN(amount) ? 0 : amount;
      statement += `${item.name.padEnd(40)} $${item.amount.padStart(12)}\n`;
    });
    statement += `${'TOTAL EQUITY'.padEnd(40)} $${totalEquity.toFixed(2).padStart(12)}\n\n`;

    statement += `${'TOTAL LIABILITIES AND EQUITY'.padEnd(40)} $${(totalLiabilities + totalEquity).toFixed(2).padStart(12)}\n`;
    statement += `==================================================\n`;

    return statement;
  };


  const renderCashFlow = () => {
    const header = data.Header || {};
    const rows = data.Rows?.Row || [];

    // Function to extract values from rows
    const extractValues = (rows, sectionName) => {
      let result = [];
      for (const row of rows) {
        if (row.group === sectionName) {
          const subRows = row.Rows?.Row || [];
          for (const subRow of subRows) {
            if (subRow.ColData && subRow.ColData.length >= 2) {
              result.push({
                name: subRow.ColData[0].value,
                amount: subRow.ColData[1].value
              });
            }
          }
        }
      }
      return result;
    };

    // Extract different cash flow sections
    const operating = extractValues(rows, "Operating");
    const investing = extractValues(rows, "Investing");
    const financing = extractValues(rows, "Financing");

    // Format the statement
    let statement = `\n================ CASH FLOW STATEMENT ================\n`;
    statement += `Period: ${header.StartPeriod} to ${header.EndPeriod}\n`;
    statement += `Basis: ${header.ReportBasis}\n\n`;

    statement += `OPERATING ACTIVITIES\n`;
    statement += `====================\n`;
    let totalOperating = 0;
    operating.forEach(item => {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      totalOperating += isNaN(amount) ? 0 : amount;
      statement += `${item.name.padEnd(40)} $${item.amount.padStart(12)}\n`;
    });
    statement += `${'NET CASH FROM OPERATIONS'.padEnd(40)} $${totalOperating.toFixed(2).padStart(12)}\n\n`;

    statement += `INVESTING ACTIVITIES\n`;
    statement += `====================\n`;
    let totalInvesting = 0;
    investing.forEach(item => {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      totalInvesting += isNaN(amount) ? 0 : amount;
      statement += `${item.name.padEnd(40)} $${item.amount.padStart(12)}\n`;
    });
    statement += `${'NET CASH FROM INVESTING'.padEnd(40)} $${totalInvesting.toFixed(2).padStart(12)}\n\n`;

    statement += `FINANCING ACTIVITIES\n`;
    statement += `====================\n`;
    let totalFinancing = 0;
    financing.forEach(item => {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      totalFinancing += isNaN(amount) ? 0 : amount;
      statement += `${item.name.padEnd(40)} $${item.amount.padStart(12)}\n`;
    });
    statement += `${'NET CASH FROM FINANCING'.padEnd(40)} $${totalFinancing.toFixed(2).padStart(12)}\n\n`;

    const netChange = totalOperating + totalInvesting + totalFinancing;
    statement += `${'NET CHANGE IN CASH'.padEnd(40)} $${netChange.toFixed(2).padStart(12)}\n`;
    statement += `=======================================================\n`;

    return statement;
  };

  // Add this state variable
  const [reconnectNeeded, setReconnectNeeded] = useState(false);

  // Add a reconnect function
  const handleReconnect = async () => {
    try {
      const response = await fetch('/api/financial/auth-url');
      const data = await response.json();

      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        setError('Failed to get authentication URL');
      }
    } catch (e) {
      console.error('Failed to get auth URL:', e);
      setError('Failed to start reconnection process');
    }
  };

  const fetchFinancialData = async () => {
    if (!startDate || !endDate) {
      setError('Please select a date range');
      return;
    }

    if (!realmId) {
      setError('No company connection found. Please connect to QuickBooks first.');
      return;
    }

    try {
      setLoading(true);
      setAiAnalysis(null); // Reset any previous AI analysis
      console.log(`Fetching ${reportType} data for realm: ${realmId} from ${startDate} to ${endDate}`);

      // Determine which endpoint to call based on report type
      let endpoint;
      switch (reportType) {
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

      // Build URL with appropriate parameters based on report type
      // Build URL with appropriate parameters based on report type
      const params = new URLSearchParams();
      params.append('realm_id', realmId);

      // Use same parameters for all report types for consistency
      params.append('start_date', startDate);
      params.append('end_date', endDate);

      // Use URLSearchParams to properly encode parameters
      const fullUrl = `${endpoint}?${params.toString()}`;

      // Debug logs
      console.log(`realmId value: "${realmId}"`);
      console.log(`Full URL with params: ${fullUrl}`);

      // Add timestamp to prevent caching issues
      const timestamp = new Date().getTime();
      const noCacheUrl = `${fullUrl}&_=${timestamp}`;

      // Make the request
      const response = await fetch(noCacheUrl);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API response not OK: ${response.status} ${response.statusText}`);
        console.error(`Error details: ${errorText}`);
        throw new Error(`Failed to fetch ${reportType} data (${response.status}): ${errorText || response.statusText}`);
      }

      // Read response as text first to log it in case of parsing errors
      const responseText = await response.text();
      console.log(`Raw API response for ${reportType}:`, responseText);

      try {
        // Then parse the JSON
        const result = JSON.parse(responseText);
        console.log(`Successfully parsed ${reportType} data:`, result);
        setData(result);
      } catch (parseError) {
        console.error(`JSON parse error:`, parseError);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }
    } catch (error) {
      console.error(`Error fetching ${reportType} data:`, error);
      handleAuthenticationError(error);
      setError(error.message || 'Failed to retrieve financial data');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard?realm_id=${realmId}`);
  };

  const handleAnalyzeWithAI = async () => {
    if (!data) {
      setAnalysisError('No financial data to analyze');
      return;
    }

    try {
      setAnalysisLoading(true);
      setAnalysisError(null);

      const payload = {
        data: data,
        metadata: {
          report_type: reportType,
          realm_id: realmId,
          period: reportType === 'balance-sheet'
            ? { as_of_date: endDate }
            : { start_date: startDate, end_date: endDate }
        }
      };

      console.log(`Sending ${reportType} data for AI analysis`);
      console.log('Analysis payload:', JSON.stringify(payload).slice(0, 500) + '...');

      const endpoint = `/api/financial/analyze/${reportType}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI analysis API response not OK: ${response.status} ${response.statusText}`);
        console.error(`Error details: ${errorText}`);
        throw new Error(`Failed to analyze data (${response.status}): ${errorText || response.statusText}`);
      }

      const analysisResult = await response.json();
      console.log('AI Analysis result:', analysisResult);
      setAiAnalysis(analysisResult);

    } catch (error) {
      console.error('Error analyzing data with AI:', error);
      setAnalysisError(error.message || 'Failed to analyze data');
    } finally {
      setAnalysisLoading(false);
    }
  };
  // Quick date range options
  const handleQuickDateRange = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisQuarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        break;
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case 'lastYear':
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  if (loading && data) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-300">Loading financial data...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-red-900 bg-opacity-50 p-6 rounded-lg max-w-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>

          {reconnectNeeded ? (
            <button
              onClick={handleReconnect}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mr-4"
            >
              Reconnect to QuickBooks
            </button>
          ) : null}

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
  // Check if we have the NoReportData flag
  const hasNoReportData = data &&
    data.Header &&
    data.Header.Option &&
    data.Header.Option.some(opt => opt.Name === "NoReportData" && opt.Value === "true");

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

        {/* Connection Info */}
        {/* Connection Info */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Connection Information</h2>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-300">Realm ID: {realmId || 'Not set'}</p>
            <p className="text-gray-300">
              Date Range: {startDate || 'Not set'} to {endDate || 'Not set'}
            </p>
            <p className="text-gray-300">Report Type: {reportTitles[reportType]}</p>
          </div>
        </div>
        {/* Date Range Selector */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {reportType === 'balance-sheet' ? 'Select Date' : 'Select Date Range'}
          </h2>

          {/* Quick date options */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleQuickDateRange('thisMonth')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              This Month
            </button>
            <button
              onClick={() => handleQuickDateRange('lastMonth')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              Last Month
            </button>
            <button
              onClick={() => handleQuickDateRange('thisQuarter')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              This Quarter
            </button>
            <button
              onClick={() => handleQuickDateRange('thisYear')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              This Year
            </button>
            <button
              onClick={() => handleQuickDateRange('lastYear')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              Last Year
            </button>
          </div>

          {/* Date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="start-date" className="block text-gray-300 mb-1">Start Date</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-gray-300 mb-1">End Date</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={fetchFinancialData}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Apply Date Range
          </button>
        </div>

        {/* No data warning */}
        {hasNoReportData && (
          <div className="bg-yellow-900 bg-opacity-50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-white">No Report Data Available</h3>
                <p className="text-gray-300 mt-1">
                  QuickBooks is reporting that there is no data available for this report period.
                  Please try a different date range or check your QuickBooks account for transactions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Section */}
        {data && !hasNoReportData && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">AI Analysis</h2>
              <button
                onClick={handleAnalyzeWithAI}
                disabled={analysisLoading}
                className={`${analysisLoading
                  ? 'bg-purple-800 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
                  } text-white py-2 px-4 rounded-md flex items-center`}
              >
                {analysisLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span role="img" aria-label="AI" className="mr-2">🤖</span>
                    Analyze with AI
                  </>
                )}
              </button>
            </div>

            {analysisError && (
              <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg mb-4">
                <p className="text-white">{analysisError}</p>
              </div>
            )}

            {aiAnalysis && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Financial Insights</h3>

                {/* Summary */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-300 mb-2">Summary</h4>
                  <p className="text-gray-300">{aiAnalysis.summary}</p>
                </div>

                {/* Key Insights */}
                {aiAnalysis.insights && aiAnalysis.insights.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-300 mb-2">Key Insights</h4>
                    <ul className="list-disc pl-5 text-gray-300">
                      {aiAnalysis.insights.map((insight, index) => (
                        <li key={index} className="mb-1">{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-2">Recommendations</h4>
                    <ul className="list-disc pl-5 text-gray-300">
                      {aiAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="mb-1">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!aiAnalysis && !analysisLoading && !analysisError && (
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400">
                  Click "Analyze with AI" to get insights and recommendations based on your financial data.
                </p>
              </div>
            )}
          </div>
        )}


        {/* Raw Financial Data Display */}
        {data && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Raw Financial Data</h2>
              <button
                onClick={handleStructureData}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
              >
                <span role="img" aria-label="Structure" className="mr-2">📋</span>
                Structure Data
              </button>
            </div>
            <p className="text-gray-400 mb-4">
              This is the raw JSON data from your QuickBooks account.
            </p>
            <div className="bg-gray-700 p-4 rounded">
              <pre className="text-gray-300 text-xs font-mono" style={{
                whiteSpace: structuredView ? 'pre-wrap' : 'normal',
                wordBreak: 'break-all',
                overflowWrap: 'break-word'
              }}>
                {structuredView ? renderStructuredStatement() : JSON.stringify(data)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationPage;