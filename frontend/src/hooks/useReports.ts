import { useQuery } from '@tanstack/react-query';
import { fetchTrialBalance, fetchBalanceSheet, fetchIncomeStatement } from '../api/reports.api';

export const useTrialBalance = (year: number, month: number) =>
  useQuery({ queryKey: ['trial-balance', year, month], queryFn: () => fetchTrialBalance(year, month) });

export const useBalanceSheet = (year: number, month: number) =>
  useQuery({ queryKey: ['balance-sheet', year, month], queryFn: () => fetchBalanceSheet(year, month) });

export const useIncomeStatement = (year: number, month: number) =>
  useQuery({ queryKey: ['income-statement', year, month], queryFn: () => fetchIncomeStatement(year, month) });
