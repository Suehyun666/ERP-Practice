import type { TrialBalance } from '../../types/report';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { AmountDisplay } from '../../components/common/AmountDisplay';

interface Props {
  data: TrialBalance;
}

export const TrialBalanceTable = ({ data }: Props) => (
  <div className="space-y-3">
    <div className="flex gap-6 text-sm">
      <span className={`font-medium ${data.isBalanced ? 'text-green-400' : 'text-red-400'}`}>
        {data.isBalanced ? '✓ 차대 균형' : '✗ 차대 불일치'}
      </span>
      <span className="text-slate-400">차변합계: <AmountDisplay amount={data.totalDebit} /></span>
      <span className="text-slate-400">대변합계: <AmountDisplay amount={data.totalCredit} /></span>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>계정코드</TableHead>
          <TableHead>계정명</TableHead>
          <TableHead>유형</TableHead>
          <TableHead className="text-right">기초잔액</TableHead>
          <TableHead className="text-right">차변</TableHead>
          <TableHead className="text-right">대변</TableHead>
          <TableHead className="text-right">기말잔액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.rows.map((row) => (
          <TableRow key={row.accountCode}>
            <TableCell className="font-mono text-slate-300">{row.accountCode}</TableCell>
            <TableCell>{row.accountName}</TableCell>
            <TableCell className="text-slate-400">{row.accountType}</TableCell>
            <TableCell className="text-right"><AmountDisplay amount={row.openingBalance} /></TableCell>
            <TableCell className="text-right"><AmountDisplay amount={row.debitTotal} /></TableCell>
            <TableCell className="text-right"><AmountDisplay amount={row.creditTotal} /></TableCell>
            <TableCell className="text-right font-medium"><AmountDisplay amount={row.closingBalance} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
