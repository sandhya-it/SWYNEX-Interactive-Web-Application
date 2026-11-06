# ExpenseWise – Smart Personal Expense Tracker

ExpenseWise is a modern, responsive personal expense tracker designed for college project demonstrations, developer portfolios, and daily financial management. It allows users to record and categorize income and expenses, monitor category budgets, receive proactive budget warnings, analyze cash flow dynamics, and visualize spending habits through interactive financial charts.

---

## 🌟 Key Features

### 1. Interactive Financial Dashboard
- **Real-Time Financial Metrics**: Total Balance, Monthly Income, Monthly Expenses, Net Monthly Savings, and Savings Rate.
- **Budget Safety Warnings**: Real-time alert banner warning when category expenses reach $\ge 80\%$ or exceed ($>100\%$) allocated limits.
- **Spending by Category**: Interactive donut chart visualizing spending breakdown with percentage shares.
- **Cash Flow Comparison**: Grouped bar chart comparing income vs. expenses across historical months.
- **Spending Trajectory**: Area chart tracking daily and monthly spending trends.
- **Recent Transactions Ledger**: Quick glance at the latest financial movements with instant edit/delete affordances.

### 2. Full Transaction CRUD & Ledger
- **Add & Edit Transactions**: Modal form built with React Hook Form and Zod validation.
- **Transaction Fields**: Title, Amount, Type (Income / Expense), Category, Date, Payment Method (UPI, Credit Card, Debit Card, Net Banking, Cash, Other), and optional notes.
- **Advanced Filtering & Search**:
  - Live search across titles, descriptions, and categories.
  - Filter by Type (All / Income / Expense).
  - Filter by Category and Payment Method.
  - Filter by Date Range: This Month, Last Month, Last 90 Days, Custom Calendar Range.
  - Multi-criteria Sorting: Date (Newest/Oldest), Amount (Highest/Lowest), Title (A-Z/Z-A).
- **Responsive Layout**: High-density desktop table and mobile-optimized swipeable card layout.
- **CSV Export**: One-click transaction export to CSV format for Excel/Google Sheets.

### 3. Category & Overall Budget Management
- **Overall Monthly Spending Cap**: Visual progress gauge with current spent, ceiling, and remaining balance.
- **Category-Specific Budgets**: Target caps per category (e.g. Housing, Groceries, Dining, Transport).
- **Dynamic Threshold Statuses**:
  - `On Track` (< 80%)
  - `Near Limit` (80% – 99%)
  - `Exceeded` ($\ge$ 100%)
- Direct CRUD management for adding, modifying, or removing budgets.

### 4. Grounded Analytics & Financial Insights
- **Top Outflow**: Automatically identifies the highest spending category and its percentage of monthly expenditures.
- **Month-over-Month (MoM) Variance**: Real percentage and absolute currency change compared to previous month.
- **Daily Burn Rate**: Average daily outflow calculated from elapsed days.
- **Payment Channel Distribution**: Spending split across UPI, credit cards, debit cards, and banking.

### 5. Category Management & Settings
- **Category Directory**: Predefined defaults + user ability to create custom categories with tailored colors.
- **Multi-Currency Support**: Indian Rupee (`₹ INR` default), US Dollar (`$ USD`), Euro (`€ EUR`), British Pound (`£ GBP`), and Japanese Yen (`¥ JPY`).
- **Dual Theme**: Light and Dark mode with persistent theme preference.
- **Backup & Restore**: Export complete ledger as JSON and import backups.
- **Sample Data**: Realistic preloaded transactions across multiple months with instant reload option.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Form Management**: React Hook Form
- **Schema Validation**: Zod (`@hookform/resolvers/zod`)
- **Charts & Data Visualization**: Recharts
- **Iconography**: Lucide React
- **Persistence**: LocalStorage with automatic JSON serialization and schema validation

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/expensewise.git
   cd expensewise
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000` to interact with ExpenseWise.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── budgets/         # BudgetCard, BudgetModal, OverallBudgetModal
│   │   ├── charts/          # ExpensePieChart, IncomeExpenseBarChart, MonthlyTrendChart
│   │   ├── common/          # CategoryBadge, ConfirmDialog, EmptyState, SummaryCard, ToastNotification
│   │   ├── layout/          # Navbar, Sidebar
│   │   └── transactions/    # TransactionForm, TransactionModal, TransactionTable, TransactionCard, TransactionFilters
│   ├── context/
│   │   └── ExpenseContext.tsx # Centralized reducer state, persistence, derived metrics
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   ├── BudgetsPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   └── SettingsPage.tsx
│   ├── schemas/
│   │   └── transactionSchema.ts # Zod validation schemas
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   ├── utils/
│   │   ├── formatters.ts    # Currency, date formatters & CSV export
│   │   └── sampleData.ts    # Seed data & categories
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
└── README.md
```

---

## 🔒 Privacy & Data Sovereignty

All transactions, budgets, and user preferences are maintained solely in your client browser using LocalStorage. No confidential financial figures or telemetry data are collected or transferred over external networks.
