/**
 * Utility functions for formatting data
 */

// Format currency values
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '--';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format percentage values
export const formatPercent = (value) => {
  if (value === undefined || value === null) return '--';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100); // Convert from number to percentage
};

// Format date values
export const formatDate = (dateString) => {
  if (!dateString) return '--';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Shorten long text for display
export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength - 3)}...`;
};

// Extract data from QuickBooks reports for visualization
export const extractVisualizationData = (reportData, reportType) => {
  if (!reportData || !reportData.Rows || !reportData.Rows.Row) {
    return [];
  }

  let result = [];
  
  try {
    if (reportType === 'profit-loss') {
      // Extract income data
      const incomeSection = reportData.Rows.Row.find(row => row.group === 'Income');
      if (incomeSection && incomeSection.Rows && incomeSection.Rows.Row) {
        result = incomeSection.Rows.Row.map(row => ({
          name: truncateText(row.ColData[0].value, 20),
          value: parseFloat(row.ColData[1].value.replace(/,/g, ''))
        }));
      }
    } else if (reportType === 'balance-sheet') {
      // Extract assets data
      const assetsSection = reportData.Rows.Row.find(row => row.group === 'Assets');
      if (assetsSection && assetsSection.Rows && assetsSection.Rows.Row) {
        result = assetsSection.Rows.Row.map(row => ({
          name: truncateText(row.ColData[0].value, 20),
          value: parseFloat(row.ColData[1].value.replace(/,/g, ''))
        }));
      }
    } else if (reportType === 'cash-flow') {
      // Extract cash flow data
      const operatingSection = reportData.Rows.Row.find(row => row.group === 'Operating');
      if (operatingSection && operatingSection.Rows && operatingSection.Rows.Row) {
        result = operatingSection.Rows.Row.map(row => ({
          name: truncateText(row.ColData[0].value, 20),
          value: parseFloat(row.ColData[1].value.replace(/,/g, ''))
        }));
      }
    }
  } catch (error) {
    console.error('Error extracting visualization data:', error);
  }
  
  return result;
};
