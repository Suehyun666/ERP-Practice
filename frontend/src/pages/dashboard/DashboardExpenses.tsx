import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';
import type { AccountKpi } from '../../api/dashboard.api';

const COLORS = ['#ef4444','#f97316','#eab308','#8b5cf6','#06b6d4'];

interface Props { items: AccountKpi[]; }

export const DashboardExpenses = ({ items }: Props) => {
  const total = items.reduce((s, i) => s + i.amount, 0);
  const data  = items.map((i, idx) => ({
    name: i.accountName,
    value: i.amount,
    fill: COLORS[idx % COLORS.length],
  }));

  return (
    <div className="bg-surface-800 border border-slate-700/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">이번 달 비용 구성</h3>
      {items.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-8">비용 데이터 없음</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart innerRadius="30%" outerRadius="90%" data={data} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={4} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
                itemStyle={{ color: '#e2e8f0' }}
                labelFormatter={() => ''}
                formatter={(v: number, _key: string, props: { payload?: { name?: string } }) =>
                  [v.toLocaleString('ko-KR') + '원', props.payload?.name ?? '']
                }
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <ul className="space-y-1.5 mt-2">
            {items.map((item, idx) => (
              <li key={item.accountName} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300">{item.accountName}</span>
                </span>
                <span className="text-slate-400 font-mono">
                  {total > 0 ? ((item.amount / total) * 100).toFixed(0) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
