import { useState } from 'react';
import { useBalanceSheet } from '../../hooks/useReports';
import { PageHeader } from '../../components/common/PageHeader';
import { PeriodSelector } from '../../components/common/PeriodSelector';
import { ReportSectionTable } from './ReportSectionTable';
import { AmountDisplay } from '../../components/common/AmountDisplay';

export default function BalanceSheetPage() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data, isLoading, isError } = useBalanceSheet(year, month);

  const assetSections = ['자산'];
  const totalAssets     = data?.sections.filter((s) => assetSections.some((n) => s.sectionName.includes(n))).reduce((sum, s) => sum + s.subtotal, 0) ?? 0;
  const totalLiabEquity = data?.sections.filter((s) => !assetSections.some((n) => s.sectionName.includes(n))).reduce((sum, s) => sum + s.subtotal, 0) ?? 0;

  return (
    <div>
      <PageHeader title="재무상태표" description="Balance Sheet">
        <PeriodSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
      </PageHeader>

      {isLoading && <div className="text-slate-400 text-sm">Loading...</div>}
      {isError   && <div className="text-red-400 text-sm">데이터를 불러오지 못했습니다.</div>}
      {data && (
        <div className="space-y-4">
          <div className="flex gap-6 text-sm">
            <span className="text-slate-400">총자산: <AmountDisplay amount={totalAssets} className="text-slate-100" /></span>
            <span className="text-slate-400">부채+자본: <AmountDisplay amount={totalLiabEquity} className="text-slate-100" /></span>
            <span className={Math.abs(totalAssets - totalLiabEquity) < 1 ? 'text-green-400' : 'text-red-400'}>
              {Math.abs(totalAssets - totalLiabEquity) < 1 ? '✓ 균형' : '✗ 불일치'}
            </span>
          </div>
          <ReportSectionTable sections={data.sections} />
        </div>
      )}
    </div>
  );
}
