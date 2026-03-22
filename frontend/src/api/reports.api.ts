import api from './client';
import type { TrialBalance, FinancialStatement } from '../types/report';

export const fetchTrialBalance = async (year: number, month: number): Promise<TrialBalance> => {
  const { data } = await api.get('/reports/trial-balance', { params: { year, month } });
  return data;
};

export const fetchBalanceSheet = async (year: number, month: number): Promise<FinancialStatement> => {
  const { data } = await api.get('/reports/balance-sheet', { params: { year, month } });
  return data;
};

export const fetchIncomeStatement = async (year: number, month: number): Promise<FinancialStatement> => {
  const { data } = await api.get('/reports/income-statement', { params: { year, month } });
  return data;
};
