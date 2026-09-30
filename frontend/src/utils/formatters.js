/**
 * Helper utility functions for formatting currency and dates
 */

/**
 * Format a numeric amount as currency (Indian Rupee ₹ / standard number format)
 * @param {number|string} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format an ISO date string (e.g. '2026-09-30') into a readable string
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Get an emoji icon for a product based on its name
 * @param {string} name
 * @returns {string}
 */
export function getProductIcon(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('laptop') || lower.includes('computer') || lower.includes('macbook')) {
    return '💻';
  }
  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('iphone')) {
    return '📱';
  }
  if (lower.includes('headphone') || lower.includes('earphone') || lower.includes('audio')) {
    return '🎧';
  }
  if (lower.includes('keyboard') || lower.includes('keypad')) {
    return '⌨️';
  }
  if (lower.includes('mouse')) {
    return '🖱️';
  }
  if (lower.includes('watch')) {
    return '⌚';
  }
  if (lower.includes('camera')) {
    return '📷';
  }
  if (lower.includes('tv') || lower.includes('monitor')) {
    return '🖥️';
  }
  return '📦';
}
