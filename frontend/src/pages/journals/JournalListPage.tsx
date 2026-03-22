import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useJournals } from '../../hooks/useJournals';
import { PageHeader } from '../../components/common/PageHeader';
import { PeriodSelector } from '../../components/common/PeriodSelector';
import { JournalTable } from './JournalTable';
import { Button } from '../../components/ui/Button';

export default function JournalListPage() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const navigate = useNavigate();

  const { data: journals = [], isLoading } = useJournals(year, month);

  return (
    <div>
      <PageHeader title="전표 목록" description="Journal Entries">
        <PeriodSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
        <Button variant="primary" onClick={() => navigate('/journals/new')}>
          <Plus size={16} />
          신규 전표
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : journals.length === 0 ? (
        <div className="text-slate-400 text-sm py-8 text-center">해당 기간에 전표가 없습니다.</div>
      ) : (
        <JournalTable journals={journals} />
      )}
    </div>
  );
}
