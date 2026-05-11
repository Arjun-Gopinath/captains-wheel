import { describe, it, expect } from 'vitest';
import { computeObstacleSpeed, computeSpawnInterval, BASE_SPEED, BASE_INTERVAL } from '../../src/utils/speedScaler.js';

describe('computeObstacleSpeed', () => {
  it('returns base speed with no score and no time elapsed', () => {
    expect(computeObstacleSpeed(BASE_SPEED, 0, 0)).toBe(BASE_SPEED);
  });

  it('increases with score', () => {
    expect(computeObstacleSpeed(BASE_SPEED, 100, 0)).toBeGreaterThan(BASE_SPEED);
  });

  it('increases with elapsed time', () => {
    expect(computeObstacleSpeed(BASE_SPEED, 0, 30)).toBeGreaterThan(BASE_SPEED);
  });

  it('increases with both score and elapsed time', () => {
    const slow = computeObstacleSpeed(BASE_SPEED, 0, 0);
    const fast = computeObstacleSpeed(BASE_SPEED, 200, 60);
    expect(fast).toBeGreaterThan(slow);
  });
});

describe('computeSpawnInterval', () => {
  it('returns base interval with no score and no time elapsed', () => {
    expect(computeSpawnInterval(BASE_INTERVAL, 0, 0)).toBe(BASE_INTERVAL);
  });

  it('decreases with score', () => {
    expect(computeSpawnInterval(BASE_INTERVAL, 200, 0)).toBeLessThan(BASE_INTERVAL);
  });

  it('decreases with elapsed time', () => {
    expect(computeSpawnInterval(BASE_INTERVAL, 0, 30)).toBeLessThan(BASE_INTERVAL);
  });

  it('never goes below the minimum interval', () => {
    expect(computeSpawnInterval(BASE_INTERVAL, 999999, 99999)).toBeGreaterThan(0);
  });
});
