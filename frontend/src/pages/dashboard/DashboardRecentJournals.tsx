import { useNavigate } from 'react-router-dom';
import type { Journal } from '../../types/journal';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/common/StatusBadge';

interface Props {
  journals: Journal[];
  isLoading: boolean;
}

export const DashboardRecentJournals = ({ journals, isLoading }: Props) => {
  const navigate = useNavigate();
  const recent = journals.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 전표</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>전표번호</TableHead>
              <TableHead>전표일</TableHead>
              <TableHead>설명</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-8">Loading...</TableCell></TableRow>
            ) : recent.length > 0 ? (
              recent.map((j) => (
                <TableRow key={j.journalId} className="cursor-pointer hover:bg-slate-800/50" onClick={() => navigate(`/journals/${j.journalId}`)}>
                  <TableCell className="font-mono text-primary-400">{j.journalNo}</TableCell>
                  <TableCell>{j.docDate}</TableCell>
                  <TableCell className="text-slate-400">{j.description ?? '-'}</TableCell>
                  <TableCell><StatusBadge status={j.status} /></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-8">전표가 없습니다.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
