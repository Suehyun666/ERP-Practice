import { useState } from 'react';
import { useIncomeStatement } from '../../hooks/useReports';
import { PageHeader } from '../../components/common/PageHeader';
import { PeriodSelector } from '../../components/common/PeriodSelector';
import { ReportSectionTable } from './ReportSectionTable';
import { AmountDisplay } from '../../components/common/AmountDisplay';

export default function IncomeStatementPage() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data, isLoading, isError } = useIncomeStatement(year, month);

  const revenue  = data?.sections.find((s) => s.sectionName.includes('수익'))?.subtotal ?? 0;
  const expense  = data?.sections.find((s) => s.sectionName.includes('비용'))?.subtotal ?? 0;
  const netIncome = revenue - expense;

  return (
    <div>
      <PageHeader title="손익계산서" description="Income Statement">
        <PeriodSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
      </PageHeader>

      {isLoading && <div className="text-slate-400 text-sm">Loading...</div>}
      {isError   && <div className="text-red-400 text-sm">데이터를 불러오지 못했습니다.</div>}
      {data && (
        <div className="space-y-4">
          <div className="flex gap-6 text-sm">
            <span className="text-slate-400">수익: <AmountDisplay amount={revenue} className="text-green-400" /></span>
            <span className="text-slate-400">비용: <AmountDisplay amount={expense} className="text-red-400" /></span>
            <span className="text-slate-400">
              당기순이익: <AmountDisplay amount={netIncome} className={netIncome >= 0 ? 'text-green-400' : 'text-red-400'} />
            </span>
          </div>
          <ReportSectionTable sections={data.sections} />
        </div>
      )}
    </div>
  );
}
