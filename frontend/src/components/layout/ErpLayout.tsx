import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Receipt, FileText, BarChart2, TrendingUp, LogOut, Lock, Zap, ScrollText, Users, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { name: 'Dashboard',  path: '/',        icon: LayoutDashboard },
  { name: '전표',        path: '/journals', icon: BookOpen },
  { name: '계정과목표',  path: '/accounts', icon: Receipt },
];

const REPORTS = [
  { name: '합계잔액시산표', path: '/reports/trial-balance',    icon: FileText },
  { name: '재무상태표',     path: '/reports/balance-sheet',    icon: BarChart2 },
  { name: '손익계산서',     path: '/reports/income-statement', icon: TrendingUp },
];

const SETTINGS = [
  { name: '회사 정보',      path: '/settings/company',         icon: Building2 },
  { name: '사용자 관리',    path: '/settings/users',           icon: Users },
  { name: '회계기간 마감',  path: '/settings/fiscal-periods',  icon: Lock },
  { name: '분개 규칙',      path: '/settings/posting-rules',   icon: Zap },
  { name: '감사 로그',      path: '/settings/audit-logs',      icon: ScrollText },
];

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
    isActive
      ? 'bg-primary-500/10 text-primary-400'
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
  }`;

export const ErpLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-surface-900 text-slate-100 font-sans">
      <aside className="w-60 border-r border-slate-800 bg-surface-800 flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-slate-800">
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary-500 to-indigo-400 bg-clip-text text-transparent">
            ERP Practice
          </h1>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === '/'} className={linkCls}>
              <Icon size={18} />{name}
            </NavLink>
          ))}

          <p className="px-3 pt-4 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">보고서</p>
          {REPORTS.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={linkCls}>
              <Icon size={18} />{name}
            </NavLink>
          ))}

          <p className="px-3 pt-4 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">설정</p>
          {SETTINGS.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={linkCls}>
              <Icon size={18} />{name}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.displayName?.[0] ?? 'U'}
            </div>
            <span className="text-sm text-slate-300 truncate">{user?.displayName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />로그아웃
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
