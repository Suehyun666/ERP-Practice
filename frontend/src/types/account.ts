export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export type AccountSide = 'DEBIT' | 'CREDIT';

export interface Account {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  normalSide: AccountSide;
  parentCode: string | null;
  isDetail: boolean;
  isActive: boolean;
}
