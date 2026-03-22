import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { JournalCreateRequest } from '../../types/journal';
import { useCreateJournal } from '../../hooks/useJournals';
import { usePostableAccounts } from '../../hooks/useAccounts';
import { PageHeader } from '../../components/common/PageHeader';
import { JournalLineFields } from './JournalLineFields';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const today = () => new Date().toISOString().slice(0, 10);

export default function JournalCreatePage() {
  const navigate = useNavigate();
  const { data: accounts = [] } = usePostableAccounts();
  const createJournal = useCreateJournal();

  const { register, control, handleSubmit, formState: { errors } } = useForm<JournalCreateRequest>({
    defaultValues: { docDate: today(), postDate: today(), lines: [{ accountSide: 'DEBIT', amount: 0 }, { accountSide: 'CREDIT', amount: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });

  const onSubmit = (data: JournalCreateRequest) => {
    createJournal.mutate(data, {
      onSuccess: (journal) => navigate(`/journals/${journal.journalId}`),
    });
  };

  return (
    <div>
      <PageHeader title="전표 입력" description="New Journal Entry" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-2 gap-4">
          <Input label="전표일" type="date" {...register('docDate', { required: true })} error={errors.docDate?.message} />
          <Input label="기표일" type="date" {...register('postDate', { required: true })} error={errors.postDate?.message} />
        </div>
        <Input label="설명 (선택)" {...register('description')} />

        <div className="space-y-2">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 text-xs text-slate-400 px-0.5">
            <span>계정과목</span><span>구분</span><span>금액</span><span>적요</span><span />
          </div>
          {fields.map((f, i) => (
            <JournalLineFields key={f.id} index={i} accounts={accounts} register={register} errors={errors} onRemove={() => remove(i)} />
          ))}
          <button type="button" onClick={() => append({ accountCode: '', accountSide: 'DEBIT', amount: 0 })}
            className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors mt-1">
            <Plus size={14} /> 행 추가
          </button>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={createJournal.isPending}>저장 (초안)</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>취소</Button>
        </div>
        {createJournal.isError && (
          <p className="text-red-400 text-sm">
            저장 실패: {
              (createJournal.error as { response?: { data?: { detail?: string; title?: string } } })
                ?.response?.data?.detail
              ?? (createJournal.error as { response?: { data?: { detail?: string; title?: string } } })
                ?.response?.data?.title
              ?? String(createJournal.error)
            }
          </p>
        )}
      </form>
    </div>
  );
}
