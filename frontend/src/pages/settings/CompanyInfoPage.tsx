import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Building2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import api from '../../api/client';

interface CompanyInfo {
  companyName: string;
  businessNo: string;
  corpNo: string;
  ceoName: string;
  address: string;
  phone: string;
  email: string;
  fiscalMonthStart: number;
  currency: string;
  updatedAt: string;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props}
    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors" />
);

export default function CompanyInfoPage() {
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['company'],
    queryFn: () => api.get<CompanyInfo>('/company').then((r) => r.data),
  });

  const [form, setForm] = useState<Omit<CompanyInfo, 'updatedAt'>>({
    companyName: '', businessNo: '', corpNo: '', ceoName: '',
    address: '', phone: '', email: '', fiscalMonthStart: 1, currency: 'KRW',
  });

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);

  const save = useMutation({
    mutationFn: () => api.put('/company', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const set = (key: keyof typeof form, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  if (isLoading) return <div className="text-slate-400 text-sm">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <PageHeader title="회사 정보" description="Company Information">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-slate-400" />
          {data?.updatedAt && (
            <span className="text-xs text-slate-500">
              최종 수정: {new Date(data.updatedAt).toLocaleString('ko-KR')}
            </span>
          )}
        </div>
      </PageHeader>

      <div className="bg-surface-800 border border-slate-700/50 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="회사명 *">
              <Input value={form.companyName} onChange={(e) => set('companyName', e.target.value)}
                placeholder="ERP연습(주)" />
            </Field>
          </div>
          <Field label="사업자등록번호">
            <Input value={form.businessNo ?? ''} onChange={(e) => set('businessNo', e.target.value)}
              placeholder="000-00-00000" />
          </Field>
          <Field label="법인등록번호">
            <Input value={form.corpNo ?? ''} onChange={(e) => set('corpNo', e.target.value)}
              placeholder="000000-0000000" />
          </Field>
          <Field label="대표자명">
            <Input value={form.ceoName ?? ''} onChange={(e) => set('ceoName', e.target.value)}
              placeholder="홍길동" />
          </Field>
          <Field label="대표전화">
            <Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)}
              placeholder="02-0000-0000" />
          </Field>
          <div className="col-span-2">
            <Field label="사업장 주소">
              <Input value={form.address ?? ''} onChange={(e) => set('address', e.target.value)}
                placeholder="서울특별시 강남구 테헤란로 123" />
            </Field>
          </div>
          <Field label="대표이메일">
            <Input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)}
              placeholder="info@company.com" />
          </Field>
          <Field label="기능통화">
            <Input value={form.currency} onChange={(e) => set('currency', e.target.value)}
              placeholder="KRW" maxLength={3} />
          </Field>
          <Field label="회계연도 시작월">
            <select value={form.fiscalMonthStart}
              onChange={(e) => set('fiscalMonthStart', Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-primary-500">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-700">
          <button onClick={() => save.mutate()} disabled={save.isPending || !form.companyName}
            className="flex items-center gap-2 px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg disabled:opacity-50 transition-colors">
            <Save size={15} />{save.isPending ? '저장 중...' : '저장'}
          </button>
          {saved && <span className="text-green-400 text-sm">✓ 저장되었습니다</span>}
        </div>
      </div>
    </div>
  );
}
