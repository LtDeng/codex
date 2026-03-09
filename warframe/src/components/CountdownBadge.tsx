import { relativeTime } from '../utils/format';

interface CountdownBadgeProps {
  value?: string;
  urgent?: boolean;
}

export function CountdownBadge({ value, urgent = false }: CountdownBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs ${urgent ? 'bg-danger text-white' : 'bg-slate-700 text-slate-100'}`}>
      {relativeTime(value)}
    </span>
  );
}
