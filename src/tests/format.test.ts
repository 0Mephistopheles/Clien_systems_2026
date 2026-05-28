import { describe, expect, it } from 'vitest';
import { formatDate, formatNumber, initials, timeAgo } from '../utils/format';

describe('format helpers', () => {
  it('formats numbers', () => {
    expect(formatNumber(12345)).toContain('12,345');
  });

  it('builds initials', () => {
    expect(initials('Anna Spark')).toBe('AS');
  });

  it('formats dates and relative time', () => {
    expect(formatDate('2024-01-01T12:00:00Z')).toContain('2024');
    expect(timeAgo(new Date(Date.now() - 60_000))).toBe('1m ago');
  });
});
