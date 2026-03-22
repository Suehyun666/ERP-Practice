import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../api/dashboard.api';

export const useDashboard = (year: number, month: number) =>
  useQuery({
    queryKey: ['dashboard', year, month],
    queryFn: () => fetchDashboard(year, month),
  });
