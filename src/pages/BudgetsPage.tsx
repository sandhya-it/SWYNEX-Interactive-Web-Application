import React, { useState } from 'react';
import { Plus, PiggyBank, Target, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useExpenseWise, BudgetStatusItem } from '../context/ExpenseContext';
import { formatCurrency, formatMonth } from '../utils/formatters';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { OverallBudgetModal } from '../components/budgets/OverallBudgetModal';
import { EmptyState } from '../components/common/EmptyState';

export const BudgetsPage: React.FC = () => {
  const {
    state,
    currentMonth,
    currentMonthBudgetUsage,
    categoryBudgetStatuses,
  } = useExpenseWise();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingBudgetItem, setEditingBudgetItem] = useState<BudgetStatusItem | null>(null);
  const [isOverallModalOpen, setIsOverallModalOpen] = useState(false);

  const handleEdit = (item: BudgetStatusItem) => {
    setEditingBudgetItem(item);
    setIsCategoryModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingBudgetItem(null);
    setIsCategoryModalOpen(true);
  };

  // Warning and exceeded counts
  const exceededCount = categoryBudgetStatuses.filter((b) => b.status === 'exceeded').length;
  const warningCount = categoryBudgetStatuses.filter((b) => b.status === 'warning').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Monthly Budgets & Caps
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active monitoring for {formatMonth(currentMonth)}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsOverallModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Edit Overall Budget</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Category Budget</span>
          </button>
        </div>
      </div>

      {/* Overall Budget Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Target className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Overall Monthly Spending Cap
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {currentMonthBudgetUsage.percentUsed}% Utilized
                </span>
              </div>
              <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-50 mt-1">
                {formatCurrency(currentMonthBudgetUsage.spent, state.currency)}
                <span className="text-base text-slate-400 font-normal">
                  {' '}/ {formatCurrency(currentMonthBudgetUsage.allocated, state.currency)}
                </span>
              </h3>
            </div>
          </div>

          <div className="flex sm:flex-col sm:items-end justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Remaining Budget:</span>
            <span
              className={`text-base font-bold tabular-nums ${
                currentMonthBudgetUsage.remaining > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(currentMonthBudgetUsage.remaining, state.currency)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              currentMonthBudgetUsage.percentUsed >= 100
                ? 'bg-rose-500'
                : currentMonthBudgetUsage.percentUsed >= 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, currentMonthBudgetUsage.percentUsed)}%` }}
          />
        </div>

        {/* Summary Footer Badges */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                {categoryBudgetStatuses.length - exceededCount - warningCount} categories healthy
              </span>
            </span>
            {warningCount > 0 && (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>{warningCount} near limit (≥80%)</span>
              </span>
            )}
            {exceededCount > 0 && (
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>{exceededCount} exceeded cap</span>
              </span>
            )}
          </div>

          <p className="text-slate-400">
            Calculated in real-time from recorded expense transactions.
          </p>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
              Category Budgets ({categoryBudgetStatuses.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target monthly limits per spending domain
            </p>
          </div>
        </div>

        {categoryBudgetStatuses.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="No Category Budgets Set"
            description="Create monthly budgets for specific categories like Groceries, Rent, or Dining to get smart alerts."
            actionLabel="Add Category Budget"
            onAction={handleOpenAdd}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryBudgetStatuses.map((item) => (
              <BudgetCard key={item.id} item={item} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <BudgetModal
        isOpen={isCategoryModalOpen}
        initialData={editingBudgetItem}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingBudgetItem(null);
        }}
      />

      <OverallBudgetModal
        isOpen={isOverallModalOpen}
        onClose={() => setIsOverallModalOpen(false)}
      />
    </div>
  );
};
