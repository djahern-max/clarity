// components/AITransformationDemo.jsx
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FinancialStatement from './FinancialStatement';

const AITransformationDemo = ({ rawData, structuredData, analysisData }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showProcessing, setShowProcessing] = useState(false);

    // Function to format JSON for display
    const formatJsonForDisplay = (jsonData) => {
        try {
            return JSON.stringify(jsonData, null, 2);
        } catch (e) {
            return "Error formatting JSON data";
        }
    };

    const goToNextStep = (nextStep) => {
        setShowProcessing(true);
        setTimeout(() => {
            setShowProcessing(false);
            setCurrentStep(nextStep);
        }, 1500); // Show processing for 1.5 seconds
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Step navigation */}
            <div className="flex border-b border-gray-700">
                <button
                    onClick={() => setCurrentStep(1)}
                    className={`py-3 px-6 flex-1 text-center transition duration-200 
            ${currentStep === 1
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                    1. Raw JSON Data
                </button>
                <button
                    onClick={() => setCurrentStep(2)}
                    className={`py-3 px-6 flex-1 text-center transition duration-200 
            ${currentStep === 2
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                    2. AI-Structured Statement
                </button>
                <button
                    onClick={() => setCurrentStep(3)}
                    className={`py-3 px-6 flex-1 text-center transition duration-200 
            ${currentStep === 3
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                    3. AI Analysis
                </button>
            </div>

            {/* AI Processing Animation */}
            {showProcessing && (
                <div className="ai-processing-animation flex flex-col items-center justify-center p-10">
                    <div className="pulse-circle animate-pulse h-16 w-16 rounded-full bg-blue-500 mb-4"></div>
                    <p className="text-white text-lg">AI processing data...</p>
                </div>
            )}

            {/* Step content */}
            {!showProcessing && (
                <div className="p-6">
                    {currentStep === 1 && (
                        <div>
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-white mb-2">Raw QuickBooks JSON Data</h3>
                                <p className="text-gray-400 mb-4">
                                    This is the raw JSON data received from QuickBooks' API. Without AI,
                                    you would need to manually parse this complex structure to extract meaningful information.
                                </p>
                            </div>
                            <div className="bg-gray-900 rounded overflow-hidden">
                                <SyntaxHighlighter
                                    language="json"
                                    style={dracula}
                                    customStyle={{
                                        maxHeight: '500px',
                                        overflowY: 'auto',
                                        fontSize: '14px',
                                        padding: '20px'
                                    }}
                                >
                                    {formatJsonForDisplay(rawData)}
                                </SyntaxHighlighter>
                            </div>
                            <div className="mt-6 text-right">
                                <button
                                    onClick={() => goToNextStep(2)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center"
                                >
                                    <span>See the AI Transformation</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-white mb-2">AI-Structured Financial Statement</h3>
                                <p className="text-gray-400 mb-4">
                                    The AI has transformed the complex JSON into a clean, structured financial statement.
                                    Notice how the data is now organized into proper accounting categories and formatted for readability.
                                </p>
                            </div>
                            <FinancialStatement data={structuredData} />
                            <div className="mt-6 text-right">
                                <button
                                    onClick={() => goToNextStep(3)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center"
                                >
                                    <span>View AI Analysis</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-white mb-2">AI Financial Analysis</h3>
                                <p className="text-gray-400 mb-4">
                                    Beyond just structuring the data, the AI provides valuable insights and identifies trends in your financial data.
                                </p>
                            </div>
                            <div className="bg-gray-900 p-6 rounded">
                                {analysisData && (
                                    <>
                                        <h4 className="text-xl font-bold text-blue-300 mb-4">Summary</h4>
                                        <p className="text-gray-300 mb-6">{analysisData.summary}</p>

                                        <h4 className="text-xl font-bold text-blue-300 mb-4">Key Insights</h4>
                                        <ul className="list-disc pl-6 space-y-2 mb-6">
                                            {analysisData.insights && analysisData.insights.map((insight, idx) => (
                                                <li key={idx} className="text-gray-300">{insight}</li>
                                            ))}
                                        </ul>

                                        <h4 className="text-xl font-bold text-blue-300 mb-4">Recommendations</h4>
                                        <ul className="list-disc pl-6 space-y-2">
                                            {analysisData.recommendations && analysisData.recommendations.map((rec, idx) => (
                                                <li key={idx} className="text-gray-300">{rec}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AITransformationDemo;