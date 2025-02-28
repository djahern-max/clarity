// FinancialInsights.jsx - Displays the processed financial insights
import React from 'react';
import './FinancialInsights.css';

const FinancialInsights = ({ data }) => {
    // Helper function to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Nothing to render if no data
    if (!data) {
        return <div className="no-insights">No data available for analysis</div>;
    }

    // Calculate health score between 0-100 based on profit margin and other factors
    const calculateHealthScore = () => {
        let score = 50; // Default middle score

        // Adjust based on profit margin
        if (data.summary.profitMargin > 30) score += 30;
        else if (data.summary.profitMargin > 20) score += 25;
        else if (data.summary.profitMargin > 10) score += 15;
        else if (data.summary.profitMargin > 0) score += 5;
        else score -= 20;

        // Adjust based on positive/negative cash flow
        if (data.summary.netIncome > 0) {
            score += 10;
        } else {
            score -= 15;
        }

        // Ensure score stays between 0-100
        return Math.max(0, Math.min(100, score));
    };

    const healthScore = calculateHealthScore();

    return (
        <div className="financial-insights">
            <div className="insights-header">
                <h2>Clarity</h2>
                <div className="timeframe">{data.timeframe}</div>
            </div>

            <div className="summary-section">
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="card-label">Revenue</div>
                        <div className="card-value">{formatCurrency(data.summary.income || 0)}</div>
                    </div>
                    <div className="summary-card">
                        <div className="card-label">Expenses</div>
                        <div className="card-value">{formatCurrency(data.summary.expenses || 0)}</div>
                    </div>
                    <div className="summary-card">
                        <div className="card-label">Net Result</div>
                        <div className={`card-value ${data.summary.netIncome >= 0 ? 'positive' : 'negative'}`}>
                            {formatCurrency(data.summary.netIncome || 0)}
                        </div>
                    </div>
                </div>

                <div className="health-meter">
                    <div className="health-label">
                        <span>Financial Health Score</span>
                        <span className="health-score">{healthScore}</span>
                    </div>
                    <div className="meter-container">
                        <div className="meter-background">
                            <div className="meter-fill" style={{ width: `${healthScore}%` }}></div>
                        </div>
                        <div className="meter-markers">
                            <span>0</span>
                            <span>25</span>
                            <span>50</span>
                            <span>75</span>
                            <span>100</span>
                        </div>
                    </div>
                    <div className="health-description">
                        {healthScore >= 80 ? (
                            <span className="excellent">Excellent financial health</span>
                        ) : healthScore >= 60 ? (
                            <span className="good">Good financial standing</span>
                        ) : healthScore >= 40 ? (
                            <span className="fair">Fair financial condition</span>
                        ) : healthScore >= 20 ? (
                            <span className="concerning">Financial concerns present</span>
                        ) : (
                            <span className="critical">Critical financial situation</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="insights-grid">
                <h3>Key Insights</h3>
                <div className="insights-list">
                    {data.insights.map((insight, index) => (
                        <div key={index} className={`insight-card ${insight.type}`}>
                            <div className="insight-icon">
                                {insight.type === 'positive' && '✓'}
                                {insight.type === 'negative' && '⚠'}
                                {insight.type === 'caution' && '⚠'}
                                {insight.type === 'info' && 'ℹ'}
                                {insight.type === 'error' && '⚠'}
                            </div>
                            <div className="insight-content">
                                <h4>{insight.title}</h4>
                                <p>{insight.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="financial-breakdown">
                <h3>Financial Breakdown</h3>

                {data.summary.topIncomeSources && data.summary.topIncomeSources.length > 0 && (
                    <div className="breakdown-section">
                        <h4>Top Revenue Sources</h4>
                        <div className="breakdown-bars">
                            {data.summary.topIncomeSources.map((source, index) => (
                                <div key={index} className="breakdown-item">
                                    <div className="item-label">{source.name}</div>
                                    <div className="item-bar-container">
                                        <div
                                            className="item-bar income-bar"
                                            style={{
                                                width: `${Math.min(100, (source.amount / data.summary.income) * 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="item-value">{formatCurrency(source.amount)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data.summary.topExpenses && data.summary.topExpenses.length > 0 && (
                    <div className="breakdown-section">
                        <h4>Top Expenses</h4>
                        <div className="breakdown-bars">
                            {data.summary.topExpenses.map((expense, index) => (
                                <div key={index} className="breakdown-item">
                                    <div className="item-label">{expense.name}</div>
                                    <div className="item-bar-container">
                                        <div
                                            className="item-bar expense-bar"
                                            style={{
                                                width: `${Math.min(100, (expense.amount / data.summary.expenses) * 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="item-value">{formatCurrency(expense.amount)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="profit-margin-section">
                <h3>Profit Margin: {data.summary.profitMargin?.toFixed(1)}%</h3>
                <div className="profit-margin-bar-container">
                    <div
                        className={`profit-margin-bar ${data.summary.profitMargin >= 0 ? 'positive' : 'negative'}`}
                        style={{ width: `${Math.min(100, Math.abs(data.summary.profitMargin))}%` }}
                    ></div>
                </div>
                <div className="profit-margin-explanation">
                    <p>
                        {data.summary.profitMargin > 20 ? (
                            'Your profit margin is excellent, indicating strong financial efficiency.'
                        ) : data.summary.profitMargin > 10 ? (
                            'Your profit margin is good, showing healthy financial performance.'
                        ) : data.summary.profitMargin > 5 ? (
                            'Your profit margin is acceptable but could be improved.'
                        ) : data.summary.profitMargin > 0 ? (
                            'Your profit margin is low. Consider strategies to increase revenue or reduce costs.'
                        ) : (
                            'Your profit margin is negative, indicating financial challenges that need attention.'
                        )}
                    </p>
                </div>
            </div>

            <div className="recommendations-section">
                <h3>AI Recommendations</h3>
                <div className="recommendations-list">
                    {data.summary.profitMargin < 10 && (
                        <div className="recommendation">
                            <div className="recommendation-icon">💡</div>
                            <div className="recommendation-content">
                                <h4>Improve Profit Margins</h4>
                                <p>Consider ways to either increase your prices or reduce operational costs to improve your overall profit margin.</p>
                            </div>
                        </div>
                    )}

                    {data.summary.topIncomeSources && data.summary.topIncomeSources.length > 0 && (
                        <div className="recommendation">
                            <div className="recommendation-icon">💡</div>
                            <div className="recommendation-content">
                                <h4>Focus on Top Revenue Drivers</h4>
                                <p>Your {data.summary.topIncomeSources[0].name} is your strongest revenue stream. Consider investing more in this area or replicating its success in other areas.</p>
                            </div>
                        </div>
                    )}

                    {data.summary.topExpenses && data.summary.topExpenses.length > 0 && (
                        <div className="recommendation">
                            <div className="recommendation-icon">💡</div>
                            <div className="recommendation-content">
                                <h4>Review Major Expenses</h4>
                                <p>Your largest expense is {data.summary.topExpenses[0].name}. Review this cost to see if there are opportunities for greater efficiency or negotiation.</p>
                            </div>
                        </div>
                    )}

                    {data.summary.netIncome < 0 && (
                        <div className="recommendation">
                            <div className="recommendation-icon">💡</div>
                            <div className="recommendation-content">
                                <h4>Address Negative Cash Flow</h4>
                                <p>Your business is currently operating at a loss. Consider immediate steps to either increase revenue or reduce expenses to move toward profitability.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialInsights;