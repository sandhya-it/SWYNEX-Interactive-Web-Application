import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
      <div className="p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
        <Icon className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  }[size];

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizeClasses} border-emerald-600 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};
