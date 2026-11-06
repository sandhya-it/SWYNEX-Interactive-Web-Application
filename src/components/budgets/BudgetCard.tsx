import React, { useState } from 'react';
import { Edit2, Trash2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BudgetStatusItem } from '../../context/ExpenseContext';
import { useExpenseWise } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';
import { CategoryBadge } from '../common/CategoryBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface BudgetCardProps {
  item: BudgetStatusItem;
  onEdit: (item: BudgetStatusItem) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ item, onEdit }) => {
  const { state, dispatch, addToast } = useExpenseWise();
  const [isDeleting, setIsDeleting] = useState(false);

  const percent = Math.min(100, item.percentUsed);

  let barColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50';
  let statusText = 'On Track';
  let StatusIcon = CheckCircle2;

  if (item.status === 'exceeded') {
    barColor = 'bg-rose-500';
    badgeColor = 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/50';
    statusText = `Exceeded (${item.percentUsed}%)`;
    StatusIcon = AlertCircle;
  } else if (item.status === 'warning') {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
    statusText = `Near Limit (${item.percentUsed}%)`;
    StatusIcon = AlertTriangle;
  }

  const handleDeleteConfirm = () => {
    dispatch({ type: 'DELETE_CATEGORY_BUDGET', payload: item.id });
    addToast('Budget Removed', `Budget allocation for ${item.category} was removed.`, 'info');
    setIsDeleting(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <CategoryBadge categoryName={item.category} className="text-sm font-semibold" />
            <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor}`}>
              <StatusIcon className="w-3 h-3 shrink-0" />
              <span>{statusText}</span>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Spent:</span>
              <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white text-base">
                {formatCurrency(item.spent, state.currency)}
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full ${barColor} transition-all duration-300 rounded-full`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono tabular-nums">
              <span>Limit: {formatCurrency(item.allocatedAmount, state.currency)}</span>
              <span className={item.remaining === 0 ? 'text-rose-500 font-semibold' : ''}>
                {item.remaining > 0
                  ? `${formatCurrency(item.remaining, state.currency)} left`
                  : 'No funds left'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label={`Edit ${item.category} budget`}
            title="Edit Budget"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsDeleting(true)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label={`Delete ${item.category} budget`}
            title="Delete Budget"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleting}
        title="Remove Budget?"
        message={`Are you sure you want to remove the budget allocation for "${item.category}"?`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleting(false)}
      />
    </>
  );
};
