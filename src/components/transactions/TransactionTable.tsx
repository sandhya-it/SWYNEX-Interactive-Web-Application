import React, { useState } from 'react';
import { Edit2, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction } from '../../types';
import { useExpenseWise } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CategoryBadge } from '../common/CategoryBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const { state, dispatch, setEditingTransaction, addToast } = useExpenseWise();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const transactionToDelete = transactions.find((t) => t.id === deletingId);

  const handleDeleteConfirm = () => {
    if (deletingId) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: deletingId });
      addToast('Transaction Deleted', 'The transaction record was removed.', 'info');
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th scope="col" className="py-3 px-4 sm:px-6">Transaction</th>
                <th scope="col" className="py-3 px-4">Category</th>
                <th scope="col" className="py-3 px-4">Date</th>
                <th scope="col" className="py-3 px-4">Method</th>
                <th scope="col" className="py-3 px-4 text-right">Amount</th>
                <th scope="col" className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {transactions.map((t) => {
                const isIncome = t.type === 'income';
                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Title and note */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
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
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-sm">
                            {t.title}
                          </p>
                          {t.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-sm">
                              {t.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge categoryName={t.category} />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 font-mono tabular-nums">
                      {formatDate(t.date)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {t.paymentMethod}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-mono tabular-nums font-bold text-sm ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(t.amount, state.currency)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => setEditingTransaction(t)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Edit ${t.title}`}
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(t.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Delete ${t.title}`}
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Transaction?"
        message={`Are you sure you want to permanently delete "${transactionToDelete?.title || 'this transaction'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
};
