import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import {
  Category,
  CategoryBudget,
  CurrencyCode,
  NavTab,
  ThemeMode,
  ToastMessage,
  Transaction,
} from '../types';
import { getCurrentYearMonth } from '../utils/formatters';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_OVERALL_MONTHLY_BUDGET,
  INITIAL_CATEGORY_BUDGETS,
  INITIAL_TRANSACTIONS,
} from '../utils/sampleData';

const STORAGE_KEYS = {
  TRANSACTIONS: 'expensewise_transactions_v1',
  CATEGORIES: 'expensewise_categories_v1',
  BUDGETS: 'expensewise_budgets_v1',
  OVERALL_BUDGET: 'expensewise_overall_budget_v1',
  CURRENCY: 'expensewise_currency_v1',
  THEME: 'expensewise_theme_v1',
};

interface State {
  transactions: Transaction[];
  categories: Category[];
  categoryBudgets: CategoryBudget[];
  overallMonthlyBudget: number;
  currency: CurrencyCode;
  theme: ThemeMode;
  activeTab: NavTab;
  toasts: ToastMessage[];
}

type Action =
  | { type: 'SET_ACTIVE_TAB'; payload: NavTab }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_CATEGORY_BUDGET'; payload: { category: string; amount: number; month: string } }
  | { type: 'DELETE_CATEGORY_BUDGET'; payload: string }
  | { type: 'SET_OVERALL_BUDGET'; payload: number }
  | { type: 'SET_CURRENCY'; payload: CurrencyCode }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'RESET_SAMPLE_DATA' }
  | { type: 'CLEAR_ALL_DATA' }
  | { type: 'IMPORT_DATA'; payload: { transactions: Transaction[]; categories?: Category[]; budgets?: CategoryBudget[]; overallBudget?: number } };

function loadInitialState(): State {
  let transactions = INITIAL_TRANSACTIONS;
  let categories = DEFAULT_CATEGORIES;
  let categoryBudgets = INITIAL_CATEGORY_BUDGETS;
  let overallMonthlyBudget = DEFAULT_OVERALL_MONTHLY_BUDGET;
  let currency: CurrencyCode = 'INR';
  let theme: ThemeMode = 'light';

  try {
    const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (savedTx) {
      const parsed = JSON.parse(savedTx);
      if (Array.isArray(parsed)) transactions = parsed;
    }

    const savedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (savedCats) {
      const parsed = JSON.parse(savedCats);
      if (Array.isArray(parsed)) categories = parsed;
    }

    const savedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (savedBudgets) {
      const parsed = JSON.parse(savedBudgets);
      if (Array.isArray(parsed)) categoryBudgets = parsed;
    }

    const savedOverall = localStorage.getItem(STORAGE_KEYS.OVERALL_BUDGET);
    if (savedOverall) {
      const parsed = Number(savedOverall);
      if (!isNaN(parsed) && parsed > 0) overallMonthlyBudget = parsed;
    }

    const savedCurr = localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode;
    if (savedCurr && ['INR', 'USD', 'EUR', 'GBP', 'JPY'].includes(savedCurr)) {
      currency = savedCurr;
    }

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
  } catch (err) {
    console.error('Failed to parse state from localStorage', err);
  }

  return {
    transactions,
    categories,
    categoryBudgets,
    overallMonthlyBudget,
    currency,
    theme,
    activeTab: 'dashboard',
    toasts: [],
  };
}

function expenseReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'ADD_TRANSACTION': {
      const updated = [action.payload, ...state.transactions];
      try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { ...state, transactions: updated };
    }

    case 'UPDATE_TRANSACTION': {
      const updated = state.transactions.map((tx) =>
        tx.id === action.payload.id ? action.payload : tx
      );
      try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { ...state, transactions: updated };
    }

    case 'DELETE_TRANSACTION': {
      const updated = state.transactions.filter((tx) => tx.id !== action.payload);
      try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { ...state, transactions: updated };
    }

    case 'ADD_CATEGORY': {
      const updated = [...state.categories, action.payload];
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { ...state, categories: updated };
    }

    case 'DELETE_CATEGORY': {
      const updated = state.categories.filter((cat) => cat.id !== action.payload);
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { ...state, categories: updated };
    }

    case 'SET_CATEGORY_BUDGET': {
      const { category, amount, month } = action.payload;
      const existingIndex = state.categoryBudgets.findIndex(
        (b) => b.category.toLowerCase() === category.toLowerCase() && b.month === month
      );
      let updated: CategoryBudget[];
      if (existingIndex >= 0) {
        updated = [...state.categoryBudgets];
        updated[existingIndex] = {
          ...updated[existingIndex],
          allocatedAmount: amount,
        };
      } else {
        const newBudget: CategoryBudget = {
          id: `bgt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          category,
          allocatedAmount: amount,
          month,
        };
        updated = [...state.categoryBudgets, newBudget];
      }
      try {
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { ...state, categoryBudgets: updated };
    }

    case 'DELETE_CATEGORY_BUDGET': {
      const updated = state.categoryBudgets.filter((b) => b.id !== action.payload);
      try {
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { ...state, categoryBudgets: updated };
    }

    case 'SET_OVERALL_BUDGET': {
      try {
        localStorage.setItem(STORAGE_KEYS.OVERALL_BUDGET, String(action.payload));
      } catch (e) {
        console.error(e);
      }
      return { ...state, overallMonthlyBudget: action.payload };
    }

    case 'SET_CURRENCY': {
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENCY, action.payload);
      } catch (e) {
        console.error(e);
      }
      return { ...state, currency: action.payload };
    }

    case 'TOGGLE_THEME': {
      const nextTheme: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
      } catch (e) {
        console.error(e);
      }
      return { ...state, theme: nextTheme };
    }

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    case 'RESET_SAMPLE_DATA': {
      try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_CATEGORY_BUDGETS));
        localStorage.setItem(STORAGE_KEYS.OVERALL_BUDGET, String(DEFAULT_OVERALL_MONTHLY_BUDGET));
      } catch (e) {
        console.error(e);
      }
      return {
        ...state,
        transactions: INITIAL_TRANSACTIONS,
        categories: DEFAULT_CATEGORIES,
        categoryBudgets: INITIAL_CATEGORY_BUDGETS,
        overallMonthlyBudget: DEFAULT_OVERALL_MONTHLY_BUDGET,
      };
    }

    case 'CLEAR_ALL_DATA': {
      try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify([]));
      } catch (e) {
        console.error(e);
      }
      return {
        ...state,
        transactions: [],
        categoryBudgets: [],
      };
    }

    case 'IMPORT_DATA': {
      const { transactions, categories, budgets, overallBudget } = action.payload;
      const newTx = transactions || state.transactions;
      const newCats = categories || state.categories;
      const newBudgets = budgets || state.categoryBudgets;
      const newOverall = overallBudget || state.overallMonthlyBudget;

      try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTx));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCats));
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(newBudgets));
        localStorage.setItem(STORAGE_KEYS.OVERALL_BUDGET, String(newOverall));
      } catch (e) {
        console.error(e);
      }

      return {
        ...state,
        transactions: newTx,
        categories: newCats,
        categoryBudgets: newBudgets,
        overallMonthlyBudget: newOverall,
      };
    }

    default:
      return state;
  }
}

export interface BudgetStatusItem {
  id: string;
  category: string;
  allocatedAmount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  status: 'nominal' | 'warning' | 'exceeded';
}

interface ExpenseContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  // Derived calculations for current and past months
  currentMonth: string;
  totalBalance: number;
  totalIncomeAllTime: number;
  totalExpenseAllTime: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
  currentMonthSavings: number;
  currentMonthSavingsRate: number;
  currentMonthBudgetUsage: {
    spent: number;
    allocated: number;
    remaining: number;
    percentUsed: number;
  };
  previousMonthExpense: number;
  monthOverMonthExpenseChange: {
    diff: number;
    percentage: number;
  };
  categoryBreakdown: { category: string; amount: number; percentage: number; color: string }[];
  categoryBudgetStatuses: BudgetStatusItem[];
  highestSpendingCategory: { category: string; amount: number } | null;
  dailySpendingAverage: number;
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  // Modal states for global quick actions
  isAddTransactionOpen: boolean;
  setIsAddTransactionOpen: (open: boolean) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (tx: Transaction | null) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, undefined, loadInitialState);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Sync theme to document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    dispatch({ type: 'ADD_TOAST', payload: { id, title, message, type } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, 3500);
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  // Derived financial metrics
  const currentMonth = getCurrentYearMonth(); // e.g. "2026-11"
  
  // Previous month string
  const [yearStr, monthStr] = currentMonth.split('-');
  const currYear = parseInt(yearStr, 10);
  const currMonthNum = parseInt(monthStr, 10);
  const prevMonthNum = currMonthNum === 1 ? 12 : currMonthNum - 1;
  const prevYear = currMonthNum === 1 ? currYear - 1 : currYear;
  const previousMonth = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}`;

  // All-time totals
  const totalIncomeAllTime = state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenseAllTime = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncomeAllTime - totalExpenseAllTime;

  // Current month totals
  const currentMonthTransactions = state.transactions.filter(
    (t) => t.date && t.date.startsWith(currentMonth)
  );

  const currentMonthIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthSavings = currentMonthIncome - currentMonthExpense;
  const currentMonthSavingsRate = currentMonthIncome > 0
    ? Math.max(0, Math.round((currentMonthSavings / currentMonthIncome) * 100))
    : 0;

  // Overall budget usage for current month
  const overallAllocated = state.overallMonthlyBudget || 1;
  const overallSpent = currentMonthExpense;
  const overallRemaining = Math.max(0, overallAllocated - overallSpent);
  const overallPercentUsed = Math.round((overallSpent / overallAllocated) * 100);

  const currentMonthBudgetUsage = {
    spent: overallSpent,
    allocated: overallAllocated,
    remaining: overallRemaining,
    percentUsed: overallPercentUsed,
  };

  // Previous month totals for Month-over-Month calculation
  const previousMonthExpense = state.transactions
    .filter((t) => t.type === 'expense' && t.date && t.date.startsWith(previousMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const momDiff = currentMonthExpense - previousMonthExpense;
  const momPercentage = previousMonthExpense > 0
    ? Math.round((momDiff / previousMonthExpense) * 100)
    : 0;

  const monthOverMonthExpenseChange = {
    diff: momDiff,
    percentage: momPercentage,
  };

  // Spending by category for current month
  const categoryMap = new Map<string, number>();
  currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

  const categoryColorMap = new Map<string, string>();
  state.categories.forEach((c) => {
    categoryColorMap.set(c.name, c.color);
  });

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: currentMonthExpense > 0 ? Math.round((amount / currentMonthExpense) * 100) : 0,
      color: categoryColorMap.get(category) || '#10B981',
    }))
    .sort((a, b) => b.amount - a.amount);

  const highestSpendingCategory = categoryBreakdown.length > 0
    ? { category: categoryBreakdown[0].category, amount: categoryBreakdown[0].amount }
    : null;

  // Daily spending average for current month
  const now = new Date();
  const currentDay = Math.max(1, now.getDate());
  const dailySpendingAverage = Math.round(currentMonthExpense / currentDay);

  // Category Budgets statuses
  const categoryBudgetStatuses: BudgetStatusItem[] = state.categoryBudgets
    .filter((b) => b.month === currentMonth || !b.month)
    .map((b) => {
      const spent = categoryMap.get(b.category) || 0;
      const remaining = Math.max(0, b.allocatedAmount - spent);
      const percentUsed = b.allocatedAmount > 0 ? Math.round((spent / b.allocatedAmount) * 100) : 0;
      let status: 'nominal' | 'warning' | 'exceeded' = 'nominal';
      if (percentUsed >= 100) {
        status = 'exceeded';
      } else if (percentUsed >= 80) {
        status = 'warning';
      }
      return {
        id: b.id,
        category: b.category,
        allocatedAmount: b.allocatedAmount,
        spent,
        remaining,
        percentUsed,
        status,
      };
    })
    .sort((a, b) => b.percentUsed - a.percentUsed);

  return (
    <ExpenseContext.Provider
      value={{
        state,
        dispatch,
        currentMonth,
        totalBalance,
        totalIncomeAllTime,
        totalExpenseAllTime,
        currentMonthIncome,
        currentMonthExpense,
        currentMonthSavings,
        currentMonthSavingsRate,
        currentMonthBudgetUsage,
        previousMonthExpense,
        monthOverMonthExpenseChange,
        categoryBreakdown,
        categoryBudgetStatuses,
        highestSpendingCategory,
        dailySpendingAverage,
        addToast,
        removeToast,
        isAddTransactionOpen,
        setIsAddTransactionOpen,
        editingTransaction,
        setEditingTransaction,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenseWise() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseWise must be used within an ExpenseProvider');
  }
  return context;
}
