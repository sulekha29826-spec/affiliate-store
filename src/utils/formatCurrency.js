/**
 * Formats a numeric value into Indian Rupee (INR) format (e.g., ₹24,999)
 * @param {number|string} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function formatNumber(num) {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(Number(num));
}
