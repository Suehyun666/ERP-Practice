import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import api from '../../api/client';
import { useAccounts } from '../../hooks/useAccounts';

interface PostingRule {
  rule_id: number;
  event_type: string;
  description: string | null;
  is_active: boolean;
  debit_account: string;
  debit_account_name: string;
  credit_account: string;
  credit_account_name: string;
}

const fetchRules = () => api.get<PostingRule[]>('/posting-rules').then((r) => r.data);

export default function PostingRulesPage() {
  const qc = useQueryClient();
  const { data: rules = [], isLoading } = useQuery({ queryKey: ['posting-rules'], queryFn: fetchRules });
  const { data: accounts = [] } = useAccounts();
  const detailAccounts = accounts.filter((a) => a.isDetail);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eventType: '', debitAccount: '', creditAccount: '', description: '' });

  const create = useMutation({
    mutationFn: () => api.post('/posting-rules', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['posting-rules'] }); setShowForm(false); setForm({ eventType: '', debitAccount: '', creditAccount: '', description: '' }); },
  });

  const toggle = useMutation({
    mutationFn: (id: number) => api.patch(`/posting-rules/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posting-rules'] }),
  });

  const del = useMutation({
    mutationFn: (id: number) => api.delete(`/posting-rules/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posting-rules'] }),
  });

  return (
    <div>
      <PageHeader title="분개 규칙 엔진" description="Posting Rule Engine">
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg transition-colors">
          <Plus size={16} />규칙 추가
        </button>
      </PageHeader>

      {showForm && (
        <div className="bg-surface-800 border border-slate-700/50 rounded-xl p-5 mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">새 분개 규칙</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">이벤트 타입 *</label>
              <input value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                placeholder="예: SALARY_PAYMENT"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">설명</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="규칙 설명"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">차변 계정 *</label>
              <select value={form.debitAccount} onChange={(e) => setForm({ ...form, debitAccount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">선택</option>
                {detailAccounts.map((a) => <option key={a.accountCode} value={a.accountCode}>{a.accountCode} {a.accountName}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">대변 계정 *</label>
              <select value={form.creditAccount} onChange={(e) => setForm({ ...form, creditAccount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
                <option value="">선택</option>
                {detailAccounts.map((a) => <option key={a.accountCode} value={a.accountCode}>{a.accountCode} {a.accountName}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => create.mutate()} disabled={!form.eventType || !form.debitAccount || !form.creditAccount || create.isPending}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg disabled:opacity-50">저장</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">취소</button>
          </div>
        </div>
      )}

      {isLoading ? <div className="text-slate-400 text-sm">Loading...</div> : (
        <div className="bg-surface-800 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700">
              <tr className="text-left text-xs text-slate-400">
                <th className="px-4 py-3">이벤트 타입</th>
                <th className="px-4 py-3">차변</th>
                <th className="px-4 py-3">대변</th>
                <th className="px-4 py-3">설명</th>
                <th className="px-4 py-3 text-center">상태</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {rules.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">등록된 규칙 없음</td></tr>
              )}
              {rules.map((r) => (
                <tr key={r.rule_id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-200">{r.event_type}</td>
                  <td className="px-4 py-3 text-slate-300">{r.debit_account} <span className="text-slate-500">{r.debit_account_name}</span></td>
                  <td className="px-4 py-3 text-slate-300">{r.credit_account} <span className="text-slate-500">{r.credit_account_name}</span></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{r.description ?? '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle.mutate(r.rule_id)} className="hover:opacity-80">
                      {r.is_active
                        ? <ToggleRight size={20} className="text-green-400" />
                        : <ToggleLeft size={20} className="text-slate-500" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { if (confirm('삭제하시겠습니까?')) del.mutate(r.rule_id); }}
                      className="text-red-400 hover:text-red-300 p-1"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
