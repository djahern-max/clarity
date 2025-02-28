// DataTransformer.jsx - The component that handles the JSON to insights transformation
import React, { useState, useRef, useEffect } from 'react';
import './DataTransformer.css';
import FinancialInsights from './FinancialInsights';

const processProfitAndLoss = (data, processedData) => {
    try {
        // The QuickBooks P&L data structure has Rows.Row for sections
        const rows = data.Rows?.Row || [];

        // Initialize metrics
        let totalIncome = 0;
        let totalExpenses = 0;
        let totalCOGS = 0;
        let grossProfit = 0;
        let netIncome = 0;

        // Process each section (Income, Expenses, etc.)
        rows.forEach(row => {
            if (row.type === "Section") {
                switch (row.group) {
                    case "Income":
                        if (row.Summary?.ColData?.[1]) {
                            totalIncome = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                    case "COGS":
                        if (row.Summary?.ColData?.[1]) {
                            totalCOGS = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                    case "Expenses":
                        if (row.Summary?.ColData?.[1]) {
                            totalExpenses = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                    case "GrossProfit":
                        if (row.Summary?.ColData?.[1]) {
                            grossProfit = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                    case "NetIncome":
                    case "NetOperatingIncome":
                        if (row.Summary?.ColData?.[1]) {
                            netIncome = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                }
            }
        });

        // If gross profit isn't explicitly provided, calculate it
        if (grossProfit === 0) {
            grossProfit = totalIncome - totalCOGS;
        }

        // Store the summary metrics
        processedData.summary = {
            totalIncome,
            totalCOGS,
            grossProfit,
            totalExpenses,
            netIncome
        };

        // Calculate profit margins
        if (totalIncome > 0) {
            processedData.summary.grossMargin = (grossProfit / totalIncome) * 100;
            processedData.summary.netMargin = (netIncome / totalIncome) * 100;
        } else {
            processedData.summary.grossMargin = 0;
            processedData.summary.netMargin = 0;
        }

        // Extract top income sources and expenses for detailed breakdown
        processedData.topIncomeSources = extractTopItems(rows, "Income", 3);
        processedData.topExpenses = extractTopItems(rows, "Expenses", 3);

        // Generate insights based on financial performance
        generateProfitLossInsights(processedData);

        return processedData;
    } catch (error) {
        console.error("Error processing profit and loss:", error);
        processedData.insights.push({
            type: 'error',
            title: 'Processing Error',
            description: `Error processing profit and loss data: ${error.message}`
        });
        return processedData;
    }
};

// Process Balance Sheet
const processBalanceSheet = (data, processedData) => {
    try {
        // Extract Balance Sheet data
        const rows = data.Rows?.Row || [];

        // Initialize metrics
        let totalAssets = 0;
        let totalLiabilities = 0;
        let totalEquity = 0;
        let currentAssets = 0;
        let currentLiabilities = 0;

        // Process each section
        rows.forEach(row => {
            if (row.type === "Section") {
                switch (row.group) {
                    case "Assets":
                        if (row.Summary?.ColData?.[1]) {
                            totalAssets = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        // Try to extract current assets
                        extractCurrentAssets(row, processedData);
                        break;
                    case "Liabilities":
                        if (row.Summary?.ColData?.[1]) {
                            totalLiabilities = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        // Try to extract current liabilities
                        extractCurrentLiabilities(row, processedData);
                        break;
                    case "Equity":
                        if (row.Summary?.ColData?.[1]) {
                            totalEquity = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                }
            }
        });

        // Store the summary metrics
        processedData.summary = {
            totalAssets,
            totalLiabilities,
            totalEquity,
            currentAssets: processedData.currentAssets || 0,
            currentLiabilities: processedData.currentLiabilities || 0
        };

        // Calculate financial ratios
        if (processedData.summary.currentLiabilities > 0) {
            processedData.summary.currentRatio = processedData.summary.currentAssets / processedData.summary.currentLiabilities;
        } else {
            processedData.summary.currentRatio = processedData.summary.currentAssets > 0 ? 999 : 0; // Avoid division by zero
        }

        if (totalEquity > 0) {
            processedData.summary.debtToEquity = totalLiabilities / totalEquity;
        } else {
            processedData.summary.debtToEquity = totalLiabilities > 0 ? 999 : 0; // Avoid division by zero
        }

        // Generate insights based on balance sheet
        generateBalanceSheetInsights(processedData);

        return processedData;
    } catch (error) {
        console.error("Error processing balance sheet:", error);
        processedData.insights.push({
            type: 'error',
            title: 'Processing Error',
            description: `Error processing balance sheet data: ${error.message}`
        });
        return processedData;
    }
};

// Process Cash Flow statement
const processCashFlow = (data, processedData) => {
    try {
        // Extract Cash Flow data
        const rows = data.Rows?.Row || [];

        // Initialize metrics
        let operatingCashFlow = 0;
        let investingCashFlow = 0;
        let financingCashFlow = 0;
        let netCashChange = 0;

        // Process each section
        rows.forEach(row => {
            if (row.type === "Section") {
                switch (row.group) {
                    case "OperatingActivities":
                        if (row.Summary?.ColData?.[1]) {
                            operatingCashFlow = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                    case "InvestingActivities":
                        if (row.Summary?.ColData?.[1]) {
                            investingCashFlow = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                    case "FinancingActivities":
                        if (row.Summary?.ColData?.[1]) {
                            financingCashFlow = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                    case "CashChange":
                        if (row.Summary?.ColData?.[1]) {
                            netCashChange = parseFloat(row.Summary.ColData[1].value || 0);
                        }
                        break;
                }
            }
        });

        // If net cash change isn't explicitly provided, calculate it
        if (netCashChange === 0) {
            netCashChange = operatingCashFlow + investingCashFlow + financingCashFlow;
        }

        // Store the summary metrics
        processedData.summary = {
            operatingCashFlow,
            investingCashFlow,
            financingCashFlow,
            netCashChange
        };

        // Generate insights based on cash flow
        generateCashFlowInsights(processedData);

        return processedData;
    } catch (error) {
        console.error("Error processing cash flow:", error);
        processedData.insights.push({
            type: 'error',
            title: 'Processing Error',
            description: `Error processing cash flow data: ${error.message}`
        });
        return processedData;
    }
};

// Helper function to extract current assets
const extractCurrentAssets = (assetsSection, processedData) => {
    try {
        // Current assets are typically a subsection of Assets
        // This logic may need to be adjusted based on the exact QuickBooks data structure
        if (assetsSection.Rows?.Row) {
            const assetRows = Array.isArray(assetsSection.Rows.Row)
                ? assetsSection.Rows.Row
                : [assetsSection.Rows.Row];

            // Look for a section or group called "Current Assets"
            for (const row of assetRows) {
                if ((row.Header?.ColData?.[0]?.value === "Current Assets" ||
                    row.group === "CurrentAssets") &&
                    row.Summary?.ColData?.[1]) {
                    processedData.currentAssets = parseFloat(row.Summary.ColData[1].value || 0);
                    return;
                }
            }
        }
    } catch (error) {
        console.error("Error extracting current assets:", error);
    }
};

// Helper function to extract current liabilities
const extractCurrentLiabilities = (liabilitiesSection, processedData) => {
    try {
        // Current liabilities are typically a subsection of Liabilities
        if (liabilitiesSection.Rows?.Row) {
            const liabilityRows = Array.isArray(liabilitiesSection.Rows.Row)
                ? liabilitiesSection.Rows.Row
                : [liabilitiesSection.Rows.Row];

            // Look for a section or group called "Current Liabilities"
            for (const row of liabilityRows) {
                if ((row.Header?.ColData?.[0]?.value === "Current Liabilities" ||
                    row.group === "CurrentLiabilities") &&
                    row.Summary?.ColData?.[1]) {
                    processedData.currentLiabilities = parseFloat(row.Summary.ColData[1].value || 0);
                    return;
                }
            }
        }
    } catch (error) {
        console.error("Error extracting current liabilities:", error);
    }
};

// Extract top items (income sources or expenses) from a section
const extractTopItems = (rows, sectionType, limit) => {
    try {
        // Find the section
        const section = rows.find(row => row.type === "Section" && row.group === sectionType);
        if (!section || !section.Rows?.Row) return [];

        // Get the items
        const items = Array.isArray(section.Rows.Row) ? section.Rows.Row : [section.Rows.Row];

        // Extract and sort them by amount
        const extractedItems = items
            .filter(item => item.type === "Data" || !item.type)
            .map(item => {
                if (item.ColData && item.ColData.length >= 2) {
                    return {
                        name: item.ColData[0].value,
                        amount: parseFloat(item.ColData[1].value || 0)
                    };
                }
                return null;
            })
            .filter(item => item !== null && !isNaN(item.amount))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, limit);

        return extractedItems;
    } catch (error) {
        console.error(`Error extracting top ${sectionType} items:`, error);
        return [];
    }
};

// Generate insights for Profit & Loss
const generateProfitLossInsights = (data) => {
    const insights = [];
    const { totalIncome, totalExpenses, netIncome, grossMargin, netMargin } = data.summary;

    // Profitability insights
    if (netIncome > 0) {
        insights.push({
            type: 'positive',
            title: 'Positive Cash Flow',
            description: `Your business is generating a positive cash flow of $${netIncome.toLocaleString()} for this period.`
        });
    } else {
        insights.push({
            type: 'negative',
            title: 'Negative Cash Flow',
            description: `Your business is currently spending more than it's earning, with a negative cash flow of $${Math.abs(netIncome).toLocaleString()}.`
        });
    }

    // Profit margin insights
    if (netMargin > 20) {
        insights.push({
            type: 'positive',
            title: 'Strong Profit Margin',
            description: `Your profit margin of ${netMargin.toFixed(1)}% is excellent, indicating good financial health.`
        });
    } else if (netMargin > 10) {
        insights.push({
            type: 'neutral',
            title: 'Healthy Profit Margin',
            description: `Your profit margin of ${netMargin.toFixed(1)}% is healthy for most businesses.`
        });
    } else if (netMargin > 0) {
        insights.push({
            type: 'caution',
            title: 'Low Profit Margin',
            description: `Your profit margin of ${netMargin.toFixed(1)}% is low. Consider strategies to increase revenue or reduce expenses.`
        });
    } else {
        insights.push({
            type: 'negative',
            title: 'Negative Profit Margin',
            description: `Your profit margin is negative at ${netMargin.toFixed(1)}%, indicating your business is losing money.`
        });
    }

    // Expense ratio insights
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    if (expenseRatio > 90 && totalIncome > 0) {
        insights.push({
            type: 'caution',
            title: 'High Expense Ratio',
            description: `Your expenses are ${expenseRatio.toFixed(1)}% of your income, which is quite high. Look for opportunities to reduce costs.`
        });
    }

    // Top revenue insights
    if (data.topIncomeSources && data.topIncomeSources.length > 0) {
        insights.push({
            type: 'info',
            title: 'Top Revenue Source',
            description: `Your top revenue source is ${data.topIncomeSources[0].name} at $${data.topIncomeSources[0].amount.toLocaleString()}.`
        });
    }

    // Add insights to the processed data
    data.insights = insights;
    return data;
};

// Generate insights for Balance Sheet
const generateBalanceSheetInsights = (data) => {
    const insights = [];
    const { totalAssets, totalLiabilities, totalEquity, currentRatio, debtToEquity } = data.summary;

    // Current ratio insights
    if (currentRatio > 2) {
        insights.push({
            type: 'positive',
            title: 'Strong Liquidity',
            description: `Your current ratio of ${currentRatio.toFixed(2)} indicates strong short-term financial health.`
        });
    } else if (currentRatio > 1) {
        insights.push({
            type: 'neutral',
            title: 'Adequate Liquidity',
            description: `Your current ratio of ${currentRatio.toFixed(2)} suggests you can cover your short-term obligations.`
        });
    } else if (currentRatio > 0) {
        insights.push({
            type: 'caution',
            title: 'Liquidity Concern',
            description: `Your current ratio of ${currentRatio.toFixed(2)} is below 1, which could indicate potential short-term cash flow issues.`
        });
    }

    // Debt-to-equity insights
    if (debtToEquity < 0.5) {
        insights.push({
            type: 'positive',
            title: 'Low Leverage',
            description: `Your debt-to-equity ratio of ${debtToEquity.toFixed(2)} indicates conservative use of debt financing.`
        });
    } else if (debtToEquity < 1.5) {
        insights.push({
            type: 'neutral',
            title: 'Moderate Leverage',
            description: `Your debt-to-equity ratio of ${debtToEquity.toFixed(2)} is within a normal range for most businesses.`
        });
    } else {
        insights.push({
            type: 'caution',
            title: 'High Leverage',
            description: `Your debt-to-equity ratio of ${debtToEquity.toFixed(2)} indicates heavy reliance on debt financing, which may increase financial risk.`
        });
    }

    // Asset to liability ratio
    if (totalLiabilities > 0) {
        const assetToLiability = totalAssets / totalLiabilities;
        if (assetToLiability > 2) {
            insights.push({
                type: 'positive',
                title: 'Strong Asset Coverage',
                description: `Your assets are ${assetToLiability.toFixed(1)} times your liabilities, indicating a strong financial position.`
            });
        }
    }

    // Add insights to the processed data
    data.insights = insights;
    return data;
};

// Generate insights for Cash Flow
const generateCashFlowInsights = (data) => {
    const insights = [];
    const { operatingCashFlow, investingCashFlow, financingCashFlow, netCashChange } = data.summary;

    // Operating cash flow insights
    if (operatingCashFlow > 0) {
        insights.push({
            type: 'positive',
            title: 'Positive Operating Cash Flow',
            description: `Your business is generating $${operatingCashFlow.toLocaleString()} from its core operations, which is a positive sign.`
        });
    } else {
        insights.push({
            type: 'negative',
            title: 'Negative Operating Cash Flow',
            description: `Your business is consuming $${Math.abs(operatingCashFlow).toLocaleString()} in its operations, which may not be sustainable long-term.`
        });
    }

    // Investing cash flow context
    if (investingCashFlow < 0 && Math.abs(investingCashFlow) > 0.1 * Math.abs(operatingCashFlow)) {
        insights.push({
            type: 'info',
            title: 'Significant Investment',
            description: `You're investing $${Math.abs(investingCashFlow).toLocaleString()} back into the business, which could lead to future growth.`
        });
    }

    // Financing cash flow context
    if (financingCashFlow > 0) {
        insights.push({
            type: 'info',
            title: 'External Financing',
            description: `You've raised $${financingCashFlow.toLocaleString()} from financing activities, such as loans or equity investments.`
        });
    } else if (financingCashFlow < 0) {
        insights.push({
            type: 'info',
            title: 'Debt Repayment or Dividends',
            description: `You've used $${Math.abs(financingCashFlow).toLocaleString()} for financing activities, such as repaying debt or distributing dividends.`
        });
    }

    // Net cash change insights
    if (netCashChange > 0) {
        insights.push({
            type: 'positive',
            title: 'Increasing Cash Position',
            description: `Your cash position improved by $${netCashChange.toLocaleString()} during this period.`
        });
    } else {
        insights.push({
            type: 'caution',
            title: 'Decreasing Cash Position',
            description: `Your cash position decreased by $${Math.abs(netCashChange).toLocaleString()} during this period.`
        });
    }

    // Add insights to the processed data
    data.insights = insights;
    return data;
};

// Function to begin the animation transformation
const startTransformation = () => {
    setAnimationState('animating');

    // Get references to the DOM elements
    const jsonContainer = jsonContainerRef.current;
    const animationContainer = animationContainerRef.current;
    const insights = insightsRef.current;

    // Clear the animation container
    animationContainer.innerHTML = '';

    // Create a copy of the JSON display for animation
    const jsonText = jsonContainer.textContent;
    const linesOfCode = jsonText.split('\n');

    // Create particle elements for each line
    linesOfCode.forEach((line, lineIndex) => {
        // Skip empty lines
        if (line.trim() === '') return;

        const lineContainer = document.createElement('div');
        lineContainer.className = 'json-line';
        lineContainer.style.setProperty('--line', lineIndex);
        lineContainer.style.setProperty('--total-lines', linesOfCode.length);
        lineContainer.style.top = `${lineIndex * 20}px`; // Approximate line height

        // Add the line's text
        line.split('').forEach((char, charIndex) => {
            const charSpan = document.createElement('span');
            charSpan.className = 'json-char';
            charSpan.textContent = char;
            charSpan.style.setProperty('--char', charIndex);
            charSpan.style.setProperty('--total-chars', line.length);
            lineContainer.appendChild(charSpan);
        });

        animationContainer.appendChild(lineContainer);
    });

    // Trigger the animation
    setTimeout(() => {
        animationContainer.classList.add('animate-active');
        jsonContainer.classList.add('fade-out');

        // After animation completes, show the insights
        setTimeout(() => {
            animationContainer.classList.add('dissolve');
            insights.classList.add('fade-in');
            setAnimationState('complete');
        }, 2800); // Slightly longer than the animation duration
    }, 100);
};

// Reset the animation
const resetTransformation = () => {
    const animationContainer = animationContainerRef.current;
    const jsonContainer = jsonContainerRef.current;
    const insights = insightsRef.current;

    animationContainer.classList.remove('animate-active', 'dissolve');
    jsonContainer.classList.remove('fade-out');
    insights.classList.remove('fade-in');

    setAnimationState('initial');
};

return (
    <div className="data-transformer">
        <div className="controls">
            <h2>Financial Data Explorer</h2>
            <p>Raw financial data can be transformed into meaningful insights with AI</p>

            {animationState === 'initial' && (
                <button
                    className="transform-button"
                    onClick={startTransformation}
                    disabled={!jsonData}
                >
                    <span className="button-icon">✨</span> Transform Data into Clarity
                </button>
            )}

            {animationState === 'animating' && (
                <div className="transformation-message">
                    <div className="pulse-dot"></div>
                    Analyzing financial patterns...
                </div>
            )}

            {animationState === 'complete' && (
                <button
                    className="reset-button"
                    onClick={resetTransformation}
                >
                    <span className="button-icon">↺</span> View Raw Data Again
                </button>
            )}
        </div>

        <div className="visualization-container">
            <div
                ref={jsonContainerRef}
                className={`json-container ${animationState !== 'initial' ? 'hidden' : ''}`}
            >
                {jsonData ? (
                    <pre className="json-content">{formatJSON(jsonData)}</pre>
                ) : (
                    <div className="empty-state">
                        <p>No financial data loaded yet. Please fetch some data to begin.</p>
                    </div>
                )}
            </div>

            <div
                ref={animationContainerRef}
                className="animation-container"
            ></div>

            <div
                ref={insightsRef}
                className={`insights-container ${animationState !== 'complete' ? 'hidden' : ''}`}
            >
                {parsedData && <FinancialInsights data={parsedData} />}
            </div>
        </div>
    </div>
);



export default DataTransformer;