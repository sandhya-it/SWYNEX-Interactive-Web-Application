import React, { useState } from 'react';
import { Edit2, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction } from '../../types';
import { useExpenseWise } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CategoryBadge } from '../common/CategoryBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const { state, dispatch, setEditingTransaction, addToast } = useExpenseWise();
  const [isDeleting, setIsDeleting] = useState(false);

  const isIncome = transaction.type === 'income';

  const handleDeleteConfirm = () => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id });
    addToast('Transaction Deleted', 'The transaction record was removed.', 'info');
    setIsDeleting(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                isIncome
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isIncome ? (
                <ArrowDownLeft className="w-4 h-4 stroke-[2.25]" />
              ) : (
                <ArrowUpRight className="w-4 h-4 stroke-[2.25]" />
              )}
            </div>

            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                {transaction.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <CategoryBadge categoryName={transaction.category} />
                <span aria-hidden="true">·</span>
                <span>{transaction.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p
              className={`text-sm font-bold font-mono tabular-nums ${
                isIncome
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(transaction.amount, state.currency)}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 tabular-nums">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>

        {transaction.description && (
          <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
            {transaction.description}
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 text-xs">
          <button
            onClick={() => setEditingTransaction(transaction)}
            className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setIsDeleting(true)}
            className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleting}
        title="Delete Transaction?"
        message={`Are you sure you want to permanently delete "${transaction.title}"?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleting(false)}
      />
    </>
  );
};
