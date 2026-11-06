export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Net Banking' | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  description?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isDefault?: boolean;
}

export interface CategoryBudget {
  id: string;
  category: string;
  allocatedAmount: number;
  month: string; // YYYY-MM
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateToINR: number; // For simple presentation/conversion if needed
}

export type ThemeMode = 'light' | 'dark';

export type NavTab = 'dashboard' | 'transactions' | 'budgets' | 'analytics' | 'categories' | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface FilterState {
  search: string;
  type: 'all' | 'income' | 'expense';
  category: string;
  paymentMethod: string;
  dateRange: 'all' | 'this_month' | 'last_month' | 'last_90_days' | 'custom';
  startDate?: string;
  endDate?: string;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'title_asc' | 'title_desc';
}
