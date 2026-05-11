import { describe, it, expect } from 'vitest';
import { pickRandomAngle } from '../../src/utils/spawner.js';

describe('pickRandomAngle', () => {
  it('returns 0 when random is 0', () => {
    expect(pickRandomAngle(() => 0)).toBeCloseTo(0);
  });

  it('returns π when random is 0.5', () => {
    expect(pickRandomAngle(() => 0.5)).toBeCloseTo(Math.PI);
  });

  it('returns close to 2π when random approaches 1', () => {
    expect(pickRandomAngle(() => 0.999)).toBeCloseTo(Math.PI * 2 * 0.999);
  });

  it('stays within [0, 2π)', () => {
    for (let i = 0; i < 20; i++) {
      const angle = pickRandomAngle(Math.random);
      expect(angle).toBeGreaterThanOrEqual(0);
      expect(angle).toBeLessThan(Math.PI * 2);
    }
  });
});
