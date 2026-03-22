export interface TrialBalanceRow {
  accountCode: string;
  accountName: string;
  accountType: string;
  openingBalance: number;
  debitTotal: number;
  creditTotal: number;
  closingBalance: number;
}

export interface TrialBalance {
  fiscalYear: number;
  fiscalMonth: number;
  generatedAt: string;
  isBalanced: boolean;
  totalDebit: number;
  totalCredit: number;
  rows: TrialBalanceRow[];
}

export interface FinancialItem {
  accountCode: string;
  accountName: string;
  amount: number;
}

export interface FinancialSection {
  sectionName: string;
  items: FinancialItem[];
  subtotal: number;
}

export interface FinancialStatement {
  statementType: string;
  fiscalYear: number;
  fiscalMonth: number;
  generatedAt: string;
  sections: FinancialSection[];
}
