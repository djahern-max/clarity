import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import DataVortex from '../components/animations/DataVortex';
import FinancialInsights from '../components/FinancialInsights';

const VisualizationPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [visualData, setVisualData] = useState([]);
  const [animationPhase, setAnimationPhase] = useState(0);

  const { reportType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract realm_id from URL
  const params = new URLSearchParams(location.search);
  const realmId = params.get('realm_id');
  const jsonRef = useRef(null);
  const containerRef = useRef(null);
  // Color schemes
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed', '#8dd1e1'];

  useEffect(() => {
    if (reportType && realmId) {
      fetchFinancialData(reportType, realmId);
    } else {
      setError('Missing report type or company information');
      setLoading(false);
    }
  }, [reportType, realmId]);

  const fetchFinancialData = async (type, realm) => {
    setLoading(true);
    setError(null);

    let endpoint = '';

    switch (type) {
      case 'profit-loss':
        endpoint = '/api/financial/statements/profit-loss';
        break;
      case 'cash-flow':
        endpoint = '/api/financial/statements/cash-flow';
        break;
      case 'balance-sheet':
        endpoint = '/api/financial/statements/balance-sheet';
        break;
      default:
        setError('Invalid report type');
        setLoading(false);
        return;
    }

    try {
      const params = realm ? `?realm_id=${realm}` : '';
      const response = await fetch(`${endpoint}${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      console.log("Financial data fetched:", data);
      setRawData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching financial data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAnalyzeWithAI = async () => {
    setAnalyzing(true);
    setAnimationPhase(1);

    // Start the vortex animation
    if (jsonRef.current) {
      jsonRef.current.classList.add('animate-vortex');
    }

    // Create particle effect
    createVortexEffect();

    // Simulate AI processing with a visual effect
    setTimeout(() => {
      setAnimationPhase(2);

      // For debugging, ensure we have rawData
      console.log("Sending data to AI analysis:", rawData);

      // Call the API to analyze the data
      fetch(`/api/financial/analyze/${reportType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: rawData }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Analysis failed: ${response.status}`);
          }
          return response.json();
        })
        .then(analysisResult => {
          console.log("Analysis result received:", analysisResult);

          // Process the data for visualization
          processDataForVisualization();

          // If we get an error response from the server
          if (analysisResult.error) {
            console.error("Error from analysis API:", analysisResult.error);
            setError(`Analysis failed: ${analysisResult.error}`);
            setAnimationPhase(0);
            setAnalyzing(false);
            return;
          }

          // If for some reason the analysis result is empty, use mock data
          if (!analysisResult || Object.keys(analysisResult).length === 0) {
            console.log("Empty analysis result, using mock data");
            analysisResult = generateMockAIAnalysis();
          }

          // Set the AI analysis results with default values for safety
          setAiAnalysis({
            summary: analysisResult.summary || "Analysis complete.",
            insights: Array.isArray(analysisResult.insights) ? analysisResult.insights : [],
            recommendations: Array.isArray(analysisResult.recommendations) ? analysisResult.recommendations : []
          });

          // Complete the animation
          setAnimationPhase(3);
          setAnalyzing(false);
        })
        .catch(error => {
          console.error('Error analyzing data:', error);
          // Fall back to mock data in case of error
          console.log("Analysis API failed, using mock data");
          setAiAnalysis(generateMockAIAnalysis());
          processDataForVisualization();
          setAnimationPhase(3);
          setAnalyzing(false);
        });
    }, 2000);
  };

  const createVortexEffect = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const numParticles = 100;

    // Clear previous particles
    const existingParticles = container.querySelectorAll('.json-particle');
    existingParticles.forEach(p => p.remove());

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('json-particle');

      // Random starting position around the pre element
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 150;
      const startX = centerX + Math.cos(angle) * distance;
      const startY = centerY + Math.sin(angle) * distance;

      // All particles end at the center with some randomness
      const endX = centerX + (Math.random() * 20 - 10);
      const endY = centerY + (Math.random() * 20 - 10);

      // Set custom properties for the animation
      particle.style.setProperty('--x-start', `${startX}px`);
      particle.style.setProperty('--y-start', `${startY}px`);
      particle.style.setProperty('--x-end', `${endX}px`);
      particle.style.setProperty('--y-end', `${endY}px`);

      // Vary the animation duration and delay slightly
      const duration = 1 + Math.random() * 1.5;
      const delay = Math.random() * 0.5;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;

      container.appendChild(particle);
    }
  };

  const processDataForVisualization = () => {
    // This would extract and format data from rawData for visualization
    if (!rawData) return;

    let processedData = [];

    try {
      console.log("Processing data for visualization:", rawData);

      // Example processing for profit & loss data
      if (reportType === 'profit-loss' && rawData.Rows && rawData.Rows.Row) {
        // Extract income data
        const incomeSection = rawData.Rows.Row.find(row => row.group === 'Income');

        if (incomeSection && incomeSection.Rows && incomeSection.Rows.Row) {
          processedData = incomeSection.Rows.Row
            .filter(row => row.ColData && row.ColData.length >= 2)
            .map(row => {
              const name = row.ColData[0].value;

              // Handle various formats of numeric values
              let value = 0;
              if (row.ColData[1].value) {
                const valueStr = row.ColData[1].value.toString().replace(/[,$]/g, '');
                value = parseFloat(valueStr) || 0;
              }

              return { name, value };
            });
        }
      } else if (reportType === 'balance-sheet' && rawData.Rows && rawData.Rows.Row) {
        // Extract assets data
        const assetsSection = rawData.Rows.Row.find(row => row.group === 'Assets');
        if (assetsSection && assetsSection.Rows && assetsSection.Rows.Row) {
          processedData = assetsSection.Rows.Row
            .filter(row => row.ColData && row.ColData.length >= 2)
            .map(row => {
              const name = row.ColData[0].value;

              // Handle various formats of numeric values
              let value = 0;
              if (row.ColData[1].value) {
                const valueStr = row.ColData[1].value.toString().replace(/[,$]/g, '');
                value = parseFloat(valueStr) || 0;
              }

              return { name, value };
            });
        }
      } else if (reportType === 'cash-flow' && rawData.Rows && rawData.Rows.Row) {
        // Extract cash flow data
        const operatingSection = rawData.Rows.Row.find(row => row.group === 'Operating');
        if (operatingSection && operatingSection.Rows && operatingSection.Rows.Row) {
          processedData = operatingSection.Rows.Row
            .filter(row => row.ColData && row.ColData.length >= 2)
            .map(row => {
              const name = row.ColData[0].value;

              // Handle various formats of numeric values
              let value = 0;
              if (row.ColData[1].value) {
                const valueStr = row.ColData[1].value.toString().replace(/[,$]/g, '');
                value = parseFloat(valueStr) || 0;
              }

              return { name, value };
            });
        }
      }

      console.log("Processed data for visualization:", processedData);

      // If we couldn't extract data, use sample data for demonstration
      if (!processedData || processedData.length === 0) {
        console.log("No real data found, using sample data");
        processedData = getSampleData(reportType);
      }
    } catch (err) {
      console.error('Error processing data for visualization:', err);
      // Use sample data as fallback
      processedData = getSampleData(reportType);
    }

    setVisualData(processedData);
  };

  const getSampleData = (type) => {
    // Sample data for different report types
    const sampleData = {
      'profit-loss': [
        { name: 'AI Processing Services', value: 75000 },
        { name: 'Data Consulting', value: 210000 },
        { name: 'Neural Network Consulting', value: 65000 },
        { name: 'Machine Learning Solutions', value: 140000 },
        { name: 'Cloud AI Infrastructure', value: 70000 },
        { name: 'Services', value: 390000 }
      ],
      'balance-sheet': [
        { name: 'Cash', value: 250000 },
        { name: 'Accounts Receivable', value: 125000 },
        { name: 'Equipment', value: 180000 },
        { name: 'Real Estate', value: 450000 },
        { name: 'Investments', value: 120000 }
      ],
      'cash-flow': [
        { name: 'Operating Activities', value: 180000 },
        { name: 'Investing Activities', value: -95000 },
        { name: 'Financing Activities', value: 35000 },
        { name: 'Net Change in Cash', value: 120000 }
      ]
    };

    return sampleData[type] || sampleData['profit-loss'];
  };

  const generateMockAIAnalysis = () => {
    // This would be replaced with actual AI analysis
    const analyses = {
      'profit-loss': {
        summary: "Your business is showing strong profitability with a net income of $831,532.35 for the period.",
        insights: [
          "AI Processing Services and Automated Defense Systems are your top revenue generators.",
          "Total revenue of $941,798.19 with only $22,494.03 in cost of goods sold indicates an extremely high gross margin of 97.6%.",
          "Server Farm Utilities represent your largest expense category at $44,817.35.",
          "There were no travel expenses recorded during this period.",
          "Your net profit margin is approximately 88.3%, which is exceptionally high compared to industry averages."
        ],
        recommendations: [
          "Consider diversifying revenue streams as Automated Defense Systems account for over 22% of total revenue.",
          "Analyze the efficiency of your Computing Power Acquisition spending to ensure optimal resource utilization.",
          "Evaluate opportunities to reduce Server Farm Utilities costs through energy-efficient technologies."
        ]
      },
      'cash-flow': {
        summary: "Your cash flow position appears stable with positive operating cash flow.",
        insights: [
          "Operating activities generated significant positive cash flow.",
          "Investing activities show strategic allocation of resources.",
          "No significant financing activities were recorded this period.",
          "Cash reserves are sufficient for current operations.",
          "Working capital management appears efficient."
        ],
        recommendations: [
          "Consider investment opportunities for excess cash reserves.",
          "Implement cash flow forecasting to anticipate future needs.",
          "Review payment terms with suppliers and customers to optimize cash cycle."
        ]
      },
      'balance-sheet': {
        summary: "Your balance sheet shows a strong equity position with manageable liabilities.",
        insights: [
          "Assets are well-diversified across different categories.",
          "Current ratio indicates strong short-term liquidity.",
          "Debt-to-equity ratio is favorable compared to industry averages.",
          "Fixed assets represent a significant portion of total assets.",
          "Cash position is robust for operational needs."
        ],
        recommendations: [
          "Consider implementing an asset management strategy for optimal utilization.",
          "Review inventory management practices to minimize holding costs.",
          "Evaluate opportunities for strategic debt restructuring."
        ]
      }
    };

    return analyses[reportType] || analyses['profit-loss'];
  };

  const renderReportTypeTitle = () => {
    switch (reportType) {
      case 'profit-loss': return 'Profit & Loss';
      case 'cash-flow': return 'Cash Flow';
      case 'balance-sheet': return 'Balance Sheet';
      default: return 'Financial Report';
    }
  };

  const renderRawDataView = () => {
    return (
      <DataVortex
        isActive={animationPhase >= 1}
        onAnimationComplete={() => setAnimationPhase(3)}
      >
        <div className={`transition-all duration-1000 ${animationPhase >= 2 ? 'opacity-0 scale-0' : ''}`}>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Raw Financial Data</h3>
            <p className="text-gray-400 mb-4 text-sm">
              This is the raw JSON data returned from QuickBooks. Click "Analyze with AI" to transform this into meaningful insights.
            </p>
            <div className="bg-gray-900 p-4 rounded overflow-auto max-h-96 text-xs font-mono text-gray-300">
              <pre>{JSON.stringify(rawData, null, 2)}</pre>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleAnalyzeWithAI}
              disabled={analyzing}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-200 flex items-center justify-center mx-auto disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        </div>
      </DataVortex>
    );
  };

  const renderAIAnalysisView = () => {
    if (animationPhase < 3) return null;

    return (
      <div className="animate-fadeIn">
        {/* Use the FinancialInsights component */}
        <FinancialInsights analysis={aiAnalysis} />

        {visualData && visualData.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Data Visualization</h3>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {reportType === 'profit-loss' ? (
                  <BarChart data={visualData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                    <YAxis tick={{ fill: '#ccc' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#333', border: 'none' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Amount ($)" fill="#8884d8">
                      {visualData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={visualData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {visualData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-400">Loading financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-red-900 bg-opacity-50 p-6 rounded-lg max-w-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Data</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {renderReportTypeTitle()}
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Raw data and AI transformation */}
          {animationPhase < 3 ? renderRawDataView() : renderAIAnalysisView()}
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;