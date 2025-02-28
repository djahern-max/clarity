import React from 'react';

const FinancialInsights = ({ analysis, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-800 to-blue-800 rounded-lg p-6 mb-6 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-4">AI Analysis</h3>
        <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-300 mr-3"></div>
          <p className="text-gray-300">Analyzing your financial data...</p>
        </div>
      </div>
    );
  }

  // Debug the analysis object to console
  console.log("Analysis object received:", analysis);

  // Create fallback content in case the analysis is missing or incomplete
  const summary = analysis?.summary || "Analysis complete.";
  const insights = Array.isArray(analysis?.insights) ? analysis.insights : [];
  const recommendations = Array.isArray(analysis?.recommendations) ? analysis.recommendations : [];

  return (
    <div className="bg-gradient-to-r from-purple-800 to-blue-800 rounded-lg p-6 mb-6 shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4">AI Analysis</h3>

      <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 mb-4">
        <h4 className="text-xl font-semibold text-purple-300 mb-2">Summary</h4>
        <p className="text-white">{summary}</p>
      </div>

      <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 mb-4">
        <h4 className="text-xl font-semibold text-purple-300 mb-2">Key Insights</h4>
        {insights.length > 0 ? (
          <ul className="text-white space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No insights available. Try refreshing or selecting a different report.</p>
        )}
      </div>

      <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4">
        <h4 className="text-xl font-semibold text-purple-300 mb-2">Recommendations</h4>
        {recommendations.length > 0 ? (
          <ul className="text-white space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-400 mr-2">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No recommendations available. Try refreshing or selecting a different report.</p>
        )}
      </div>
    </div>
  );
};

export default FinancialInsights;