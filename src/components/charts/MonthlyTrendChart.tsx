import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useExpenseWise } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const MonthlyTrendChart: React.FC = () => {
  const { state, currentMonth } = useExpenseWise();
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

  let chartData: { label: string; amount: number; fullDate?: string }[] = [];

  if (viewMode === 'daily') {
    // Current month daily expenses
    const daysInMonth = new Date(
      parseInt(currentMonth.split('-')[0]),
      parseInt(currentMonth.split('-')[1]),
      0
    ).getDate();

    const dailyMap = new Map<number, number>();
    for (let i = 1; i <= daysInMonth; i++) {
      dailyMap.set(i, 0);
    }

    state.transactions
      .filter((t) => t.type === 'expense' && t.date && t.date.startsWith(currentMonth))
      .forEach((t) => {
        const day = parseInt(t.date.split('-')[2], 10);
        if (!isNaN(day)) {
          dailyMap.set(day, (dailyMap.get(day) || 0) + t.amount);
        }
      });

    // Only show days up to current day + 3
    const today = new Date().getDate();
    const maxDay = Math.min(daysInMonth, Math.max(7, today));

    chartData = Array.from(dailyMap.entries())
      .filter(([day]) => day <= maxDay)
      .map(([day, amount]) => ({
        label: `Day ${day}`,
        amount,
        fullDate: `${currentMonth}-${String(day).padStart(2, '0')}`,
      }));
  } else {
    // Last 6 months trend
    const monthMap = new Map<string, number>();
    state.transactions
      .filter((t) => t.type === 'expense' && t.date)
      .forEach((t) => {
        const ym = t.date.substring(0, 7);
        monthMap.set(ym, (monthMap.get(ym) || 0) + t.amount);
      });

    chartData = Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([ym, amount]) => {
        const [year, month] = ym.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        const name = date.toLocaleDateString('en-US', { month: 'short' });
        return {
          label: `${name} '${year.slice(-2)}`,
          amount,
        };
      });
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-300">
            {dataPoint.fullDate ? formatDate(dataPoint.fullDate) : dataPoint.label}
          </p>
          <p className="font-mono text-emerald-400 font-bold text-sm">
            {formatCurrency(dataPoint.amount, state.currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Spending Trends
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {viewMode === 'daily' ? 'Daily spending this month' : 'Past 6 months spending progression'}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'daily'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-100 dark:stroke-slate-800"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              className="text-xs text-slate-400 font-mono"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs text-slate-400 font-mono"
              tickFormatter={(val) => {
                if (val >= 100000) return `${val / 100000}L`;
                if (val >= 1000) return `${val / 1000}k`;
                return `${val}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#spendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
