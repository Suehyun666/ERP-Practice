import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children?: ReactNode;
}

export const PageHeader = ({ title, description, children }: Props) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-100">{title}</h1>
      {description && <p className="text-slate-400 mt-1 text-sm">{description}</p>}
    </div>
    {children && <div className="flex items-center gap-2">{children}</div>}
  </div>
);
