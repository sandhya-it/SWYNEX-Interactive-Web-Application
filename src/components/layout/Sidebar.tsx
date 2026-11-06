import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Tags,
  Settings,
  X,
  TrendingUp,
} from 'lucide-react';
import { useExpenseWise } from '../../context/ExpenseContext';
import { NavTab } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { state, dispatch, currentMonthBudgetUsage } = useExpenseWise();

  const navItems: { tab: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { tab: 'budgets', label: 'Budgets', icon: PiggyBank },
    { tab: 'analytics', label: 'Analytics', icon: BarChart3 },
    { tab: 'categories', label: 'Categories', icon: Tags },
    { tab: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: NavTab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    onCloseMobile();
  };

  const percent = Math.min(100, currentMonthBudgetUsage.percentUsed);
  let progressColor = 'bg-emerald-500';
  if (currentMonthBudgetUsage.percentUsed >= 100) {
    progressColor = 'bg-rose-500';
  } else if (currentMonthBudgetUsage.percentUsed >= 80) {
    progressColor = 'bg-amber-500';
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Expense<span className="text-emerald-600 dark:text-emerald-400">Wise</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                  Fintech Ledger
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleSelectTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer text-left whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400 stroke-[2.25]'
                        : 'text-slate-400 dark:text-slate-500 stroke-[1.75]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Quick Budget Gauge */}
        <div className="p-4 m-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-500 dark:text-slate-400">Monthly Budget</span>
            <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
              {currentMonthBudgetUsage.percentUsed}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-300`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono tabular-nums">
            <span>{formatCurrency(currentMonthBudgetUsage.spent, state.currency)}</span>
            <span>of {formatCurrency(currentMonthBudgetUsage.allocated, state.currency)}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
