import type { ReactNode } from 'react';

interface SectionPanelProps {
  title: string;
  children: ReactNode;
}

export function SectionPanel({ title, children }: SectionPanelProps) {
  return (
    <section className="space-y-3 rounded-lg border border-slate-800 bg-surface p-4">
      <h2 className="text-lg font-semibold text-accent">{title}</h2>
      {children}
    </section>
  );
}
