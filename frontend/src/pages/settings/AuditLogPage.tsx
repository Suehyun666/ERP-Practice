import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/common/PageHeader';
import api from '../../api/client';

interface AuditLog {
  log_id: number;
  table_name: string;
  target_id: string;
  action: string;
  user_name: string | null;
  ip_address: string | null;
  created_at: string;
  old_values: string | null;
  new_values: string | null;
}

const ACTION_COLOR: Record<string, string> = {
  INSERT:  'text-green-400',
  POST:    'text-blue-400',
  CANCEL:  'text-yellow-400',
  UPDATE:  'text-orange-400',
  DELETE:  'text-red-400',
};

const fetchLogs = (page: number, tableName: string) =>
  api.get<AuditLog[]>(`/audit-logs?page=${page}&size=50${tableName ? `&tableName=${tableName}` : ''}`).then((r) => r.data);

export default function AuditLogPage() {
  const [page, setPage] = useState(0);
  const [tableName, setTableName] = useState('');

  const { data = [], isLoading } = useQuery({
    queryKey: ['audit-logs', page, tableName],
    queryFn: () => fetchLogs(page, tableName),
  });

  return (
    <div>
      <PageHeader title="감사 로그" description="Audit Trail (K-SOX)" />

      <div className="flex gap-3 mb-4">
        <input
          value={tableName}
          onChange={(e) => { setTableName(e.target.value); setPage(0); }}
          placeholder="테이블명 필터 (예: journal_headers)"
          className="flex-1 max-w-xs px-3 py-1.5 bg-surface-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
        />
        <span className="text-slate-500 text-sm self-center">{data.length}건</span>
      </div>

      {isLoading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : (
        <div className="bg-surface-800 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700">
              <tr className="text-left text-xs text-slate-400">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">테이블</th>
                <th className="px-4 py-3">대상ID</th>
                <th className="px-4 py-3">작업</th>
                <th className="px-4 py-3">작업자</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {data.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">로그 없음</td></tr>
              ) : data.map((log) => (
                <tr key={log.log_id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-slate-500 text-xs">{log.log_id}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300 text-xs">{log.table_name}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300 text-xs">{log.target_id}</td>
                  <td className="px-4 py-2.5">
                    <span className={`font-semibold text-xs ${ACTION_COLOR[log.action] ?? 'text-slate-300'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">{log.user_name ?? '-'}</td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono text-xs">{log.ip_address ?? '-'}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
          className="px-4 py-1.5 text-sm rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40">이전</button>
        <span className="text-slate-400 text-sm">페이지 {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={data.length < 50}
          className="px-4 py-1.5 text-sm rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40">다음</button>
      </div>
    </div>
  );
}
