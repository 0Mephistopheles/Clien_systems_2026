import { describe, expect, it } from 'vitest';
import { readStorage, removeStorage, writeStorage } from '../utils/storage';

describe('storage helpers', () => {
  it('reads and writes values', () => {
    writeStorage('test:key', { hello: 'world' });
    expect(readStorage('test:key', null)).toEqual({ hello: 'world' });
    removeStorage('test:key');
    expect(readStorage('test:key', { ok: true })).toEqual({ ok: true });
  });
});
