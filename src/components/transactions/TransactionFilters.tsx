import React from 'react';
import { Search, Download, RotateCcw, Filter, ArrowUpDown } from 'lucide-react';
import { useExpenseWise } from '../../context/ExpenseContext';
import { FilterState, Transaction } from '../../types';
import { exportTransactionsToCSV } from '../../utils/formatters';

interface TransactionFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  filteredTransactions: Transaction[];
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  filteredTransactions,
}) => {
  const { state, addToast } = useExpenseWise();

  const handleReset = () => {
    onFilterChange({
      search: '',
      type: 'all',
      category: '',
      paymentMethod: '',
      dateRange: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'date_desc',
    });
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      addToast('No Transactions to Export', 'Try resetting filters to export your records.', 'warning');
      return;
    }
    exportTransactionsToCSV(filteredTransactions, `expensewise_${filters.dateRange}_${Date.now()}.csv`);
    addToast('CSV Download Started', `Exported ${filteredTransactions.length} transaction records.`);
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.type !== 'all' ||
    filters.category !== '' ||
    filters.paymentMethod !== '' ||
    filters.dateRange !== 'all' ||
    filters.sortBy !== 'date_desc';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search and Primary Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search transactions by title or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {/* Type Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value as FilterState['type'] })}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            {state.categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Payment Method
          </label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => onFilterChange({ ...filters, paymentMethod: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash">Cash</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as FilterState['dateRange'] })}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Time</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_90_days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="date_desc">Date: Newest First</option>
            <option value="date_asc">Date: Oldest First</option>
            <option value="amount_desc">Amount: High to Low</option>
            <option value="amount_asc">Amount: Low to High</option>
            <option value="title_asc">Title: A to Z</option>
            <option value="title_desc">Title: Z to A</option>
          </select>
        </div>
      </div>

      {/* Custom Date Range Pickers (shown only when custom is selected) */}
      {filters.dateRange === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">From:</span>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
            className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
          />
          <span className="font-semibold text-slate-600 dark:text-slate-300">To:</span>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
            className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
          />
        </div>
      )}
    </div>
  );
};
