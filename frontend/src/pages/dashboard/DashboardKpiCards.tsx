import { TrendingUp, TrendingDown, Wallet, FileText } from 'lucide-react';
import { AmountDisplay } from '../../components/common/AmountDisplay';
import type { MonthKpi } from '../../api/dashboard.api';

interface Props { kpi: MonthKpi | undefined; isLoading: boolean; }

const Skeleton = () => <div className="h-8 w-28 bg-slate-700 animate-pulse rounded" />;

interface CardProps {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
  sub?: string;
  isLoading: boolean;
}

const KpiCard = ({ label, value, icon, color, sub, isLoading }: CardProps) => (
  <div className="bg-surface-800 border border-slate-700/50 rounded-xl p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
    </div>
    {isLoading ? <Skeleton /> : (
      <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
        <AmountDisplay amount={value ?? 0} />
      </div>
    )}
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </div>
);

export const DashboardKpiCards = ({ kpi, isLoading }: Props) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <KpiCard label="이번 달 매출" value={kpi?.revenue} icon={<TrendingUp size={16} />}
      color="bg-green-500/10 text-green-400" sub="서비스·상품 수익" isLoading={isLoading} />
    <KpiCard label="이번 달 비용" value={kpi?.expenses} icon={<TrendingDown size={16} />}
      color="bg-red-500/10 text-red-400" sub="급여·임차·기타" isLoading={isLoading} />
    <KpiCard label="당기순이익" value={kpi?.netIncome} icon={<TrendingUp size={16} />}
      color={!kpi || kpi.netIncome >= 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}
      sub="매출 - 비용" isLoading={isLoading} />
    <KpiCard label="현금 잔액" value={kpi?.cashBalance} icon={<Wallet size={16} />}
      color="bg-violet-500/10 text-violet-400"
      sub={kpi ? `미수금 ${kpi.arBalance.toLocaleString('ko-KR')}` : ''}
      isLoading={isLoading} />
  </div>
);

export const DashboardStatBadges = ({ kpi, isLoading }: Props) => (
  <div className="flex gap-3 flex-wrap">
    {[
      { label: '이번 달 전표 (승인)', value: kpi?.postedCount, color: 'text-green-400' },
      { label: '미승인 (초안)', value: kpi?.draftCount, color: 'text-yellow-400' },
    ].map(({ label, value, color }) => (
      <div key={label} className="flex items-center gap-2 bg-surface-800 border border-slate-700/50 rounded-lg px-3 py-2">
        <FileText size={14} className={color} />
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{isLoading ? '-' : value}</span>
      </div>
    ))}
  </div>
);
