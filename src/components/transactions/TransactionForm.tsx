import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, TransactionFormData } from '../../schemas/transactionSchema';
import { useExpenseWise } from '../../context/ExpenseContext';
import { Transaction } from '../../types';

interface TransactionFormProps {
  initialData?: Transaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const { state, dispatch, addToast } = useExpenseWise();

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      amount: initialData?.amount || ('' as unknown as number),
      type: initialData?.type || 'expense',
      category: initialData?.category || '',
      date: initialData?.date || todayStr,
      paymentMethod: initialData?.paymentMethod || 'UPI',
      description: initialData?.description || '',
    },
  });

  const selectedType = watch('type');
  const descriptionValue = watch('description') || '';

  // Filter categories matching the selected type
  const availableCategories = state.categories.filter(
    (c) => c.type === selectedType
  );

  const onSubmit = async (data: TransactionFormData) => {
    // Artificial small delay for UX realism & double submission prevention
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (initialData) {
      const updatedTx: Transaction = {
        ...initialData,
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        paymentMethod: data.paymentMethod,
        description: data.description || undefined,
      };
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTx });
      addToast('Transaction Updated', `"${data.title}" was successfully updated.`);
    } else {
      const newTx: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        paymentMethod: data.paymentMethod,
        description: data.description || undefined,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_TRANSACTION', payload: newTx });
      addToast('Transaction Recorded', `Added ₹${data.amount} for "${data.title}".`);
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Type Selector (Income vs Expense) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Transaction Type
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setValue('type', 'expense');
              setValue('category', ''); // reset category to match type
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedType === 'expense'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setValue('type', 'income');
              setValue('category', ''); // reset category to match type
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedType === 'income'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Income
          </button>
        </div>
        {errors.type && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.type.message}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="tx-title"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
        >
          Title *
        </label>
        <input
          id="tx-title"
          type="text"
          placeholder="e.g. Grocery shopping, Client retainer"
          {...register('title')}
          className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 transition-all ${
            errors.title ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.title.message}</p>
        )}
      </div>

      {/* Amount and Date (Two columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="tx-amount"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
          >
            Amount ({state.currency}) *
          </label>
          <div className="relative">
            <input
              id="tx-amount"
              type="number"
              step="any"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                errors.amount ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="tx-date"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
          >
            Date *
          </label>
          <input
            id="tx-date"
            type="date"
            {...register('date')}
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 transition-all ${
              errors.date ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.date.message}</p>
          )}
        </div>
      </div>

      {/* Category and Payment Method (Two columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="tx-category"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
          >
            Category *
          </label>
          <select
            id="tx-category"
            {...register('category')}
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 transition-all ${
              errors.category ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
            }`}
          >
            <option value="">Select Category</option>
            {availableCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
            {/* Fallback to show all categories if type doesn't match */}
            {availableCategories.length === 0 &&
              state.categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({cat.type})
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="tx-paymentMethod"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
          >
            Payment Method *
          </label>
          <select
            id="tx-paymentMethod"
            {...register('paymentMethod')}
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 transition-all ${
              errors.paymentMethod ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
            }`}
          >
            <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash">Cash</option>
            <option value="Other">Other</option>
          </select>
          {errors.paymentMethod && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.paymentMethod.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="tx-description"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            Description / Note (Optional)
          </label>
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            {descriptionValue.length}/250
          </span>
        </div>
        <textarea
          id="tx-description"
          rows={2}
          maxLength={250}
          placeholder="Add additional remarks or notes..."
          {...register('description')}
          className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none ${
            errors.description ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.description.message}</p>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs cursor-pointer"
        >
          {isSubmitting
            ? 'Saving...'
            : initialData
            ? 'Update Transaction'
            : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
};
