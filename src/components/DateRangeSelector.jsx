import React, { useState } from 'react';

const DateRangeSelector = ({ onDateRangeChange }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [compareEnabled, setCompareEnabled] = useState(false);
    const [compareStartDate, setCompareStartDate] = useState('');
    const [compareEndDate, setCompareEndDate] = useState('');

    const handleApply = () => {
        if (compareEnabled) {
            onDateRangeChange({
                currentPeriod: { startDate, endDate },
                previousPeriod: { startDate: compareStartDate, endDate: compareEndDate }
            });
        } else {
            onDateRangeChange({
                currentPeriod: { startDate, endDate }
            });
        }
    };

    const handlePresetPeriod = (preset) => {
        const today = new Date();
        let newStartDate, newEndDate;

        switch (preset) {
            case 'thisMonth':
                newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
                newEndDate = today;
                break;
            case 'lastMonth':
                newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'thisQuarter':
                const currentQuarter = Math.floor(today.getMonth() / 3);
                newStartDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
                newEndDate = today;
                break;
            case 'thisYear':
                newStartDate = new Date(today.getFullYear(), 0, 1);
                newEndDate = today;
                break;
            case 'lastYear':
                newStartDate = new Date(today.getFullYear() - 1, 0, 1);
                newEndDate = new Date(today.getFullYear() - 1, 11, 31);
                break;
            default:
                return;
        }

        // Set the primary date range
        setStartDate(newStartDate.toISOString().split('T')[0]);
        setEndDate(newEndDate.toISOString().split('T')[0]);

        // If comparison is enabled, set previous period automatically
        if (compareEnabled) {
            // Calculate the duration of the selected period
            const durationMs = newEndDate - newStartDate;
            const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

            // Set the previous period to be the same duration, ending right before the current period starts
            const prevEndDate = new Date(newStartDate);
            prevEndDate.setDate(prevEndDate.getDate() - 1);

            const prevStartDate = new Date(prevEndDate);
            prevStartDate.setDate(prevStartDate.getDate() - durationDays + 1);

            setCompareStartDate(prevStartDate.toISOString().split('T')[0]);
            setCompareEndDate(prevEndDate.toISOString().split('T')[0]);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Select Date Range</h3>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => handlePresetPeriod('thisMonth')}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                    This Month
                </button>
                <button
                    onClick={() => handlePresetPeriod('lastMonth')}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                    Last Month
                </button>
                <button
                    onClick={() => handlePresetPeriod('thisQuarter')}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                    This Quarter
                </button>
                <button
                    onClick={() => handlePresetPeriod('thisYear')}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                    This Year
                </button>
                <button
                    onClick={() => handlePresetPeriod('lastYear')}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                    Last Year
                </button>
            </div>

            {/* Primary date range inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-400 mb-2">Start Date</label>
                    <input
                        type="date"
                        className="bg-gray-700 text-white p-2 w-full rounded"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">End Date</label>
                    <input
                        type="date"
                        className="bg-gray-700 text-white p-2 w-full rounded"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Compare option */}
            <div className="mb-4">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-500"
                        checked={compareEnabled}
                        onChange={() => setCompareEnabled(!compareEnabled)}
                    />
                    <span className="ml-2 text-gray-300">Compare with previous period</span>
                </label>
            </div>

            {/* Comparison date range inputs (shown only when enabled) */}
            {compareEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-700 rounded">
                    <div>
                        <label className="block text-gray-400 mb-2">Compare Start Date</label>
                        <input
                            type="date"
                            className="bg-gray-700 text-white p-2 w-full rounded"
                            value={compareStartDate}
                            onChange={(e) => setCompareStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Compare End Date</label>
                        <input
                            type="date"
                            className="bg-gray-700 text-white p-2 w-full rounded"
                            value={compareEndDate}
                            onChange={(e) => setCompareEndDate(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Apply button */}
            <button
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded"
                disabled={!startDate || !endDate || (compareEnabled && (!compareStartDate || !compareEndDate))}
            >
                Apply Date Range
            </button>
        </div>
    );
};

export default DateRangeSelector;