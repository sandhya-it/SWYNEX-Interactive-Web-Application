import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useExpenseWise } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';
import { PieChart as PieChartIcon } from 'lucide-react';

interface ExpensePieChartProps {
  data?: { category: string; amount: number; percentage: number; color: string }[];
  title?: string;
}

export const ExpensePieChart: React.FC<ExpensePieChartProps> = ({
  data: customData,
  title = 'Spending by Category',
}) => {
  const { categoryBreakdown, currentMonthExpense, state } = useExpenseWise();
  const data = customData || categoryBreakdown;

  if (!data || data.length === 0 || currentMonthExpense === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center min-h-[340px]">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 mb-3">
          <PieChartIcon className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Expense Data</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs text-center">
          Record your first expense transaction to view category distribution.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-semibold">{item.category}</span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono">
            <span className="text-slate-300">{formatCurrency(item.amount, state.currency)}</span>
            <span className="font-bold text-emerald-400">{item.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
          {title}
        </h3>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Total: {formatCurrency(currentMonthExpense, state.currency)}
        </span>
      </div>

      <div className="w-full h-56 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="amount"
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown legend list */}
      <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {data.slice(0, 5).map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                {item.category}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums">
              <span className="text-slate-900 dark:text-slate-100 font-semibold">
                {formatCurrency(item.amount, state.currency)}
              </span>
              <span className="text-slate-400 w-9 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
