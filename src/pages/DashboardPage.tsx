import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Target,
  Plus,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useExpenseWise } from '../context/ExpenseContext';
import { formatCurrency, formatMonth } from '../utils/formatters';
import { SummaryCard } from '../components/common/SummaryCard';
import { ExpensePieChart } from '../components/charts/ExpensePieChart';
import { IncomeExpenseBarChart } from '../components/charts/IncomeExpenseBarChart';
import { MonthlyTrendChart } from '../components/charts/MonthlyTrendChart';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { OverallBudgetModal } from '../components/budgets/OverallBudgetModal';
import { EmptyState } from '../components/common/EmptyState';

export const DashboardPage: React.FC = () => {
  const {
    state,
    dispatch,
    currentMonth,
    totalBalance,
    currentMonthIncome,
    currentMonthExpense,
    currentMonthSavings,
    currentMonthSavingsRate,
    currentMonthBudgetUsage,
    monthOverMonthExpenseChange,
    categoryBudgetStatuses,
    setIsAddTransactionOpen,
  } = useExpenseWise();

  const [isOverallBudgetOpen, setIsOverallBudgetOpen] = useState(false);

  // Recent transactions (last 5)
  const recentTransactions = state.transactions.slice(0, 5);

  // Check for budget warnings
  const budgetWarnings = categoryBudgetStatuses.filter(
    (b) => b.status === 'warning' || b.status === 'exceeded'
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Budget Safety Alert Banner (if any category is near limit or exceeded) */}
      {budgetWarnings.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
              <AlertTriangle className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Budget Safety Alert ({budgetWarnings.length} categories)
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                {budgetWarnings
                  .map((b) => `${b.category} (${b.percentUsed}%)`)
                  .join(', ')}{' '}
                {budgetWarnings.some((b) => b.status === 'exceeded')
                  ? 'have exceeded target limits.'
                  : 'have crossed 80% of your allocated budget.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'budgets' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-100 bg-amber-200/60 dark:bg-amber-800/40 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <span>Review Budgets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <SummaryCard
          title="Total Balance"
          amount={formatCurrency(totalBalance, state.currency)}
          icon={Wallet}
          accentColor="emerald"
          subtitle="Net cash in hand & accounts"
        />

        {/* Current Month Income */}
        <SummaryCard
          title="Monthly Income"
          amount={formatCurrency(currentMonthIncome, state.currency)}
          icon={ArrowDownLeft}
          accentColor="emerald"
          subtitle={`Recorded for ${formatMonth(currentMonth).split(' ')[0]}`}
          trend={{
            value: `₹${currentMonthIncome.toLocaleString()}`,
            isIncrease: true,
            isPositiveGood: true,
          }}
        />

        {/* Current Month Expenses */}
        <SummaryCard
          title="Monthly Expenses"
          amount={formatCurrency(currentMonthExpense, state.currency)}
          icon={ArrowUpRight}
          accentColor="rose"
          subtitle={`vs last month`}
          trend={{
            value: `${monthOverMonthExpenseChange.percentage >= 0 ? '+' : ''}${monthOverMonthExpenseChange.percentage}% MoM`,
            isIncrease: monthOverMonthExpenseChange.percentage > 0,
            isPositiveGood: false,
          }}
        />

        {/* Monthly Savings */}
        <SummaryCard
          title="Monthly Savings"
          amount={formatCurrency(currentMonthSavings, state.currency)}
          icon={PiggyBank}
          accentColor={currentMonthSavings >= 0 ? 'emerald' : 'rose'}
          subtitle={`${currentMonthSavingsRate}% savings rate`}
          trend={{
            value: `${currentMonthSavingsRate}% rate`,
            isIncrease: currentMonthSavings >= 0,
            isPositiveGood: true,
          }}
        />
      </div>

      {/* Overall Budget Progress Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Overall Budget Usage
                </h3>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {currentMonthBudgetUsage.percentUsed}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatMonth(currentMonth)} target spending limit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsOverallBudgetOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Adjust Limit
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'budgets' })}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-colors cursor-pointer"
            >
              Category Budgets
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              currentMonthBudgetUsage.percentUsed >= 100
                ? 'bg-rose-500'
                : currentMonthBudgetUsage.percentUsed >= 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, currentMonthBudgetUsage.percentUsed)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2.5 font-mono tabular-nums">
          <span>
            Spent: <strong>{formatCurrency(currentMonthBudgetUsage.spent, state.currency)}</strong>
          </span>
          <span>
            Limit: <strong>{formatCurrency(currentMonthBudgetUsage.allocated, state.currency)}</strong>
          </span>
          <span className={currentMonthBudgetUsage.remaining === 0 ? 'text-rose-500 font-bold' : ''}>
            Remaining: <strong>{formatCurrency(currentMonthBudgetUsage.remaining, state.currency)}</strong>
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid: Pie Chart + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart title="Spending by Category (This Month)" />
        <IncomeExpenseBarChart title="Income vs Expenses (Recent Months)" />
      </div>

      {/* Spending Trends Line/Area Chart */}
      <MonthlyTrendChart />

      {/* Recent Transactions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest financial movements recorded</p>
          </div>

          <button
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'transactions' })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <span>View All ({state.transactions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No Transactions Recorded"
            description="Start by adding your first income or expense transaction to see live insights."
            actionLabel="Add First Transaction"
            onAction={() => setIsAddTransactionOpen(true)}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <TransactionTable transactions={recentTransactions} />
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {recentTransactions.map((t) => (
                <TransactionCard key={t.id} transaction={t} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Overall Budget Modal */}
      <OverallBudgetModal
        isOpen={isOverallBudgetOpen}
        onClose={() => setIsOverallBudgetOpen(false)}
      />
    </div>
  );
};
