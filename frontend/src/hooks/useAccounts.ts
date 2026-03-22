import { useQuery } from '@tanstack/react-query';
import { fetchAccounts, fetchPostableAccounts, fetchAccountChildren } from '../api/accounts.api';

export const useAccounts = () =>
  useQuery({ queryKey: ['accounts'], queryFn: fetchAccounts });

export const usePostableAccounts = () =>
  useQuery({ queryKey: ['accounts', 'postable'], queryFn: fetchPostableAccounts });

export const useAccountChildren = (parentCode: string) =>
  useQuery({
    queryKey: ['accounts', 'children', parentCode],
    queryFn: () => fetchAccountChildren(parentCode),
    enabled: !!parentCode,
  });
