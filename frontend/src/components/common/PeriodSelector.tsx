const SELECT_CLS = 'bg-surface-800 border border-slate-700 text-slate-100 text-sm rounded-md px-3 py-1.5 outline-none focus:border-primary-500 cursor-pointer';

interface Props {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export const PeriodSelector = ({ year, month, onChange }: Props) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      <select value={year} onChange={(e) => onChange(Number(e.target.value), month)} className={SELECT_CLS}>
        {years.map((y) => <option key={y} value={y}>{y}년</option>)}
      </select>
      <select value={month} onChange={(e) => onChange(year, Number(e.target.value))} className={SELECT_CLS}>
        {months.map((m) => <option key={m} value={m}>{m}월</option>)}
      </select>
    </div>
  );
};
