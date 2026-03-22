import api from './client';
import type { Account } from '../types/account';

export const fetchAccounts = async (): Promise<Account[]> => {
  const { data } = await api.get('/accounts');
  return data;
};

export const fetchPostableAccounts = async (): Promise<Account[]> => {
  const { data } = await api.get('/accounts/postable');
  return data;
};

export const fetchAccountChildren = async (parentCode: string): Promise<Account[]> => {
  const { data } = await api.get(`/accounts/${parentCode}/children`);
  return data;
};
