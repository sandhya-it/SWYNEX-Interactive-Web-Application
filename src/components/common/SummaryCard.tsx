import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositiveGood?: boolean;
    isIncrease?: boolean;
  };
  accentColor?: 'emerald' | 'navy' | 'rose' | 'amber' | 'sky';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  icon: Icon,
  subtitle,
  trend,
  accentColor = 'emerald',
}) => {
  const iconColorClasses = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400',
    navy: 'text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-200',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
    sky: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400',
  }[accentColor];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${iconColorClasses} shrink-0`}>
          <Icon className="w-4 h-4 stroke-[2]" />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono tabular-nums">
          {amount}
        </p>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <div className="flex items-center gap-1 font-medium ml-auto">
              {trend.isIncrease === undefined ? (
                <Minus className="w-3.5 h-3.5 text-slate-400" />
              ) : trend.isIncrease ? (
                <TrendingUp
                  className={`w-3.5 h-3.5 ${
                    trend.isPositiveGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                />
              ) : (
                <TrendingDown
                  className={`w-3.5 h-3.5 ${
                    trend.isPositiveGood ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                />
              )}
              <span
                className={`tabular-nums ${
                  trend.isIncrease === undefined
                    ? 'text-slate-500'
                    : trend.isIncrease
                    ? trend.isPositiveGood
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                    : trend.isPositiveGood
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
