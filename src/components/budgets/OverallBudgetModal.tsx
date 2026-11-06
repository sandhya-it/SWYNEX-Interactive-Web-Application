import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Target } from 'lucide-react';
import { overallBudgetSchema, OverallBudgetFormData } from '../../schemas/transactionSchema';
import { useExpenseWise } from '../../context/ExpenseContext';

interface OverallBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OverallBudgetModal: React.FC<OverallBudgetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, dispatch, addToast } = useExpenseWise();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OverallBudgetFormData>({
    resolver: zodResolver(overallBudgetSchema) as any,
    defaultValues: {
      amount: state.overallMonthlyBudget,
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: OverallBudgetFormData) => {
    dispatch({ type: 'SET_OVERALL_BUDGET', payload: data.amount });
    addToast('Monthly Budget Updated', `New target set to ${state.currency} ${data.amount}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="overall-budget-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 id="overall-budget-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                Overall Budget
              </h2>
              <p className="text-xs text-slate-400">Total monthly spending ceiling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Monthly Budget ({state.currency}) *
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 95000"
              {...register('amount', { valueAsNumber: true })}
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 ${
                errors.amount ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.amount.message}</p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
