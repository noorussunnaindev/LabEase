/**
 * Format price as Pakistani Rupees (PKR)
 * @param {number} amount - The amount in PKR
 * @returns {string} Formatted price (e.g., "Rs. 2,500")
 */
export const formatPKR = (amount) => {
  if (!amount && amount !== 0) return 'Rs. 0';
  
  const num = parseFloat(amount);
  if (isNaN(num)) return 'Rs. 0';
  
  return `Rs. ${num.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Get currency symbol for PKR
 */
export const PKR_SYMBOL = 'Rs.';

/**
 * Format amount for display in various contexts
 */
export const formatPrice = (amount) => formatPKR(amount);
