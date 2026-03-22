import api from './client';
import type { Journal, JournalCreateRequest } from '../types/journal';

export const fetchJournals = async (year: number, month: number): Promise<Journal[]> => {
  const { data } = await api.get('/journals', { params: { year, month } });
  return data;
};

export const fetchJournal = async (id: number): Promise<Journal> => {
  const { data } = await api.get(`/journals/${id}`);
  return data;
};

export const createJournal = async (req: JournalCreateRequest): Promise<Journal> => {
  const { data } = await api.post('/journals', req);
  return data;
};

export const postJournal = async (id: number): Promise<Journal> => {
  const { data } = await api.post(`/journals/${id}/post`);
  return data;
};

export const cancelJournal = async (id: number): Promise<Journal> => {
  const { data } = await api.post(`/journals/${id}/cancel`);
  return data;
};
