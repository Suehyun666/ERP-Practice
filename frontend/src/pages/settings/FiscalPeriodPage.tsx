import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import api from '../../api/client';

interface Period {
  fiscal_year: number;
  fiscal_month: number;
  status: string;
  closed_at: string | null;
}

const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

const fetchPeriods = (year: number) =>
  api.get<Period[]>(`/fiscal-periods?year=${year}`).then((r) => r.data);

export default function FiscalPeriodPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const qc = useQueryClient();

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['fiscal-periods', year],
    queryFn: () => fetchPeriods(year),
  });

  const close = useMutation({
    mutationFn: ({ y, m }: { y: number; m: number }) =>
      api.post(`/fiscal-periods/${y}/${m}/close`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fiscal-periods', year] }),
  });

  const reopen = useMutation({
    mutationFn: ({ y, m }: { y: number; m: number }) =>
      api.post(`/fiscal-periods/${y}/${m}/reopen`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fiscal-periods', year] }),
  });

  return (
    <div>
      <PageHeader title="회계 기간 마감" description="Fiscal Period Management">
        <div className="flex items-center gap-2">
          <button onClick={() => setYear((y) => y - 1)} className="px-3 py-1.5 text-sm rounded bg-slate-700 hover:bg-slate-600">‹</button>
          <span className="text-slate-200 font-semibold w-16 text-center">{year}년</span>
          <button onClick={() => setYear((y) => y + 1)} className="px-3 py-1.5 text-sm rounded bg-slate-700 hover:bg-slate-600">›</button>
        </div>
      </PageHeader>

      {isError && (
        <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
          <AlertCircle size={16} />데이터 로드 실패
        </div>
      )}

      {isLoading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((p) => (
            <div
              key={p.fiscal_month}
              className={`rounded-xl border p-4 flex flex-col gap-3 ${
                p.status === 'OPEN'
                  ? 'bg-surface-800 border-slate-700/50'
                  : 'bg-slate-800/30 border-slate-700/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{MONTH_NAMES[p.fiscal_month - 1]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.status === 'OPEN' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {p.status === 'OPEN' ? '개방' : '마감'}
                </span>
              </div>
              {p.closed_at && (
                <p className="text-xs text-slate-500">
                  마감: {new Date(p.closed_at).toLocaleDateString('ko-KR')}
                </p>
              )}
              <button
                onClick={() =>
                  p.status === 'OPEN'
                    ? close.mutate({ y: p.fiscal_year, m: p.fiscal_month })
                    : reopen.mutate({ y: p.fiscal_year, m: p.fiscal_month })
                }
                disabled={close.isPending || reopen.isPending}
                className={`flex items-center justify-center gap-2 text-xs py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                  p.status === 'OPEN'
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                }`}
              >
                {p.status === 'OPEN' ? <><Lock size={12} />마감</>  : <><Unlock size={12} />재개</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
