import React from 'react';

const FinancialInsights = ({ insights }) => {
  // Handle error case
  if (insights.error) {
    return (
      <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-2">Analysis Error</h3>
        <p className="text-red-200">{insights.error}</p>
        {insights.summary && <p className="mt-2 text-white">{insights.summary}</p>}
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Summary Section */}
      <div className="mb-8 bg-blue-900 bg-opacity-30 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-3 text-blue-200">Summary</h3>
        <p className="text-white">
          {insights.summary || "Analysis complete."}
        </p>
      </div>

      {/* Key Insights Section */}
      <div className="mb-8 bg-purple-900 bg-opacity-30 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-3 text-purple-200">Key Insights</h3>
        {insights.insights && insights.insights.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {insights.insights.map((insight, index) => (
              <li key={index} className="text-white">{insight}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">No insights available.</p>
        )}
      </div>

      {/* Recommendations Section */}
      <div className="bg-green-900 bg-opacity-30 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-3 text-green-200">Recommendations</h3>
        {insights.recommendations && insights.recommendations.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {insights.recommendations.map((recommendation, index) => (
              <li key={index} className="text-white">{recommendation}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default FinancialInsights;