import { useNavigate } from 'react-router-dom';
import type { Journal } from '../../types/journal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AmountDisplay } from '../../components/common/AmountDisplay';

interface Props {
  journals: Journal[];
}

export const JournalTable = ({ journals }: Props) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>전표번호</TableHead>
          <TableHead>전표일</TableHead>
          <TableHead>설명</TableHead>
          <TableHead className="text-right">차변합계</TableHead>
          <TableHead className="text-right">대변합계</TableHead>
          <TableHead>상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {journals.map((j) => {
          const debits  = j.lines.filter((l) => l.accountSide === 'DEBIT').reduce((s, l) => s + l.amount, 0);
          const credits = j.lines.filter((l) => l.accountSide === 'CREDIT').reduce((s, l) => s + l.amount, 0);
          return (
            <TableRow
              key={j.journalId}
              className="cursor-pointer hover:bg-slate-800/50"
              onClick={() => navigate(`/journals/${j.journalId}`)}
            >
              <TableCell className="font-mono text-slate-300">{j.journalNo}</TableCell>
              <TableCell>{j.docDate}</TableCell>
              <TableCell className="text-slate-400">{j.description ?? '-'}</TableCell>
              <TableCell className="text-right"><AmountDisplay amount={debits} /></TableCell>
              <TableCell className="text-right"><AmountDisplay amount={credits} /></TableCell>
              <TableCell><StatusBadge status={j.status} /></TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
