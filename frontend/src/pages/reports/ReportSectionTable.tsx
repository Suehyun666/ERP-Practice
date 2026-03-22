import type { FinancialSection } from '../../types/report';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { AmountDisplay } from '../../components/common/AmountDisplay';

interface Props {
  sections: FinancialSection[];
}

export const ReportSectionTable = ({ sections }: Props) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>계정코드</TableHead>
        <TableHead>계정명</TableHead>
        <TableHead className="text-right">금액</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sections.map((sec) => (
        <>
          <TableRow key={`sec-${sec.sectionName}`} className="bg-slate-800/50">
            <TableCell colSpan={2} className="font-semibold text-slate-200">{sec.sectionName}</TableCell>
            <TableCell className="text-right font-semibold">
              <AmountDisplay amount={sec.subtotal} />
            </TableCell>
          </TableRow>
          {sec.items.map((item) => (
            <TableRow key={item.accountCode}>
              <TableCell className="font-mono text-slate-400 pl-8">{item.accountCode}</TableCell>
              <TableCell className="pl-8">{item.accountName}</TableCell>
              <TableCell className="text-right"><AmountDisplay amount={item.amount} /></TableCell>
            </TableRow>
          ))}
        </>
      ))}
    </TableBody>
  </Table>
);
