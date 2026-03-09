export function safeText(value: string | number | null | undefined, fallback = 'Unknown'): string {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  return String(value);
}

export function formatDate(value?: string): string {
  if (!value) {
    return 'Unknown time';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }

  return date.toLocaleString();
}

export function relativeTime(value?: string): string {
  if (!value) {
    return 'unknown';
  }

  const target = new Date(value).getTime();
  if (Number.isNaN(target)) {
    return 'unknown';
  }

  const diffMs = target - Date.now();
  const absMin = Math.floor(Math.abs(diffMs) / 60000);
  const days = Math.floor(absMin / (60 * 24));
  const hours = Math.floor((absMin % (60 * 24)) / 60);
  const mins = absMin % 60;

  const parts = [days ? `${days}d` : '', hours ? `${hours}h` : '', `${mins}m`].filter(Boolean).join(' ');

  return diffMs >= 0 ? `ends in ${parts}` : `${parts} ago`;
}

export function isUrgent(value?: string, thresholdMinutes = 30): boolean {
  if (!value) {
    return false;
  }

  const target = new Date(value).getTime();
  if (Number.isNaN(target)) {
    return false;
  }

  const diffMinutes = (target - Date.now()) / 60000;
  return diffMinutes > 0 && diffMinutes <= thresholdMinutes;
}
