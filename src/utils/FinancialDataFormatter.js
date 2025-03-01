// utils/financialDataFormatter.js

/**
 * Transforms QuickBooks financial statement data into a format suitable for visualization
 * @param {Object} data - Raw QuickBooks financial data 
 * @param {string} reportType - Type of report (profit-loss, balance-sheet, cash-flow)
 * @returns {Array} - Formatted data for visualization
 */
export const formatFinancialData = (data, reportType) => {
    // Check if we have valid data with rows
    if (!data || !data.Rows || !data.Rows.Row) {
        console.error('No valid rows data found in the financial data');
        return [];
    }

    // Extract rows
    const rows = data.Rows.Row;
    const formattedData = [];

    // Process based on report type
    switch (reportType) {
        case 'profit-loss':
            return formatProfitLossData(rows);
        case 'balance-sheet':
            return formatBalanceSheetData(rows);
        case 'cash-flow':
            return formatCashFlowData(rows);
        default:
            console.error('Unsupported report type:', reportType);
            return [];
    }
};

/**
 * Formats profit and loss data for visualization
 * @param {Array} rows - QuickBooks P&L report rows
 * @returns {Array} - Formatted data for visualization
 */
const formatProfitLossData = (rows) => {
    const formattedData = [];

    // Process each section (Income, Expenses, etc.)
    rows.forEach(row => {
        // Skip rows without proper data
        if (!row || (!row.Header && !row.Summary)) {
            return;
        }

        // Get the section name and group
        const group = row.group || '';

        // For sections with details (like Income or Expenses)
        if (row.type === 'Section' && row.group) {
            let sectionValue = 0;

            // Try to get value from Summary if available
            if (row.Summary && row.Summary.ColData && row.Summary.ColData[0]) {
                const valueStr = row.Summary.ColData[0].value || '0';
                sectionValue = parseFloat(valueStr.replace(/,/g, '')) || 0;
            }

            // For main categories like Income, Expenses, Net Income
            if (['Income', 'Expenses', 'GrossProfit', 'NetOperatingIncome', 'NetIncome'].includes(group)) {
                formattedData.push({
                    name: formatGroupName(group),
                    value: Math.abs(sectionValue) // Use absolute value for visualization
                });
            }
        }
    });

    return formattedData;
};

/**
 * Formats balance sheet data for visualization
 * @param {Array} rows - QuickBooks balance sheet report rows
 * @returns {Array} - Formatted data for visualization
 */
const formatBalanceSheetData = (rows) => {
    const formattedData = [];

    // Process each section (Assets, Liabilities, Equity)
    rows.forEach(row => {
        // Skip rows without proper data
        if (!row || (!row.Header && !row.Summary)) {
            return;
        }

        // Get the section name and group
        const group = row.group || '';

        // For main sections like Assets, Liabilities, Equity
        if (row.type === 'Section' && ['Assets', 'Liabilities', 'Equity'].includes(group)) {
            let sectionValue = 0;

            // Try to get value from Summary if available
            if (row.Summary && row.Summary.ColData && row.Summary.ColData[0]) {
                const valueStr = row.Summary.ColData[0].value || '0';
                sectionValue = parseFloat(valueStr.replace(/,/g, '')) || 0;
            }

            formattedData.push({
                name: group,
                value: Math.abs(sectionValue) // Use absolute value for visualization
            });
        }
    });

    return formattedData;
};

/**
 * Formats cash flow data for visualization
 * @param {Array} rows - QuickBooks cash flow report rows
 * @returns {Array} - Formatted data for visualization
 */
const formatCashFlowData = (rows) => {
    const formattedData = [];

    // Process each section of the cash flow
    rows.forEach(row => {
        // Skip rows without proper data
        if (!row || (!row.Header && !row.Summary)) {
            return;
        }

        // Get the section name and group
        const group = row.group || '';

        // For main sections of cash flow
        if (row.type === 'Section' &&
            ['OperatingActivities', 'InvestingActivities', 'FinancingActivities'].includes(group)) {
            let sectionValue = 0;

            // Try to get value from Summary if available
            if (row.Summary && row.Summary.ColData && row.Summary.ColData[0]) {
                const valueStr = row.Summary.ColData[0].value || '0';
                sectionValue = parseFloat(valueStr.replace(/,/g, '')) || 0;
            }

            formattedData.push({
                name: formatGroupName(group),
                value: sectionValue // Keep sign for cash flow
            });
        }
    });

    return formattedData;
};

/**
 * Formats group names to be more readable
 * @param {string} group - Group identifier from QuickBooks
 * @returns {string} - Formatted group name
 */
const formatGroupName = (group) => {
    const nameMap = {
        'Income': 'Income',
        'Expenses': 'Expenses',
        'GrossProfit': 'Gross Profit',
        'NetOperatingIncome': 'Operating Income',
        'NetIncome': 'Net Income',
        'Assets': 'Assets',
        'Liabilities': 'Liabilities',
        'Equity': 'Equity',
        'OperatingActivities': 'Operating Activities',
        'InvestingActivities': 'Investing Activities',
        'FinancingActivities': 'Financing Activities'
    };

    return nameMap[group] || group;
};