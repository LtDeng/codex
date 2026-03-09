import type { Cycle } from '../types/warframe';
import { safeText } from '../utils/format';
import { CountdownBadge } from './CountdownBadge';
import { StatusCard } from './StatusCard';

interface CycleCardProps {
  title: string;
  cycle: Cycle | null;
}

export function CycleCard({ title, cycle }: CycleCardProps) {
  return (
    <StatusCard title={title}>
      <p className="text-base font-medium">{safeText(cycle?.state ?? cycle?.shortString, 'Unavailable')}</p>
      <CountdownBadge value={cycle?.expiry} />
    </StatusCard>
  );
}
