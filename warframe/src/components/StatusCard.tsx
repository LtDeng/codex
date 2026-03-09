import type { ReactNode } from 'react';

interface StatusCardProps {
  title: string;
  children: ReactNode;
  urgent?: boolean;
}

export function StatusCard({ title, children, urgent = false }: StatusCardProps) {
  return (
    <article
      className={`rounded-lg border p-4 shadow-sm ${
        urgent ? 'border-danger/70 bg-danger/10' : 'border-slate-800 bg-surface'
      }`}
    >
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{title}</h3>
      <div className="space-y-1 text-sm">{children}</div>
    </article>
  );
}
