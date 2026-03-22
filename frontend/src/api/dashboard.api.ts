import api from './client';

export interface MonthKpi {
  year: number;
  month: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  cashBalance: number;
  arBalance: number;
  draftCount: number;
  postedCount: number;
}

export interface MonthTrend {
  month: number;
  revenue: number;
  expenses: number;
  netIncome: number;
}

export interface AccountKpi {
  accountName: string;
  amount: number;
}

export interface DashboardData {
  currentMonth: MonthKpi;
  monthlyTrend: MonthTrend[];
  topExpenses: AccountKpi[];
}

export const fetchDashboard = async (year: number, month: number): Promise<DashboardData> => {
  const { data } = await api.get<DashboardData>('/dashboard', { params: { year, month } });
  return data;
};
