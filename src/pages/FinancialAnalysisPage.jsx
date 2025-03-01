import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import QuickBooksService from '../services/QuickBooksService';
import DateRangeSelector from '../components/DateRangeSelector';
import AITransformationDemo from '../components/AITransformationDemo';
import ComparativeFinancialStatement from '../components/ComparativeFinancialStatement';
import LoadingSpinner from '../utils/LoadingSpinner';
import ErrorMessage from '../utils/ErrorMessage';


const FinancialAnalysisPage = () => {
    const { statementType } = useParams();
    const location = useLocation();
    const [realmId, setRealmId] = useState('');
    const [rawData, setRawData] = useState(null);
    const [structuredData, setStructuredData] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [comparativeData, setComparativeData] = useState(null);
    const [isComparing, setIsComparing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Extract realm_id from URL if present
        const params = new URLSearchParams(location.search);
        const realmIdFromUrl = params.get('realm_id');

        if (realmIdFromUrl) {
            setRealmId(realmIdFromUrl);
        } else {
            // Try to get from localStorage
            const storedRealmId = localStorage.getItem('realmId');
            if (storedRealmId) {
                setRealmId(storedRealmId);
            }
        }
    }, [location]);

    // Modify the handleDateRangeChange function to not automatically structure/analyze
    const handleDateRangeChange = async (dateRanges) => {
        setLoading(true);
        setError(null);

        try {
            // Check if we're doing a comparison
            const isComparingPeriods = !!dateRanges.previousPeriod;
            setIsComparing(isComparingPeriods);

            if (isComparingPeriods) {
                // Get comparative data
                const comparative = await QuickBooksService.getComparativeStatement(
                    statementType,
                    realmId,
                    dateRanges.currentPeriod,
                    dateRanges.previousPeriod
                );

                setComparativeData(comparative);
                setRawData(null);
                setStructuredData(null);
                setAnalysisData(null);
            } else {
                // Get single period data
                let params = {};

                if (statementType === 'balance-sheet') {
                    params = { as_of_date: dateRanges.currentPeriod.endDate };
                } else {
                    params = {
                        start_date: dateRanges.currentPeriod.startDate,
                        end_date: dateRanges.currentPeriod.endDate
                    };
                }

                // Get raw data only
                const rawDataResponse = await QuickBooksService.getFinancialStatement(
                    statementType,
                    realmId,
                    params
                );

                setRawData(rawDataResponse);
                // Don't automatically get structured or analysis data
                setStructuredData(null);
                setAnalysisData(null);
            }
        } catch (error) {
            console.error('Error fetching financial data:', error);
            setError('Failed to fetch financial data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Add these functions to handle the AI transformation steps
    const handleGenerateStructure = async () => {
        if (!rawData) return;

        try {
            // Structure the data
            const structured = await QuickBooksService.structureFinancialData(
                statementType,
                rawData
            );

            setStructuredData(structured);
            return structured;
        } catch (error) {
            console.error('Error structuring data:', error);
            setError('Failed to structure financial data with AI.');
        }
    };

    const handleGenerateAnalysis = async () => {
        if (!rawData) return;

        try {
            // Analyze the data
            const analysis = await QuickBooksService.analyzeFinancialData(
                statementType,
                rawData
            );

            setAnalysisData(analysis);
            return analysis;
        } catch (error) {
            console.error('Error analyzing data:', error);
            setError('Failed to analyze financial data with AI.');
        }
    };



    const getStatementTitle = () => {
        switch (statementType) {
            case 'profit-loss':
                return 'Profit & Loss Statement';
            case 'balance-sheet':
                return 'Balance Sheet';
            case 'cash-flow':
                return 'Cash Flow Statement';
            default:
                return 'Financial Statement';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">{getStatementTitle()}</h1>

                {/* Date range selector */}
                <DateRangeSelector onDateRangeChange={handleDateRangeChange} />

                {/* Loading state */}
                {loading && (
                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                        <LoadingSpinner />
                        <p className="text-gray-300 mt-4">Loading financial data...</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <ErrorMessage message={error} />
                )}

                {/* Display appropriate content based on mode */}
                // This floating JSX block is causing a problem
                {
                    !loading && !error && (
                        <>
                            {isComparing && comparativeData ? (
                                <ComparativeFinancialStatement
                                    data={comparativeData}
                                    title={getStatementTitle()}
                                />
                            ) : rawData ? (
                                <AITransformationDemo
                                    rawData={rawData}
                                    structuredData={structuredData}
                                    analysisData={analysisData}
                                    onGenerateStructure={handleGenerateStructure}
                                    onGenerateAnalysis={handleGenerateAnalysis}
                                />
                            ) : (
                                <div className="bg-gray-800 rounded-lg p-8 text-center">
                                    <p className="text-gray-300">
                                        Select a date range to view financial data
                                    </p>
                                </div>
                            )}
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default FinancialAnalysisPage;