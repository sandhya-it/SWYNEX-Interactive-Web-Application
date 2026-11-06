import React, { useRef, useState } from 'react';
import {
  Coins,
  Sun,
  Moon,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useExpenseWise } from '../context/ExpenseContext';
import { CurrencyCode } from '../types';
import { CURRENCY_MAP } from '../utils/formatters';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const { state, dispatch, addToast } = useExpenseWise();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleCurrencyChange = (code: CurrencyCode) => {
    dispatch({ type: 'SET_CURRENCY', payload: code });
    addToast('Currency Updated', `Display currency switched to ${code} (${CURRENCY_MAP[code].symbol}).`);
  };

  const handleExportJSON = () => {
    const backupData = {
      version: 1,
      appName: 'ExpenseWise',
      exportDate: new Date().toISOString(),
      transactions: state.transactions,
      categories: state.categories,
      categoryBudgets: state.categoryBudgets,
      overallMonthlyBudget: state.overallMonthlyBudget,
      currency: state.currency,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expensewise_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast('Backup Exported', 'Downloaded complete financial JSON backup file.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed.transactions)) {
          throw new Error('Invalid backup file structure.');
        }

        dispatch({
          type: 'IMPORT_DATA',
          payload: {
            transactions: parsed.transactions,
            categories: parsed.categories,
            budgets: parsed.categoryBudgets,
            overallBudget: parsed.overallMonthlyBudget,
          },
        });

        if (parsed.currency && ['INR', 'USD', 'EUR', 'GBP', 'JPY'].includes(parsed.currency)) {
          dispatch({ type: 'SET_CURRENCY', payload: parsed.currency });
        }

        addToast(
          'Backup Restored',
          `Successfully loaded ${parsed.transactions.length} transactions.`
        );
      } catch (err) {
        console.error(err);
        addToast('Import Failed', 'Please provide a valid ExpenseWise JSON backup file.', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetSampleData = () => {
    dispatch({ type: 'RESET_SAMPLE_DATA' });
    addToast('Sample Data Loaded', 'Restored realistic starter transactions and budgets.');
    setIsResetConfirmOpen(false);
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
    addToast('Ledger Cleared', 'All personal transactions have been erased.', 'info');
    setIsClearConfirmOpen(false);
  };

  const currencies: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure display currency, themes, and manage local data storage
        </p>
      </div>

      {/* Currency Display Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Primary Currency
            </h3>
            <p className="text-xs text-slate-400">
              Choose the denomination used across dashboards, cards, and charts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {currencies.map((code) => {
            const isSelected = state.currency === code;
            const meta = CURRENCY_MAP[code];
            return (
              <button
                key={code}
                onClick={() => handleCurrencyChange(code)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-base font-bold">{meta.symbol}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <p className="text-xs font-semibold">{code}</p>
                <p className="text-[11px] text-slate-400 truncate">{meta.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appearance & Theme Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">
              {state.theme === 'light' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-400" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Interface Appearance
              </h3>
              <p className="text-xs text-slate-400">
                Currently displaying {state.theme === 'light' ? 'Light' : 'Dark'} theme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => {
                if (state.theme !== 'light') dispatch({ type: 'TOGGLE_THEME' });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                state.theme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => {
                if (state.theme !== 'dark') dispatch({ type: 'TOGGLE_THEME' });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                state.theme === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Backup & Data Portability
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Export or import your complete financial history safely via JSON
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Export JSON Backup</p>
                <p className="text-[11px] text-slate-400">Download complete dataset</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Export</span>
          </button>

          {/* Import JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 rounded-lg">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Import JSON Backup</p>
                  <p className="text-[11px] text-slate-400">Restore existing ledger file</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dangerous Data Actions: Reset Sample Data / Clear All */}
      <div className="bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-950/60 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
            Storage Maintenance & Reset
          </h3>
          <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-0.5">
            Actions affecting browser LocalStorage persistence
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Reset to Sample Data */}
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Realistic Sample Data</span>
          </button>

          {/* Clear All Data */}
          <button
            onClick={() => setIsClearConfirmOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Transactions</span>
          </button>
        </div>
      </div>

      {/* Project & Architecture Info Card */}
      <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>ExpenseWise – Client-Side Architecture</span>
        </div>
        <p className="leading-relaxed">
          All financial calculations, category breakdowns, budgets, and transactions are maintained in a client-side state machine using React Hooks & Reducer and persisted in your browser's LocalStorage. No confidential financial figures are transmitted to external servers.
        </p>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset to Sample Data?"
        message="This will replace current entries with realistic starter transactions and budgets across September, October, and November 2026."
        confirmLabel="Reset to Sample Data"
        variant="warning"
        onConfirm={handleResetSampleData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        title="Wipe All Transactions?"
        message="Are you sure you want to delete all transactions and budgets? This will leave your ledger completely empty."
        confirmLabel="Wipe Everything"
        variant="danger"
        onConfirm={handleClearAll}
        onCancel={() => setIsClearConfirmOpen(false)}
      />
    </div>
  );
};
