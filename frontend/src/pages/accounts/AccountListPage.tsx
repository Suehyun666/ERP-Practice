import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { PageHeader } from '../../components/common/PageHeader';
import { AccountTable } from './AccountTable';
import type { AccountType } from '../../types/account';
import api from '../../api/client';

const TYPES: AccountType[] = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];

const TYPE_LABEL: Record<AccountType, string> = {
  ASSET: '자산', LIABILITY: '부채', EQUITY: '자본', REVENUE: '수익', EXPENSE: '비용',
};

interface CreateForm {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  parentCode: string;
  isDetail: boolean;
}

const EMPTY: CreateForm = { accountCode: '', accountName: '', accountType: 'ASSET', parentCode: '', isDetail: true };

export default function AccountListPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<AccountType | 'ALL'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateForm>(EMPTY);

  const { data: accounts = [], isLoading } = useAccounts();
  const filtered = filter === 'ALL' ? accounts : accounts.filter((a) => a.accountType === filter);

  const create = useMutation({
    mutationFn: () => api.post('/accounts', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); setForm(EMPTY); setShowForm(false); },
  });

  const toggle = useMutation({
    mutationFn: (code: string) => api.patch(`/accounts/${code}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });

  const set = (key: keyof CreateForm, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <PageHeader title="계정과목 관리" description="Chart of Accounts">
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg transition-colors">
          <Plus size={15} />계정 추가
          {showForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </PageHeader>

      {showForm && (
        <div className="bg-surface-800 border border-slate-700/50 rounded-xl p-5 mb-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">새 계정과목</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">계정코드 *</label>
              <input value={form.accountCode} onChange={(e) => set('accountCode', e.target.value)}
                placeholder="예: 110104"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">계정명 *</label>
              <input value={form.accountName} onChange={(e) => set('accountName', e.target.value)}
                placeholder="예: 정기예금"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">계정유형 *</label>
              <select value={form.accountType} onChange={(e) => set('accountType', e.target.value as AccountType)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
                {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]} ({t})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">상위 계정코드</label>
              <input value={form.parentCode} onChange={(e) => set('parentCode', e.target.value)}
                placeholder="예: 1101 (없으면 빈칸)"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isDetail}
                  onChange={(e) => set('isDetail', e.target.checked)}
                  className="w-4 h-4 accent-primary-500" />
                <span className="text-sm text-slate-300">말단 계정 (전표 입력 가능)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => create.mutate()}
              disabled={!form.accountCode || !form.accountName || create.isPending}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg disabled:opacity-50">
              저장
            </button>
            <button onClick={() => { setShowForm(false); setForm(EMPTY); }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">
              취소
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['ALL', ...TYPES] as const).map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              filter === t
                ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}>
            {t === 'ALL' ? '전체' : `${TYPE_LABEL[t]}`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : (
        <AccountTable accounts={filtered} onToggle={(code) => toggle.mutate(code)} />
      )}
    </div>
  );
}
