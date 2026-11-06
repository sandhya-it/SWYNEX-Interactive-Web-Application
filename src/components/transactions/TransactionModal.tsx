import React, { useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { useExpenseWise } from '../../context/ExpenseContext';

export const TransactionModal: React.FC = () => {
  const {
    isAddTransactionOpen,
    setIsAddTransactionOpen,
    editingTransaction,
    setEditingTransaction,
  } = useExpenseWise();

  const isOpen = isAddTransactionOpen || Boolean(editingTransaction);

  const handleClose = () => {
    setIsAddTransactionOpen(false);
    setEditingTransaction(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(editingTransaction);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              {isEditing ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2
                id="transaction-modal-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                {isEditing ? 'Edit Transaction' : 'Record New Transaction'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing
                  ? 'Update transaction parameters and category'
                  : 'Enter the details of your income or expense'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Close transaction modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <TransactionForm
            initialData={editingTransaction}
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        </div>
      </div>
    </div>
  );
};
