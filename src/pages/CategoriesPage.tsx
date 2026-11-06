import React, { useState } from 'react';
import { Plus, Tags, Trash2, X } from 'lucide-react';
import { useExpenseWise } from '../context/ExpenseContext';
import { Category, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

const PALETTE = [
  '#0EA5E9', '#10B981', '#F59E0B', '#6366F1',
  '#EC4899', '#8B5CF6', '#14B8A6', '#F43F5E',
  '#3B82F6', '#059669', '#E11D48', '#84CC16',
  '#D97706', '#64748B', '#0284C7', '#7C3AED',
];

export const CategoriesPage: React.FC = () => {
  const { state, dispatch, addToast } = useExpenseWise();
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingCat, setDeletingCat] = useState<Category | null>(null);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<TransactionType>('expense');
  const [newCatColor, setNewCatColor] = useState(PALETTE[0]);
  const [formError, setFormError] = useState('');

  const filteredCategories = state.categories.filter((cat) => {
    if (filterType === 'all') return true;
    return cat.type === filterType;
  });

  // Calculate transaction stats for each category
  const categoryStats = new Map<string, { count: number; totalAmount: number }>();
  state.transactions.forEach((t) => {
    const key = t.category.toLowerCase();
    const current = categoryStats.get(key) || { count: 0, totalAmount: 0 };
    categoryStats.set(key, {
      count: current.count + 1,
      totalAmount: current.totalAmount + t.amount,
    });
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      setFormError('Category name cannot be empty.');
      return;
    }
    if (trimmed.length < 2) {
      setFormError('Category name must be at least 2 characters.');
      return;
    }
    const exists = state.categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase() && c.type === newCatType
    );
    if (exists) {
      setFormError('A category with this name already exists.');
      return;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      type: newCatType,
      color: newCatColor,
      icon: 'Tag',
      isDefault: false,
    };

    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    addToast('Category Created', `"${trimmed}" was added to ${newCatType} categories.`);
    setIsAddModalOpen(false);
    setNewCatName('');
    setFormError('');
  };

  const handleDeleteConfirm = () => {
    if (deletingCat) {
      dispatch({ type: 'DELETE_CATEGORY', payload: deletingCat.id });
      addToast('Category Deleted', `"${deletingCat.name}" was removed.`, 'info');
      setDeletingCat(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Category Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize transactions and configure color tags
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter segment */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All ({state.categories.length})
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterType === 'income'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Income
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const stats = categoryStats.get(cat.name.toLowerCase()) || { count: 0, totalAmount: 0 };
          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: cat.color }}
                      aria-hidden="true"
                    />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        cat.type === 'income'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {cat.type}
                    </span>

                    {!cat.isDefault && (
                      <button
                        onClick={() => setDeletingCat(cat)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete custom category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{stats.count} transaction{stats.count !== 1 ? 's' : ''}</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(stats.totalAmount, state.currency)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-category-title"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Tags className="w-5 h-5" />
                </div>
                <h3 id="add-category-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                  New Category
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormError('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              {/* Type toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setNewCatType('expense')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      newCatType === 'expense'
                        ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType('income')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      newCatType === 'income'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="e.g. Subscriptions, Pet Care, Freelancing"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
                {formError && (
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{formError}</p>
                )}
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Accent Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCatColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        newCatColor === color
                          ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110'
                          : 'hover:scale-105 opacity-90'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingCat)}
        title="Delete Custom Category?"
        message={`Are you sure you want to remove the category "${deletingCat?.name}"? Existing transactions will retain their historical name.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCat(null)}
      />
    </div>
  );
};
