import { useState } from 'react';
import { useTrialBalance } from '../../hooks/useReports';
import { PageHeader } from '../../components/common/PageHeader';
import { PeriodSelector } from '../../components/common/PeriodSelector';
import { TrialBalanceTable } from './TrialBalanceTable';

export default function TrialBalancePage() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data, isLoading, isError } = useTrialBalance(year, month);

  return (
    <div>
      <PageHeader title="합계잔액시산표" description="Trial Balance">
        <PeriodSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
      </PageHeader>

      {isLoading && <div className="text-slate-400 text-sm">Loading...</div>}
      {isError   && <div className="text-red-400 text-sm">데이터를 불러오지 못했습니다.</div>}
      {data && <TrialBalanceTable data={data} />}
    </div>
  );
}
