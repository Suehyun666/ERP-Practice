
import { useQuery } from '@tanstack/react-query';
import { getJournals, getTrialBalance } from '../api/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { DollarSign, Activity, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  // OpenAPI /api/reports/trial-balance 연동
  const { data: tb, isLoading: isTbLoading, isError: isTbError } = useQuery({
    queryKey: ['trial-balance', year, month],
    queryFn: () => getTrialBalance(year, month),
    retry: 1
  });

  // OpenAPI /api/journals 연동
  const { data: journals, isLoading: isJournalsLoading } = useQuery({
    queryKey: ['journals', year, month],
    queryFn: () => getJournals(year, month),
    retry: 1
  });

  const totalDebit = tb?.totalDebit || 0;
  const totalCredit = tb?.totalCredit || 0;
  const balanceCheck = totalDebit === totalCredit;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Overview for {year}-{month.toString().padStart(2, '0')}. Backed by live API data.
          </p>
        </div>
      </div>

      {isTbError && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md p-4 flex items-start gap-3 text-red-600 dark:text-red-400">
          <AlertCircle size={20} className="mt-0.5" />
          <div>
            <h4 className="font-medium">Failed to fetch API Data</h4>
            <p className="text-sm mt-1">Make sure the Spring Boot backend is running on port 8080 and DB is connected.</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Activity size={18} className="text-primary-500" /> Total Debit (Dr.)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTbLoading ? <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" /> : (
              <h2 className="text-3xl font-bold">${totalDebit.toLocaleString()}</h2>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <DollarSign size={18} className="text-amber-500" /> Total Credit (Cr.)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTbLoading ? <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" /> : (
              <h2 className="text-3xl font-bold">${totalCredit.toLocaleString()}</h2>
            )}
          </CardContent>
        </Card>

        <Card className={balanceCheck && tb ? "border-green-500/50 relative overflow-hidden" : ""}>
          {balanceCheck && tb && <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />}
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              Balance Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTbLoading ? <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" /> : (
              <h2 className={`text-3xl font-bold ${balanceCheck ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {balanceCheck ? 'Balanced' : 'Imbalanced'}
              </h2>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Journals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Journal Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Journal No</TableHead>
                <TableHead>Doc Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isJournalsLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-8">Loading journals...</TableCell></TableRow>
              ) : journals?.length > 0 ? (
                journals.map((journal: any) => (
                  <TableRow key={journal.journalId}>
                    <TableCell className="font-medium text-primary-600 dark:text-primary-400">{journal.journalNo}</TableCell>
                    <TableCell>{journal.docDate}</TableCell>
                    <TableCell>{journal.description || 'No description'}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${journal.status === 'POSTED' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {journal.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                    No journals found for this period. Create one using the API.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
