import React, { useMemo, useState } from 'react';
import { Plus, ArrowLeftRight } from 'lucide-react';
import { useExpenseWise } from '../context/ExpenseContext';
import { FilterState, Transaction } from '../types';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency, getCurrentYearMonth } from '../utils/formatters';

export const TransactionsPage: React.FC = () => {
  const { state, setIsAddTransactionOpen } = useExpenseWise();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    category: '',
    paymentMethod: '',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'date_desc',
  });

  const filteredTransactions = useMemo(() => {
    let result = [...state.transactions];

    // Search filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    // Category filter
    if (filters.category) {
      result = result.filter(
        (t) => t.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Payment method filter
    if (filters.paymentMethod) {
      result = result.filter((t) => t.paymentMethod === filters.paymentMethod);
    }

    // Date range filter
    const now = new Date();
    const currentYM = getCurrentYearMonth();

    if (filters.dateRange === 'this_month') {
      result = result.filter((t) => t.date && t.date.startsWith(currentYM));
    } else if (filters.dateRange === 'last_month') {
      const [y, m] = currentYM.split('-').map(Number);
      const prevM = m === 1 ? 12 : m - 1;
      const prevY = m === 1 ? y - 1 : y;
      const prevYM = `${prevY}-${String(prevM).padStart(2, '0')}`;
      result = result.filter((t) => t.date && t.date.startsWith(prevYM));
    } else if (filters.dateRange === 'last_90_days') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(now.getDate() - 90);
      const isoNinety = ninetyDaysAgo.toISOString().split('T')[0];
      result = result.filter((t) => t.date && t.date >= isoNinety);
    } else if (filters.dateRange === 'custom') {
      if (filters.startDate) {
        result = result.filter((t) => t.date >= filters.startDate!);
      }
      if (filters.endDate) {
        result = result.filter((t) => t.date <= filters.endDate!);
      }
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date_desc':
          return (b.date || '').localeCompare(a.date || '') || b.createdAt.localeCompare(a.createdAt);
        case 'date_asc':
          return (a.date || '').localeCompare(b.date || '') || a.createdAt.localeCompare(b.createdAt);
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [state.transactions, filters]);

  // Compute filtered summary stats
  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netFilteredCashFlow = totalFilteredIncome - totalFilteredExpense;

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Transaction Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing {filteredTransactions.length} of {state.transactions.length} records
          </p>
        </div>

        <button
          onClick={() => setIsAddTransactionOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filtered Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          <span>Income (Filtered): </span>
          <strong className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 text-sm ml-1">
            +{formatCurrency(totalFilteredIncome, state.currency)}
          </strong>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400">
          <span>Expense (Filtered): </span>
          <strong className="font-mono tabular-nums text-rose-600 dark:text-rose-400 text-sm ml-1">
            -{formatCurrency(totalFilteredExpense, state.currency)}
          </strong>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400">
          <span>Net Cash Flow: </span>
          <strong
            className={`font-mono tabular-nums text-sm ml-1 ${
              netFilteredCashFlow >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatCurrency(netFilteredCashFlow, state.currency)}
          </strong>
        </div>
      </div>

      {/* Filters Bar */}
      <TransactionFilters
        filters={filters}
        onFilterChange={setFilters}
        filteredTransactions={filteredTransactions}
      />

      {/* Transactions List View */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title={state.transactions.length === 0 ? 'No Transactions Yet' : 'No Matching Records'}
          description={
            state.transactions.length === 0
              ? 'Record your income or expenses using the Add Transaction button to get started.'
              : 'No transactions match your current search and filter criteria. Try adjusting your filters.'
          }
          actionLabel={state.transactions.length === 0 ? 'Add Transaction' : 'Reset Filters'}
          onAction={() => {
            if (state.transactions.length === 0) {
              setIsAddTransactionOpen(true);
            } else {
              setFilters({
                search: '',
                type: 'all',
                category: '',
                paymentMethod: '',
                dateRange: 'all',
                startDate: '',
                endDate: '',
                sortBy: 'date_desc',
              });
            }
          }}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <TransactionTable transactions={filteredTransactions} />
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {filteredTransactions.map((t) => (
              <TransactionCard key={t.id} transaction={t} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
