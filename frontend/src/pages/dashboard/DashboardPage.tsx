import { AlertCircle } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useJournals } from '../../hooks/useJournals';
import { DashboardKpiCards, DashboardStatBadges } from './DashboardKpiCards';
import { DashboardTrend } from './DashboardTrend';
import { DashboardExpenses } from './DashboardExpenses';
import { DashboardRecentJournals } from './DashboardRecentJournals';

export default function DashboardPage() {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth() + 1;

  const { data, isLoading, isError } = useDashboard(year, month);
  const { data: journals = [], isLoading: jLoading } = useJournals(year, month);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Financial Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          {year}년 {month}월 기준 · 실시간 재무 현황
        </p>
      </div>

      {isError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3 text-red-400">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">API 연결 실패 — 백엔드(8080)와 DB 연결을 확인하세요.</p>
        </div>
      )}

      <DashboardKpiCards kpi={data?.currentMonth} isLoading={isLoading} />
      <DashboardStatBadges kpi={data?.currentMonth} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {data && <DashboardTrend trend={data.monthlyTrend} />}
        </div>
        <div>
          {data && <DashboardExpenses items={data.topExpenses} />}
        </div>
      </div>

      <DashboardRecentJournals journals={journals} isLoading={jLoading} />
    </div>
  );
}
