import { describe, it, expect } from 'vitest';
import { normalizeAngle, getPointerAngle, getSegmentIndexFacing } from '../../src/utils/angles.js';

describe('normalizeAngle', () => {
  it('returns 0 for 0', () => {
    expect(normalizeAngle(0)).toBe(0);
  });

  it('normalizes a negative angle', () => {
    expect(normalizeAngle(-Math.PI)).toBeCloseTo(Math.PI);
  });

  it('normalizes an angle greater than 2π', () => {
    expect(normalizeAngle(3 * Math.PI)).toBeCloseTo(Math.PI);
  });

  it('keeps an angle already in [0, 2π) unchanged', () => {
    expect(normalizeAngle(Math.PI)).toBeCloseTo(Math.PI);
  });
});

describe('getPointerAngle', () => {
  it('returns 0 for a point directly to the right of center', () => {
    expect(getPointerAngle(110, 100, 100, 100)).toBeCloseTo(0);
  });

  it('returns π/2 for a point directly below center', () => {
    expect(getPointerAngle(100, 110, 100, 100)).toBeCloseTo(Math.PI / 2);
  });

  it('returns -π/2 for a point directly above center', () => {
    expect(getPointerAngle(100, 90, 100, 100)).toBeCloseTo(-Math.PI / 2);
  });

  it('returns π for a point directly to the left of center', () => {
    expect(getPointerAngle(90, 100, 100, 100)).toBeCloseTo(Math.PI);
  });
});

describe('getSegmentIndexFacing', () => {
  describe('with 2 segments', () => {
    it('returns 0 for direction aligned with wheel angle 0', () => {
      expect(getSegmentIndexFacing(0, 0, 2)).toBe(0);
    });

    it('returns 1 for direction at π with wheel angle 0', () => {
      expect(getSegmentIndexFacing(Math.PI, 0, 2)).toBe(1);
    });

    it('accounts for wheel rotation', () => {
      expect(getSegmentIndexFacing(Math.PI, Math.PI, 2)).toBe(0);
    });
  });

  describe('with 4 segments', () => {
    it('returns the correct segment index for each quadrant', () => {
      const h = Math.PI / 2;
      expect(getSegmentIndexFacing(0,       0, 4)).toBe(0);
      expect(getSegmentIndexFacing(h,       0, 4)).toBe(1);
      expect(getSegmentIndexFacing(Math.PI, 0, 4)).toBe(2);
      expect(getSegmentIndexFacing(3 * h,   0, 4)).toBe(3);
    });
  });
});
