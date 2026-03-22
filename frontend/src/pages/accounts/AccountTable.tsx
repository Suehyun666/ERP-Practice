import type { Account } from '../../types/account';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  ASSET:     'text-blue-400',
  LIABILITY: 'text-orange-400',
  EQUITY:    'text-purple-400',
  REVENUE:   'text-green-400',
  EXPENSE:   'text-red-400',
};

const TYPE_LABEL: Record<string, string> = {
  ASSET: '자산', LIABILITY: '부채', EQUITY: '자본', REVENUE: '수익', EXPENSE: '비용',
};

interface Props {
  accounts: Account[];
  onToggle?: (code: string) => void;
}

export const AccountTable = ({ accounts, onToggle }: Props) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>계정코드</TableHead>
        <TableHead>계정명</TableHead>
        <TableHead>유형</TableHead>
        <TableHead>정상잔액</TableHead>
        <TableHead>말단계정</TableHead>
        <TableHead>상태</TableHead>
        {onToggle && <TableHead />}
      </TableRow>
    </TableHeader>
    <TableBody>
      {accounts.map((acc) => (
        <TableRow key={acc.accountCode} className={acc.isActive ? '' : 'opacity-50'}>
          <TableCell className="font-mono text-slate-300">{acc.accountCode}</TableCell>
          <TableCell className={acc.parentCode ? 'pl-8' : 'font-medium'}>{acc.accountName}</TableCell>
          <TableCell className={TYPE_COLORS[acc.accountType] ?? ''}>
            {TYPE_LABEL[acc.accountType] ?? acc.accountType}
          </TableCell>
          <TableCell className="text-slate-400 text-xs">{acc.normalSide}</TableCell>
          <TableCell>{acc.isDetail ? <span className="text-green-400">✓</span> : <span className="text-slate-600">-</span>}</TableCell>
          <TableCell>
            <span className={acc.isActive ? 'text-green-400 text-xs' : 'text-slate-500 text-xs'}>
              {acc.isActive ? '활성' : '비활성'}
            </span>
          </TableCell>
          {onToggle && (
            <TableCell>
              <button onClick={() => onToggle(acc.accountCode)} className="hover:opacity-70">
                {acc.isActive
                  ? <ToggleRight size={18} className="text-green-400" />
                  : <ToggleLeft size={18} className="text-slate-500" />}
              </button>
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
