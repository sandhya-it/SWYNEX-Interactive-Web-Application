import { CurrencyCode, Transaction } from '../types';

export const CURRENCY_MAP: Record<CurrencyCode, { symbol: string; locale: string; name: string }> = {
  INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', locale: 'de-DE', name: 'Euro' },
  GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound' },
  JPY: { symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
};

/**
 * Format currency with locale-appropriate thousand/lakh separators
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'INR'): string {
  const conf = CURRENCY_MAP[currency] || CURRENCY_MAP.INR;
  try {
    return new Intl.NumberFormat(conf.locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${conf.symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Format date string (YYYY-MM-DD) into readable format (e.g., "12 Oct 2026")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Format month string (YYYY-MM) into "October 2026"
 */
export function formatMonth(yearMonth: string): string {
  if (!yearMonth) return '';
  const [year, month] = yearMonth.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Return current month in YYYY-MM format
 */
export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Export transactions to CSV and trigger browser download
 */
export function exportTransactionsToCSV(transactions: Transaction[], filename = 'expensewise_transactions.csv'): void {
  const headers = ['ID', 'Title', 'Type', 'Category', 'Amount', 'Date', 'Payment Method', 'Description'];
  
  const rows = transactions.map((t) => [
    t.id,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.type,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.amount,
    t.date,
    `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
