import { formatDate } from '../utils/format';

interface RefreshControlsProps {
  onRefresh: () => void;
  refreshing: boolean;
  lastUpdated: Date | null;
}

export function RefreshControls({ onRefresh, refreshing, lastUpdated }: RefreshControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface p-3">
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black disabled:cursor-wait disabled:opacity-60"
      >
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </button>
      <p className="text-xs text-muted">Last updated: {lastUpdated ? formatDate(lastUpdated.toISOString()) : 'Never'}</p>
    </div>
  );
}
