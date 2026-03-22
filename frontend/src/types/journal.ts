export type JournalStatus = 'DRAFT' | 'POSTED' | 'CANCELLED';

export interface JournalLine {
  lineId: number;
  lineNo: number;
  accountCode: string;
  accountName: string;
  accountSide: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  description: string | null;
}

export interface Journal {
  journalId: number;
  journalNo: string;
  docDate: string;
  postDate: string;
  status: JournalStatus;
  description: string | null;
  createdBy: number;
  createdAt: string;
  lines: JournalLine[];
}

export interface JournalLineRequest {
  accountCode: string;
  accountSide: 'DEBIT' | 'CREDIT';
  amount: number;
  currency?: string;
  description?: string;
}

export interface JournalCreateRequest {
  docDate: string;
  postDate: string;
  description?: string;
  deptId?: number;
  lines: JournalLineRequest[];
}
