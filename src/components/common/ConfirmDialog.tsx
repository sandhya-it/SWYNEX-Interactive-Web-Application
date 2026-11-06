import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmBtnClasses =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : 'bg-emerald-600 hover:bg-emerald-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${variant === 'danger' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 id="confirm-dialog-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer ${confirmBtnClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
