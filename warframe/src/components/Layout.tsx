import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-slate-800 bg-surface/80 px-4 py-4 backdrop-blur md:px-6">
        <h1 className="text-xl font-semibold tracking-wide text-accent">Warframe Live Dashboard</h1>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:p-6">{children}</main>
    </div>
  );
}
