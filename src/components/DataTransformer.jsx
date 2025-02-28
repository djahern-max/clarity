// DataTransformer.jsx - The component that handles the JSON to insights transformation
import React, { useState, useRef, useEffect } from 'react';
import './DataTransformer.css';
import FinancialInsights from './FinancialInsights';

const DataTransformer = ({ jsonData, timeframe }) => {
    const [animationState, setAnimationState] = useState('initial'); // initial, animating, complete
    const [parsedData, setParsedData] = useState(null);
    const animationContainerRef = useRef(null);
    const jsonContainerRef = useRef(null);
    const insightsRef = useRef(null);

    // Function to pretty-print the JSON
    const formatJSON = (json) => {
        return JSON.stringify(json, null, 2);
    };

    // Process the JSON data into insights when it changes
    useEffect(() => {
        if (jsonData) {
            setParsedData(processFinancialData(jsonData));
        }
    }, [jsonData]);

    // Function to process the raw financial data
    const processFinancialData = (data) => {
        // In a real app, this would do detailed financial analysis
        // For now, we'll extract some basic metrics
        let processedData = {
            timeframe: timeframe || 'Current Period',
            summary: {},
            insights: [],
            details: []
        };

        try {
            const rows = data.Rows?.Row || [];

            // Extract summary data
            let totalIncome = 0;
            let totalExpenses = 0;
            let netIncome = 0;

            for (const row of rows) {
                if (row.type === "Section") {
                    if (row.group === "Income" && row.Summary?.ColData?.[1]) {
                        totalIncome = parseFloat(row.Summary.ColData[1].value || 0);
                        processedData.summary.income = totalIncome;
                    } else if (row.group === "Expenses" && row.Summary?.ColData?.[1]) {
                        totalExpenses = parseFloat(row.Summary.ColData[1].value || 0);
                        processedData.summary.expenses = totalExpenses;
                    } else if (row.group === "NetIncome" && row.Summary?.ColData?.[1]) {
                        netIncome = parseFloat(row.Summary.ColData[1].value || 0);
                        processedData.summary.netIncome = netIncome;
                    }
                }
            }

            // Calculate some metrics
            const profitMargin = (netIncome / totalIncome) * 100;
            processedData.summary.profitMargin = profitMargin;

            // Generate insights based on the data
            if (netIncome > 0) {
                processedData.insights.push({
                    type: 'positive',
                    title: 'Positive Cash Flow',
                    description: `Your business is generating a positive cash flow of $${netIncome.toLocaleString()} for this period.`
                });
            } else {
                processedData.insights.push({
                    type: 'negative',
                    title: 'Negative Cash Flow',
                    description: `Your business is currently spending more than it's earning, with a negative cash flow of $${Math.abs(netIncome).toLocaleString()}.`
                });
            }

            if (profitMargin > 20) {
                processedData.insights.push({
                    type: 'positive',
                    title: 'Strong Profit Margin',
                    description: `Your profit margin of ${profitMargin.toFixed(1)}% is excellent, indicating good financial health.`
                });
            } else if (profitMargin > 10) {
                processedData.insights.push({
                    type: 'neutral',
                    title: 'Decent Profit Margin',
                    description: `Your profit margin of ${profitMargin.toFixed(1)}% is acceptable but could be improved.`
                });
            } else if (profitMargin > 0) {
                processedData.insights.push({
                    type: 'caution',
                    title: 'Low Profit Margin',
                    description: `Your profit margin of ${profitMargin.toFixed(1)}% is low. Consider strategies to increase revenue or reduce costs.`
                });
            } else {
                processedData.insights.push({
                    type: 'negative',
                    title: 'Negative Profit Margin',
                    description: `Your profit margin is negative at ${profitMargin.toFixed(1)}%, indicating your business is losing money.`
                });
            }

            // Extract top income sources
            const incomeSection = rows.find(row => row.type === "Section" && row.group === "Income");
            if (incomeSection && incomeSection.Rows && incomeSection.Rows.Row) {
                const incomeItems = Array.isArray(incomeSection.Rows.Row)
                    ? incomeSection.Rows.Row
                    : [incomeSection.Rows.Row];

                const topIncomeSources = incomeItems
                    .map(item => ({
                        name: item.ColData[0].value,
                        amount: parseFloat(item.ColData[1].value || 0)
                    }))
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 3);

                if (topIncomeSources.length > 0) {
                    processedData.summary.topIncomeSources = topIncomeSources;
                    processedData.insights.push({
                        type: 'info',
                        title: 'Top Revenue Drivers',
                        description: `Your top revenue source is ${topIncomeSources[0].name} at $${topIncomeSources[0].amount.toLocaleString()}.`
                    });
                }
            }

            // Extract top expenses
            const expenseSection = rows.find(row => row.type === "Section" && row.group === "Expenses");
            if (expenseSection && expenseSection.Rows && expenseSection.Rows.Row) {
                const expenseItems = Array.isArray(expenseSection.Rows.Row)
                    ? expenseSection.Rows.Row
                    : [expenseSection.Rows.Row];

                const topExpenses = expenseItems
                    .map(item => ({
                        name: item.ColData[0].value,
                        amount: parseFloat(item.ColData[1].value || 0)
                    }))
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 3);

                if (topExpenses.length > 0) {
                    processedData.summary.topExpenses = topExpenses;
                    processedData.insights.push({
                        type: 'info',
                        title: 'Largest Expenses',
                        description: `Your largest expense is ${topExpenses[0].name} at $${topExpenses[0].amount.toLocaleString()}.`
                    });
                }
            }

            return processedData;
        } catch (error) {
            console.error('Error processing financial data:', error);
            processedData.insights.push({
                type: 'error',
                title: 'Analysis Error',
                description: 'There was an error analyzing this financial data. Please try again.'
            });
            return processedData;
        }
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
};

export default DataTransformer;