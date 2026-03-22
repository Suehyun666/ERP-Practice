import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ErpLayout } from './components/layout/ErpLayout';
import Login from './pages/auth/Login.tsx';
import Signup from './pages/auth/Signup.tsx';
import DashboardPage from './pages/dashboard/DashboardPage';
import AccountListPage from './pages/accounts/AccountListPage';
import JournalListPage from './pages/journals/JournalListPage';
import JournalCreatePage from './pages/journals/JournalCreatePage';
import JournalDetailPage from './pages/journals/JournalDetailPage';
import TrialBalancePage from './pages/reports/TrialBalancePage';
import BalanceSheetPage from './pages/reports/BalanceSheetPage';
import IncomeStatementPage from './pages/reports/IncomeStatementPage';
import FiscalPeriodPage from './pages/settings/FiscalPeriodPage';
import PostingRulesPage from './pages/settings/PostingRulesPage';
import AuditLogPage from './pages/settings/AuditLogPage';
import UserManagementPage from './pages/settings/UserManagementPage';
import CompanyInfoPage from './pages/settings/CompanyInfoPage';
import './index.css';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<ErpLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/accounts" element={<AccountListPage />} />
                <Route path="/journals" element={<JournalListPage />} />
                <Route path="/journals/new" element={<JournalCreatePage />} />
                <Route path="/journals/:id" element={<JournalDetailPage />} />
                <Route path="/reports/trial-balance" element={<TrialBalancePage />} />
                <Route path="/reports/balance-sheet" element={<BalanceSheetPage />} />
                <Route path="/reports/income-statement" element={<IncomeStatementPage />} />
                <Route path="/settings/fiscal-periods" element={<FiscalPeriodPage />} />
                <Route path="/settings/posting-rules" element={<PostingRulesPage />} />
                <Route path="/settings/audit-logs" element={<AuditLogPage />} />
                <Route path="/settings/users" element={<UserManagementPage />} />
                <Route path="/settings/company" element={<CompanyInfoPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
