import { describe, expect, it } from 'vitest';
import { isStrongPassword, isValidEmail, isValidRoomCode, isValidUsername } from '../utils/validation';

describe('validation helpers', () => {
  it('validates common email formats', () => {
    expect(isValidEmail('player@example.com')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
  });

  it('validates usernames', () => {
    expect(isValidUsername('arena_runner')).toBe(true);
    expect(isValidUsername('x')).toBe(false);
  });

  it('validates passwords', () => {
    expect(isStrongPassword('Strong123')).toBe(true);
    expect(isStrongPassword('weak')).toBe(false);
  });

  it('validates room codes', () => {
    expect(isValidRoomCode('AX92QZ')).toBe(true);
    expect(isValidRoomCode('bad')).toBe(false);
  });
});
