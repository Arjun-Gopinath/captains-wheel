import { describe, it, expect } from 'vitest';
import { isMatch } from '../../src/utils/matcher.js';

describe('isMatch', () => {
  it('returns true when both segments have the same label', () => {
    expect(isMatch({ label: 'RED' }, { label: 'RED' })).toBe(true);
  });

  it('returns false when segments have different labels', () => {
    expect(isMatch({ label: 'RED' }, { label: 'BLACK' })).toBe(false);
  });

  it('matches suit labels correctly', () => {
    expect(isMatch({ label: '♥' }, { label: '♥' })).toBe(true);
    expect(isMatch({ label: '♥' }, { label: '♦' })).toBe(false);
    expect(isMatch({ label: '♣' }, { label: '♠' })).toBe(false);
    expect(isMatch({ label: '♠' }, { label: '♠' })).toBe(true);
  });

  it('is case-sensitive', () => {
    expect(isMatch({ label: 'red' }, { label: 'RED' })).toBe(false);
  });
});
