// components/AITransformationDemo.jsx
import React, { useState } from 'react';
import RawJumbledJSON from './RawJumbledJSON';
import AIFinancialStatement from './AIFinancialStatement';
import FinancialStatement from './FinancialStatement';

const AITransformationDemo = ({ rawData, structuredData, analysisData, onGenerateStructure, onGenerateAnalysis }) => {
    const [showRawData, setShowRawData] = useState(true);
    const [showStructured, setShowStructured] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [processingStage, setProcessingStage] = useState(0);

    const handleTransformClick = async () => {
        setProcessingMessage('AI transforming unstructured data into organized financial statement...');
        setIsProcessing(true);
        setProcessingStage(1);

        // Call the parent function to generate structured data if it hasn't been done already
        if (!structuredData && onGenerateStructure) {
            await onGenerateStructure();
        }

        // Simulate AI processing stages
        setTimeout(() => {
            setProcessingMessage('Identifying financial patterns in raw data...');
            setProcessingStage(2);

            setTimeout(() => {
                setProcessingMessage('Structuring data into accounting categories...');
                setProcessingStage(3);

                setTimeout(() => {
                    setIsProcessing(false);
                    setShowRawData(false);
                    setShowStructured(true);
                }, 800);
            }, 1000);
        }, 1200);
    };

    const handleAnalyzeClick = async () => {
        setProcessingMessage('AI analyzing financial data for insights and recommendations...');
        setIsProcessing(true);
        setProcessingStage(1);

        // Call the parent function to generate analysis if it hasn't been done already
        if (!analysisData && onGenerateAnalysis) {
            await onGenerateAnalysis();
        }

        // Simulate AI processing stages
        setTimeout(() => {
            setProcessingMessage('Calculating performance metrics and identifying trends...');
            setProcessingStage(2);

            setTimeout(() => {
                setProcessingMessage('Generating financial recommendations...');
                setProcessingStage(3);

                setTimeout(() => {
                    setIsProcessing(false);
                    setShowStructured(false);
                    setShowAnalysis(true);
                }, 800);
            }, 1000);
        }, 1200);
    };

    const handleBackToRawClick = () => {
        setShowStructured(false);
        setShowAnalysis(false);
        setShowRawData(true);
    };

    const handleBackToStructuredClick = () => {
        setShowRawData(false);
        setShowAnalysis(false);
        setShowStructured(true);
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Processing animation overlay */}
            {isProcessing && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="text-center p-8 rounded-lg max-w-md">
                        <div className="mb-4">
                            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                                    style={{ width: `${(processingStage / 3) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="animate-pulse flex space-x-2 mb-4 justify-center">
                            <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                            <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                            <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                        </div>
                        <p className="text-white text-xl font-bold">{processingMessage}</p>
                        <p className="text-blue-300 mt-2">Powered by AI</p>
                    </div>
                </div>
            )}

            {/* Raw Data View */}
            {showRawData && (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-white">Raw QuickBooks JSON Data</h3>
                        <div className="bg-blue-600 rounded-full px-3 py-1 text-white text-sm font-bold">
                            Step 1 of 3
                        </div>
                    </div>
                    <p className="text-gray-400 mb-6">
                        This is the raw unstructured JSON data received from QuickBooks' API. Without AI processing, this data is difficult to interpret and use for financial decision-making.
                    </p>

                    <div className="bg-gray-900 rounded overflow-hidden mb-6">
                        <RawJumbledJSON rawData={rawData} />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleTransformClick}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-8 rounded-lg font-bold text-lg flex items-center shadow-lg transform transition hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Transform with AI
                        </button>
                    </div>
                </div>
            )}

            {/* Structured Data View */}
            {showStructured && (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-white">AI-Structured Financial Statement</h3>
                        <div className="bg-blue-600 rounded-full px-3 py-1 text-white text-sm font-bold">
                            Step 2 of 3
                        </div>
                    </div>
                    <p className="text-gray-400 mb-6">
                        The AI has transformed the complex JSON blob into this clean, structured financial statement.
                        Notice how the data is now organized into proper accounting categories and formatted for readability.
                    </p>

                    <div className="mb-6">
                        {/* Use AIFinancialStatement instead of the traditional component */}
                        <AIFinancialStatement rawData={rawData} />
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleBackToRawClick}
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium"
                        >
                            ← Back to Raw Data
                        </button>
                        <button
                            onClick={handleAnalyzeClick}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-8 rounded-lg font-bold text-lg flex items-center shadow-lg transform transition hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            Analyze with AI
                        </button>
                    </div>
                </div>
            )}

            {/* Analysis View */}
            {showAnalysis && analysisData && (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-white">AI Financial Analysis</h3>
                        <div className="bg-blue-600 rounded-full px-3 py-1 text-white text-sm font-bold">
                            Step 3 of 3
                        </div>
                    </div>
                    <p className="text-gray-400 mb-6">
                        Beyond just structuring the data, the AI has identified key insights and provided recommendations based on your financial data.
                    </p>

                    <div className="bg-gray-900 p-6 rounded mb-6">
                        <div className="mb-6">
                            <h4 className="text-xl font-bold text-blue-300 mb-4">Summary</h4>
                            <p className="text-gray-300">{analysisData.summary}</p>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-xl font-bold text-blue-300 mb-4">Key Insights</h4>
                            <ul className="list-disc pl-6 space-y-2">
                                {analysisData.insights && analysisData.insights.map((insight, idx) => (
                                    <li key={idx} className="text-gray-300">{insight}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xl font-bold text-blue-300 mb-4">Recommendations</h4>
                            <ul className="list-disc pl-6 space-y-2">
                                {analysisData.recommendations && analysisData.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-gray-300">{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleBackToRawClick}
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium"
                        >
                            ← Back to Raw Data
                        </button>
                        <button
                            onClick={handleBackToStructuredClick}
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium"
                        >
                            ← Back to Structured Statement
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AITransformationDemo;