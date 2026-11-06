import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useExpenseWise } from '../../context/ExpenseContext';
import { formatCurrency, formatMonth } from '../../utils/formatters';

export const IncomeExpenseBarChart: React.FC<{ title?: string }> = ({
  title = 'Income vs Expenses',
}) => {
  const { state } = useExpenseWise();

  // Aggregate by month (YYYY-MM)
  const monthlyDataMap = new Map<string, { month: string; income: number; expense: number }>();

  state.transactions.forEach((tx) => {
    if (!tx.date) return;
    const ym = tx.date.substring(0, 7);
    if (!monthlyDataMap.has(ym)) {
      monthlyDataMap.set(ym, { month: ym, income: 0, expense: 0 });
    }
    const item = monthlyDataMap.get(ym)!;
    if (tx.type === 'income') {
      item.income += tx.amount;
    } else {
      item.expense += tx.amount;
    }
  });

  // Sort chronologically and take last 6 months
  const chartData = Array.from(monthlyDataMap.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map((item) => ({
      ...item,
      label: formatMonth(item.month).split(' ')[0], // Month name only e.g. "Nov"
      fullName: formatMonth(item.month),
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center min-h-[340px]">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Monthly Comparison</p>
        <p className="text-xs text-slate-400 mt-1">
          Add transactions across different months to compare cash flow.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fullMonthName = payload[0].payload.fullName;
      return (
        <div className="bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-xs space-y-1.5">
          <p className="font-semibold text-slate-200">{fullMonthName}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-mono">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="capitalize text-slate-300">{entry.name}:</span>
              </span>
              <span className="font-bold">
                {formatCurrency(entry.value, state.currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            {title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Monthly cash flow comparison</p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#F43F5E"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
