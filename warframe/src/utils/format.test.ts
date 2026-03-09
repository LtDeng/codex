import { describe, expect, it } from 'vitest';
import { safeText } from './format';

describe('safeText', () => {
  it('returns fallback when value missing', () => {
    expect(safeText(undefined, 'fallback')).toBe('fallback');
  });

  it('returns value string when present', () => {
    expect(safeText(5)).toBe('5');
  });
});
