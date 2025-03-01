import React from 'react';

const ComparativeFinancialStatement = ({ data, title }) => {
    if (!data || !data.current || !data.previous) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">{title || 'Comparative Financial Statement'}</h3>
                <p className="text-gray-400">No comparative data available</p>
            </div>
        );
    }

    // Function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Function to calculate and format percentage change
    const calculateChange = (current, previous) => {
        if (!previous || previous === 0) return { value: 0, percentage: 0 };

        const change = current - previous;
        const percentage = (change / Math.abs(previous)) * 100;

        return {
            value: change,
            percentage: percentage
        };
    };

    // Function to get color based on change (positive = green, negative = red)
    const getChangeColor = (change) => {
        if (change > 0) return 'text-green-400';
        if (change < 0) return 'text-red-400';
        return 'text-gray-400';
    };

    // Get statement type and period info
    const statementType = data.current.statement_type || 'Financial Statement';
    const currentPeriod = data.current.period || { start_date: 'N/A', end_date: 'N/A' };
    const previousPeriod = data.previous.period || { start_date: 'N/A', end_date: 'N/A' };

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-white mb-4">{statementType} - Comparative Analysis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-3 border border-gray-700 rounded">
                    <h4 className="text-lg font-semibold text-blue-300">Current Period</h4>
                    <p className="text-gray-300">
                        {currentPeriod.start_date} to {currentPeriod.end_date}
                    </p>
                </div>
                <div className="p-3 border border-gray-700 rounded">
                    <h4 className="text-lg font-semibold text-blue-300">Comparison Period</h4>
                    <p className="text-gray-300">
                        {previousPeriod.start_date} to {previousPeriod.end_date}
                    </p>
                </div>
            </div>

            {/* Render each section */}
            <div className="space-y-6">
                {data.sections.map((section, idx) => (
                    <div key={idx} className="border-t border-gray-700 pt-4">
                        <h4 className="text-xl font-semibold text-blue-300 mb-2">{section.name}</h4>

                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-2 text-gray-400">Item</th>
                                    <th className="text-right py-2 text-gray-400">Current</th>
                                    <th className="text-right py-2 text-gray-400">Previous</th>
                                    <th className="text-right py-2 text-gray-400">Change</th>
                                    <th className="text-right py-2 text-gray-400">% Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {section.items.map((item, itemIdx) => {
                                    const change = calculateChange(item.current, item.previous);
                                    const changeColor = getChangeColor(change.value);

                                    return (
                                        <tr key={itemIdx} className="border-b border-gray-700">
                                            <td className="py-2 text-gray-300">{item.name}</td>
                                            <td className="py-2 text-right text-gray-300">{formatCurrency(item.current)}</td>
                                            <td className="py-2 text-right text-gray-300">{formatCurrency(item.previous)}</td>
                                            <td className={`py-2 text-right ${changeColor}`}>{formatCurrency(change.value)}</td>
                                            <td className={`py-2 text-right ${changeColor}`}>{change.percentage.toFixed(1)}%</td>
                                        </tr>
                                    );
                                })}

                                {/* Section total */}
                                {section.total && (
                                    <tr className="font-semibold">
                                        <td className="py-2 text-white">Total {section.name}</td>
                                        <td className="py-2 text-right text-white">{formatCurrency(section.total.current)}</td>
                                        <td className="py-2 text-right text-white">{formatCurrency(section.total.previous)}</td>

                                        {(() => {
                                            const totalChange = calculateChange(section.total.current, section.total.previous);
                                            const totalChangeColor = getChangeColor(totalChange.value);

                                            return (
                                                <>
                                                    <td className={`py-2 text-right ${totalChangeColor}`}>{formatCurrency(totalChange.value)}</td>
                                                    <td className={`py-2 text-right ${totalChangeColor}`}>{totalChange.percentage.toFixed(1)}%</td>
                                                </>
                                            );
                                        })()}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* Display overall summary */}
            {data.summary && (
                <div className="mt-8 pt-4 border-t-2 border-gray-600">
                    <h4 className="text-xl font-bold text-white mb-4">Summary</h4>
                    <div className="bg-gray-900 p-4 rounded">
                        <p className="text-gray-300">{data.summary}</p>

                        {data.trends && data.trends.length > 0 && (
                            <div className="mt-4">
                                <h5 className="text-lg font-semibold text-blue-300 mb-2">Key Trends</h5>
                                <ul className="list-disc pl-5 space-y-1">
                                    {data.trends.map((trend, idx) => (
                                        <li key={idx} className={getChangeColor(trend.impact)}>
                                            {trend.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparativeFinancialStatement;