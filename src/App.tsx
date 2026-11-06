import React, { useState } from 'react';
import { ExpenseProvider, useExpenseWise } from './context/ExpenseContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SettingsPage } from './pages/SettingsPage';
import { TransactionModal } from './components/transactions/TransactionModal';
import { ToastNotification } from './components/common/ToastNotification';

const AppContent: React.FC = () => {
  const { state } = useExpenseWise();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (state.activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <TransactionModal />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
