import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJournals, fetchJournal, createJournal, postJournal, cancelJournal } from '../api/journals.api';
import type { JournalCreateRequest } from '../types/journal';

export const useJournals = (year: number, month: number) =>
  useQuery({ queryKey: ['journals', year, month], queryFn: () => fetchJournals(year, month) });

export const useJournal = (id: number) =>
  useQuery({ queryKey: ['journal', id], queryFn: () => fetchJournal(id), enabled: !!id });

export const useCreateJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: JournalCreateRequest) => createJournal(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['journals'] }),
  });
};

export const usePostJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postJournal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['journals'] }),
  });
};

export const useCancelJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelJournal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['journals'] }),
  });
};
