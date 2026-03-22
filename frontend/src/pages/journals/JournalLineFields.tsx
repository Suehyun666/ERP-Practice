import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { JournalCreateRequest } from '../../types/journal';
import type { Account } from '../../types/account';
import { Trash2 } from 'lucide-react';

interface Props {
  index: number;
  accounts: Account[];
  register: UseFormRegister<JournalCreateRequest>;
  errors: FieldErrors<JournalCreateRequest>;
  onRemove: () => void;
}

const INPUT = 'bg-surface-800 border border-slate-700 text-slate-100 text-sm rounded px-2 py-1.5 outline-none focus:border-primary-500 w-full';
const SELECT = INPUT + ' cursor-pointer';

export const JournalLineFields = ({ index, accounts, register, errors, onRemove }: Props) => {
  const lineErrors = errors.lines?.[index];
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-start">
      <div>
        <select {...register(`lines.${index}.accountCode`, { required: true })} className={SELECT}>
          <option value="">계정 선택</option>
          {accounts.map((a) => (
            <option key={a.accountCode} value={a.accountCode}>
              {a.accountCode} {a.accountName}
            </option>
          ))}
        </select>
        {lineErrors?.accountCode && <p className="text-red-400 text-xs mt-0.5">필수</p>}
      </div>
      <div>
        <select {...register(`lines.${index}.accountSide`, { required: true })} className={SELECT}>
          <option value="DEBIT">차변 (Debit)</option>
          <option value="CREDIT">대변 (Credit)</option>
        </select>
      </div>
      <div>
        <input
          type="number"
          min={1}
          placeholder="금액"
          {...register(`lines.${index}.amount`, { required: true, valueAsNumber: true, min: 1 })}
          className={INPUT}
        />
        {lineErrors?.amount && <p className="text-red-400 text-xs mt-0.5">0 초과</p>}
      </div>
      <div>
        <input
          type="text"
          placeholder="적요 (선택)"
          {...register(`lines.${index}.description`)}
          className={INPUT}
        />
      </div>
      <button type="button" onClick={onRemove} className="text-slate-500 hover:text-red-400 transition-colors mt-1">
        <Trash2 size={16} />
      </button>
    </div>
  );
};
