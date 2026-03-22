import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { MonthTrend } from '../../api/dashboard.api';

const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

const fmt = (v: number) => (v === 0 ? '0' : `${(v / 1_000_000).toFixed(1)}M`);

interface Props { trend: MonthTrend[]; }

export const DashboardTrend = ({ trend }: Props) => {
  const data = trend.map((t) => ({
    name: MONTHS[t.month - 1],
    매출: t.revenue,
    비용: t.expenses,
    순이익: t.netIncome,
  }));

  return (
    <div className="bg-surface-800 border border-slate-700/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">월별 수익·비용 추이</h3>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tickFormatter={fmt} tick={{ fill: '#94a3b8', fontSize: 11 }} width={48} />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(v: number) => v.toLocaleString('ko-KR') + '원'}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
          <Bar dataKey="매출"  fill="#22c55e" radius={[3,3,0,0]} maxBarSize={32} />
          <Bar dataKey="비용"  fill="#ef4444" radius={[3,3,0,0]} maxBarSize={32} />
          <Line dataKey="순이익" type="monotone" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
