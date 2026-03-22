import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useJournal, usePostJournal, useCancelJournal } from '../../hooks/useJournals';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JournalDetailLines } from './JournalDetailLines';
import { Button } from '../../components/ui/Button';

type ApiError = { response?: { data?: { detail?: string; title?: string } } };

const getErrMsg = (err: unknown) => {
  const e = err as ApiError;
  return e?.response?.data?.detail ?? e?.response?.data?.title ?? String(err);
};

export default function JournalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const journalId = Number(id);

  const { data: journal, isLoading } = useJournal(journalId);
  const postJournal   = usePostJournal();
  const cancelJournal = useCancelJournal();

  if (isLoading) return <div className="text-slate-400 text-sm">Loading...</div>;
  if (!journal)  return <div className="text-slate-400 text-sm">전표를 찾을 수 없습니다.</div>;

  return (
    <div>
      <PageHeader title={journal.journalNo} description={journal.description ?? undefined}>
        <StatusBadge status={journal.status} />
        {journal.status === 'DRAFT' && (
          <>
            <Button variant="primary" disabled={postJournal.isPending}
              onClick={() => postJournal.mutate(journalId)}>승인 (Post)</Button>
            <Button variant="danger" disabled={cancelJournal.isPending}
              onClick={() => cancelJournal.mutate(journalId)}>취소 (삭제)</Button>
          </>
        )}
        {journal.status === 'POSTED' && (
          <Button variant="danger" disabled={cancelJournal.isPending}
            onClick={() => cancelJournal.mutate(journalId)}>역분개 취소</Button>
        )}
      </PageHeader>

      {postJournal.isError && (
        <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          승인 실패: {getErrMsg(postJournal.error)}
        </div>
      )}
      {cancelJournal.isError && (
        <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          취소 실패: {getErrMsg(cancelJournal.error)}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="text-slate-400">전표일: </span>{journal.docDate}</div>
        <div><span className="text-slate-400">기표일: </span>{journal.postDate}</div>
        <div><span className="text-slate-400">생성일시: </span>{new Date(journal.createdAt).toLocaleString('ko-KR')}</div>
      </div>

      <JournalDetailLines lines={journal.lines} />

      <div className="mt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft size={14} /> 목록으로
        </button>
      </div>
    </div>
  );
}
