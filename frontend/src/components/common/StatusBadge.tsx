import type { JournalStatus } from '../../types/journal';

const styles: Record<JournalStatus, string> = {
  DRAFT:     'bg-slate-700 text-slate-300',
  POSTED:    'bg-green-500/10 text-green-400 border border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const labels: Record<JournalStatus, string> = {
  DRAFT: 'DRAFT', POSTED: 'POSTED', CANCELLED: 'CANCELLED',
};

export const StatusBadge = ({ status }: { status: JournalStatus }) => (
  <span className={`px-2.5 py-1 text-xs rounded-full font-medium tracking-wide ${styles[status]}`}>
    {labels[status]}
  </span>
);
