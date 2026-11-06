import React from 'react';
import {
  Sun,
  Moon,
  Plus,
  Menu,
  Wallet,
} from 'lucide-react';
import { useExpenseWise } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileSidebar }) => {
  const { state, dispatch, totalBalance, setIsAddTransactionOpen } = useExpenseWise();

  const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Financial Overview', subtitle: 'Real-time income, expenses & budget summary' },
    transactions: { title: 'Transactions Ledger', subtitle: 'Record, search, and manage cash flows' },
    budgets: { title: 'Budget Management', subtitle: 'Target allocations and spending safety thresholds' },
    analytics: { title: 'Insights & Analytics', subtitle: 'Trends, category breakdowns, and performance' },
    categories: { title: 'Categories', subtitle: 'Custom organization for expenses and income' },
    settings: { title: 'Preferences & Storage', subtitle: 'Currency, themes, backups, and data control' },
  };

  const currentInfo = PAGE_TITLES[state.activeTab] || PAGE_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>ExpenseWise</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold capitalize">
              {state.activeTab}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
            {currentInfo.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Quick balance badge for tablets & desktop */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300">
          <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Balance:</span>
          <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
            {formatCurrency(totalBalance, state.currency)}
          </span>
        </div>

        {/* Currency Quick Indicator */}
        <button
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'settings' })}
          className="px-2.5 py-1.5 text-xs font-mono font-medium rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Change currency in Settings"
        >
          {state.currency}
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          aria-label={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {state.theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Primary CTA: Add Transaction */}
        <button
          onClick={() => setIsAddTransactionOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};
