import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useExpenseWise } from '../../context/ExpenseContext';

export const ToastNotification: React.FC = () => {
  const { state, removeToast } = useExpenseWise();

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {state.toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
        let borderClass = 'border-emerald-500/30';
        
        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          borderClass = 'border-rose-500/30';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-500/30';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-sky-500 shrink-0" />;
          borderClass = 'border-sky-500/30';
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900 border ${borderClass} rounded-xl shadow-lg transition-all animate-in slide-in-from-bottom-2 duration-200`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
