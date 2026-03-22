import type { JournalLine } from '../../types/journal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { AmountDisplay } from '../../components/common/AmountDisplay';

interface Props {
  lines: JournalLine[];
}

export const JournalDetailLines = ({ lines }: Props) => {
  const debitTotal  = lines.filter((l) => l.accountSide === 'DEBIT').reduce((s, l) => s + l.amount, 0);
  const creditTotal = lines.filter((l) => l.accountSide === 'CREDIT').reduce((s, l) => s + l.amount, 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">#</TableHead>
          <TableHead>계정코드</TableHead>
          <TableHead>계정명</TableHead>
          <TableHead>구분</TableHead>
          <TableHead className="text-right">금액</TableHead>
          <TableHead>통화</TableHead>
          <TableHead>적요</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lines.map((l) => (
          <TableRow key={l.lineId}>
            <TableCell className="text-slate-500">{l.lineNo}</TableCell>
            <TableCell className="font-mono text-slate-300">{l.accountCode}</TableCell>
            <TableCell>{l.accountName}</TableCell>
            <TableCell>
              <span className={l.accountSide === 'DEBIT' ? 'text-blue-400' : 'text-orange-400'}>
                {l.accountSide === 'DEBIT' ? '차변' : '대변'}
              </span>
            </TableCell>
            <TableCell className="text-right"><AmountDisplay amount={l.amount} /></TableCell>
            <TableCell className="text-slate-400">{l.currency}</TableCell>
            <TableCell className="text-slate-400">{l.description ?? '-'}</TableCell>
          </TableRow>
        ))}
        <TableRow className="border-t-2 border-slate-600 font-medium">
          <TableCell colSpan={4} className="text-right text-slate-400 text-sm">합계</TableCell>
          <TableCell className="text-right">
            <div className="text-blue-400 text-xs">차 <AmountDisplay amount={debitTotal} /></div>
            <div className="text-orange-400 text-xs">대 <AmountDisplay amount={creditTotal} /></div>
          </TableCell>
          <TableCell colSpan={2} />
        </TableRow>
      </TableBody>
    </Table>
  );
};
