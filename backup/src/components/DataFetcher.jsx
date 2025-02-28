// DataFetcher.jsx - Component for fetching financial data from QuickBooks
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DataFetcher.css';
import quickBooksService from '../services/QuickBooksService';

const DataFetcher = ({ apiConfig, onDataFetched }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [reportType, setReportType] = useState('profit-loss');
    const [dateRange, setDateRange] = useState(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

        return {
            startDate: firstDay.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0]
        };
    });

    const reportOptions = [
        { id: 'profit-loss', name: 'Money Flow Summary', endpoint: 'profit-loss', description: 'See where your money is coming from and going to' },
        { id: 'balance-sheet', name: 'Financial Position Snapshot', endpoint: 'balance-sheet', description: 'View what you own and what you owe' },
        { id: 'cash-flow', name: 'Cash Movement Tracker', endpoint: 'cash-flow', description: 'Track the flow of cash in and out of your business' },
    ];

    // Check connection status when component mounts
    useEffect(() => {
        if (apiConfig.realmId) {
            checkConnectionStatus();
        }
    }, [apiConfig.realmId]);

    const checkConnectionStatus = async () => {
        try {
            const status = await quickBooksService.checkConnectionStatus(apiConfig.realmId);
            setConnectionStatus(status);
        } catch (error) {
            console.error('Error checking connection status:', error);
            setConnectionStatus({
                connected: false,
                reason: 'Error checking connection: ' + error.message
            });
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getPeriodDescription = () => {
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);

        // Same month and year
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(start)}`;
        }

        // Same year
        if (start.getFullYear() === end.getFullYear()) {
            return `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(start)} - ${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(end)}`;
        }

        // Different years
        return `${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(start)} - ${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(end)}`;
    };

    const fetchData = async () => {
        if (!apiConfig.realmId) {
            setError('Please configure your QuickBooks Realm ID in the Settings page');
            return;
        }

        const selectedReport = reportOptions.find(r => r.id === reportType);
        setLoading(true);
        setError(null);

        try {
            let data;

            // Fetch data based on report type
            switch (reportType) {
                case 'profit-loss':
                    data = await quickBooksService.getProfitAndLoss(
                        apiConfig.realmId,
                        dateRange.startDate,
                        dateRange.endDate
                    );
                    break;

                case 'balance-sheet':
                    data = await quickBooksService.getBalanceSheet(
                        apiConfig.realmId,
                        dateRange.endDate // Using end date as "as of" date
                    );
                    break;

                case 'cash-flow':
                    data = await quickBooksService.getCashFlow(
                        apiConfig.realmId,
                        dateRange.startDate,
                        dateRange.endDate
                    );
                    break;

                default:
                    throw new Error('Invalid report type');
            }

            // Log raw data for debugging
            console.log('Raw financial data:', data);

            // Pass the data up to the parent component
            onDataFetched(data, getPeriodDescription());

            // Navigate to the transform page
            navigate('/transform');
        } catch (err) {
            console.error('Error fetching financial data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch financial data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="data-fetcher-container">
            <div className="data-fetcher-header">
                <h1>Explore Your Financial Data</h1>
                <p className="subtitle">Select a report type and time period to begin</p>
            </div>

            {connectionStatus && !connectionStatus.connected && (
                <div className="connection-warning">
                    <h3>Not Connected to QuickBooks</h3>
                    <p>{connectionStatus.reason || 'You need to connect to QuickBooks before fetching data.'}</p>
                    <a href="/settings" className="settings-link">Go to Settings to Connect</a>
                </div>
            )}

            <div className="report-options">
                {reportOptions.map(option => (
                    <div
                        key={option.id}
                        className={`report-option ${reportType === option.id ? 'selected' : ''}`}
                        onClick={() => setReportType(option.id)}
                    >
                        <div className="report-option-icon">
                            {option.id === 'profit-loss' && '💰'}
                            {option.id === 'balance-sheet' && '📊'}
                            {option.id === 'cash-flow' && '💸'}
                        </div>
                        <div className="report-option-details">
                            <h3>{option.name}</h3>
                            <p>{option.description}</p>
                        </div>
                        {reportType === option.id && <div className="selected-indicator">✓</div>}
                    </div>
                ))}
            </div>

            <div className="date-selector">
                <h2>Select Time Period</h2>
                <div className="date-inputs">
                    <div className="date-field">
                        <label htmlFor="startDate">From</label>
                        <input
                            id="startDate"
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="date-field">
                        <label htmlFor="endDate">To</label>
                        <input
                            id="endDate"
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠</span>
                    {error}
                </div>
            )}

            <div className="fetch-controls">
                <button
                    className="fetch-button"
                    onClick={fetchData}
                    disabled={loading || !apiConfig.realmId || (connectionStatus && !connectionStatus.connected)}
                >
                    {loading ? (
                        <>
                            <span className="loading-spinner"></span>
                            <span>Fetching Data...</span>
                        </>
                    ) : (
                        <>
                            <span className="button-icon">📥</span>
                            <span>Fetch Financial Data</span>
                        </>
                    )}
                </button>

                {!apiConfig.realmId && (
                    <div className="config-reminder">
                        <p>
                            <span className="reminder-icon">ℹ</span>
                            Please configure your QuickBooks access in the
                            <a href="/settings"> Settings page</a> first.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataFetcher;