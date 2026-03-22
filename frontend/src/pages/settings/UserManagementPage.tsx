import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck, UserX, Plus, X, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import api from '../../api/client';

interface UserRow {
  userId: number;
  username: string;
  displayName: string;
  email: string;
  status: string;
  createdAt: string;
  roles: string | null;
}

interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN:            '관리자',
  JOURNAL_CREATOR:  '전표작성',
  JOURNAL_APPROVER: '전표승인',
  REPORT_VIEWER:    '보고서조회',
};

const ROLE_COLOR: Record<string, string> = {
  ADMIN:            'bg-red-500/10 text-red-400 border-red-500/20',
  JOURNAL_CREATOR:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  JOURNAL_APPROVER: 'bg-green-500/10 text-green-400 border-green-500/20',
  REPORT_VIEWER:    'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function UserManagementPage() {
  const qc = useQueryClient();
  const [addingFor, setAddingFor] = useState<number | null>(null);

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<UserRow[]>('/users').then((r) => r.data),
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => api.get<Role[]>('/users/roles').then((r) => r.data),
  });

  const toggleStatus = useMutation({
    mutationFn: (userId: number) => api.patch(`/users/${userId}/status`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const addRole = useMutation({
    mutationFn: ({ userId, roleName }: { userId: number; roleName: string }) =>
      api.post(`/users/${userId}/roles/${roleName}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setAddingFor(null); },
  });

  const removeRole = useMutation({
    mutationFn: ({ userId, roleName }: { userId: number; roleName: string }) =>
      api.delete(`/users/${userId}/roles/${roleName}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) return <div className="text-slate-400 text-sm">Loading...</div>;

  if (isError) return (
    <div className="flex items-center gap-2 text-red-400 text-sm">
      <AlertCircle size={16} />사용자 데이터를 불러오지 못했습니다.
    </div>
  );

  return (
    <div>
      <PageHeader title="사용자 관리" description="User & Role Management · 직무분리(SoD)" />

      <div className="mb-5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-xs text-amber-400">
        <strong>직무분리 원칙:</strong> JOURNAL_CREATOR(작성)와 JOURNAL_APPROVER(승인)는 서로 다른 사람에게 부여하세요.
        자신이 작성한 전표를 자신이 승인하면 내부통제 위반입니다.
      </div>

      <div className="space-y-3">
        {users.map((u) => {
          const userRoles = u.roles ? u.roles.split(',').filter(Boolean) : [];
          const available = roles.filter((r) => !userRoles.includes(r.roleName));
          const active = u.status === 'ACTIVE';

          return (
            <div key={u.userId}
              className={`bg-surface-800 border rounded-xl p-4 ${active ? 'border-slate-700/50' : 'border-slate-700/20 opacity-60'}`}>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${active ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-700 text-slate-500'}`}>
                    {u.displayName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-200">{u.displayName}</span>
                      <span className="text-xs text-slate-500">@{u.username}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${active ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                        {active ? '활성' : '비활성'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{u.email}</div>
                  </div>
                </div>

                <button onClick={() => toggleStatus.mutate(u.userId)} disabled={toggleStatus.isPending}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg shrink-0 disabled:opacity-50 transition-colors ${
                    active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}>
                  {active ? <><UserX size={13} />비활성화</> : <><UserCheck size={13} />활성화</>}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3 pl-12">
                {userRoles.map((role) => (
                  <span key={role}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${ROLE_COLOR[role] ?? 'bg-slate-700/50 text-slate-400 border-slate-600'}`}>
                    {ROLE_LABEL[role] ?? role}
                    <button onClick={() => removeRole.mutate({ userId: u.userId, roleName: role })}
                      className="opacity-60 hover:opacity-100 ml-0.5"><X size={10} /></button>
                  </span>
                ))}

                {addingFor === u.userId ? (
                  <div className="flex items-center gap-1">
                    <select defaultValue=""
                      onChange={(e) => { if (e.target.value) addRole.mutate({ userId: u.userId, roleName: e.target.value }); }}
                      className="text-xs px-2 py-1 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-primary-500">
                      <option value="" disabled>역할 선택</option>
                      {available.map((r) => (
                        <option key={r.roleName} value={r.roleName}>{ROLE_LABEL[r.roleName] ?? r.roleName}</option>
                      ))}
                    </select>
                    <button onClick={() => setAddingFor(null)} className="text-slate-500 hover:text-slate-300 p-1">
                      <X size={13} />
                    </button>
                  </div>
                ) : available.length > 0 ? (
                  <button onClick={() => setAddingFor(u.userId)}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-dashed border-slate-600 text-slate-500 hover:border-slate-400 hover:text-slate-300 transition-colors">
                    <Plus size={10} />역할 추가
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
