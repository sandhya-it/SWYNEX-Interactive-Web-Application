import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  CreditCard,
  Target,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useExpenseWise } from '../context/ExpenseContext';
import { formatCurrency, formatMonth } from '../utils/formatters';
import { ExpensePieChart } from '../components/charts/ExpensePieChart';
import { IncomeExpenseBarChart } from '../components/charts/IncomeExpenseBarChart';
import { MonthlyTrendChart } from '../components/charts/MonthlyTrendChart';
import { EmptyState } from '../components/common/EmptyState';

export const AnalyticsPage: React.FC = () => {
  const {
    state,
    currentMonth,
    currentMonthExpense,
    currentMonthIncome,
    currentMonthSavings,
    currentMonthSavingsRate,
    highestSpendingCategory,
    dailySpendingAverage,
    monthOverMonthExpenseChange,
    previousMonthExpense,
    categoryBudgetStatuses,
  } = useExpenseWise();

  if (state.transactions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <EmptyState
          icon={BarChart3}
          title="No Analytics Available"
          description="Record income and expense transactions to view actionable spending patterns and cash flow trends."
        />
      </div>
    );
  }

  // Payment method breakdown
  const paymentMethodMap = new Map<string, number>();
  state.transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      paymentMethodMap.set(t.paymentMethod, (paymentMethodMap.get(t.paymentMethod) || 0) + t.amount);
    });

  const totalExpenseAll = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const paymentBreakdown = Array.from(paymentMethodMap.entries())
    .map(([method, amount]) => ({
      method,
      amount,
      pct: totalExpenseAll > 0 ? Math.round((amount / totalExpenseAll) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Highest spending category share
  const highestCategoryShare =
    highestSpendingCategory && currentMonthExpense > 0
      ? Math.round((highestSpendingCategory.amount / currentMonthExpense) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Financial Intelligence & Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Grounded insights derived directly from your transaction ledger
        </p>
      </div>

      {/* Key Insights Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Highest Spending Category */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Top Outflow</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              {highestSpendingCategory ? highestSpendingCategory.category : 'None'}
            </h3>
            <p className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-1">
              {highestSpendingCategory
                ? formatCurrency(highestSpendingCategory.amount, state.currency)
                : '₹0'}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            {highestCategoryShare}% of all {formatMonth(currentMonth).split(' ')[0]} expenses
          </p>
        </div>

        {/* Month-over-Month Change */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>MoM Variance</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {monthOverMonthExpenseChange.diff <= 0 ? 'Spending Decreased' : 'Spending Increased'}
            </h3>
            <p
              className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
                monthOverMonthExpenseChange.diff <= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {monthOverMonthExpenseChange.percentage > 0 ? '+' : ''}
              {monthOverMonthExpenseChange.percentage}%
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 truncate">
            {monthOverMonthExpenseChange.diff <= 0 ? 'Saved ' : 'Spent extra '}
            {formatCurrency(Math.abs(monthOverMonthExpenseChange.diff), state.currency)} vs last month
          </p>
        </div>

        {/* Daily Spending Burn Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Daily Burn Rate</span>
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Avg Spending / Day
            </h3>
            <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
              {formatCurrency(dailySpendingAverage, state.currency)}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Based on days elapsed in {formatMonth(currentMonth).split(' ')[0]}
          </p>
        </div>

        {/* Savings Efficiency Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Savings Efficiency</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {currentMonthSavings >= 0 ? 'Net Positive Surplus' : 'Deficit Outflow'}
            </h3>
            <p className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
              {currentMonthSavingsRate}%
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            {formatCurrency(currentMonthSavings, state.currency)} net retained this month
          </p>
        </div>
      </div>

      {/* Charts Section: Pie and Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart title="Category Distribution (This Month)" />
        <IncomeExpenseBarChart title="Cash Flow Dynamics (Historical)" />
      </div>

      {/* Spending Trends */}
      <MonthlyTrendChart />

      {/* Payment Methods and Channel Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Payment Channel Distribution
              </h3>
              <p className="text-xs text-slate-400">Total lifetime expenditure split by payment instrument</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentBreakdown.map((item) => (
            <div
              key={item.method}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.method}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {item.pct}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {formatCurrency(item.amount, state.currency)} spent
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
