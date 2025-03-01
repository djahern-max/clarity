import React from 'react';

const FinancialStatement = ({ data, title }) => {
    if (!data || !data.sections) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">{title || 'Financial Statement'}</h3>
                <p className="text-gray-400">No structured data available</p>
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

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-white mb-4">{data.statement_type}</h3>

            {/* Display period or as of date */}
            {data.period && (
                <p className="text-gray-300 mb-6">
                    Period: {data.period.start_date} to {data.period.end_date}
                </p>
            )}
            {data.as_of_date && (
                <p className="text-gray-300 mb-6">
                    As of: {data.as_of_date}
                </p>
            )}

            {/* Render each section */}
            <div className="space-y-6">
                {data.sections.map((section, idx) => (
                    <div key={idx} className="border-t border-gray-700 pt-4">
                        <h4 className="text-xl font-semibold text-blue-300 mb-2">{section.name}</h4>

                        {/* Render subsections if they exist */}
                        {section.subsections ? (
                            section.subsections.map((subsection, subIdx) => (
                                <div key={subIdx} className="ml-4 mb-4">
                                    <h5 className="text-lg font-medium text-blue-200 mb-2">{subsection.name}</h5>
                                    <table className="w-full">
                                        <tbody>
                                            {subsection.items && subsection.items.map((item, itemIdx) => (
                                                <tr key={itemIdx} className="border-b border-gray-700">
                                                    <td className="py-2 text-gray-300">{item.name}</td>
                                                    <td className="py-2 text-right text-gray-300">{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                            <tr className="font-semibold">
                                                <td className="py-2 text-white">Total {subsection.name}</td>
                                                <td className="py-2 text-right text-white">{formatCurrency(subsection.total)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        ) : (
                            section.items ? (
                                <table className="w-full">
                                    <tbody>
                                        {section.items.map((item, itemIdx) => (
                                            <tr key={itemIdx} className="border-b border-gray-700">
                                                <td className="py-2 text-gray-300">{item.name}</td>
                                                <td className="py-2 text-right text-gray-300">{formatCurrency(item.amount)}</td>
                                            </tr>
                                        ))}
                                        <tr className="font-semibold">
                                            <td className="py-2 text-white">Total {section.name}</td>
                                            <td className="py-2 text-right text-white">{formatCurrency(section.total)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-400">No items available</p>
                            )
                        )}
                    </div>
                ))}
            </div>

            {/* Display totals */}
            {data.totals && (
                <div className="mt-8 pt-4 border-t-2 border-gray-600">
                    <h4 className="text-xl font-bold text-white mb-4">Summary</h4>
                    <table className="w-full">
                        <tbody>
                            {Object.entries(data.totals).map(([key, value], idx) => (
                                <tr key={idx} className={idx === Object.entries(data.totals).length - 1 ? 'font-bold text-lg' : ''}>
                                    <td className="py-2 text-gray-300 capitalize">{key.replace(/_/g, ' ')}</td>
                                    <td className={`py-2 text-right ${idx === Object.entries(data.totals).length - 1 ? 'text-green-400' : 'text-gray-300'}`}>
                                        {formatCurrency(value)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default FinancialStatement;