export const BASE_SPEED    = 120;
export const BASE_INTERVAL = 2000;

const MIN_INTERVAL     = 500;
const SPEED_PER_POINT  = 0.05;
const SPEED_PER_SECOND = 2;
const INTERVAL_PER_POINT  = 0.5;
const INTERVAL_PER_SECOND = 10;

export function computeObstacleSpeed(baseSpeed, score, elapsedSeconds) {
  return baseSpeed + score * SPEED_PER_POINT + elapsedSeconds * SPEED_PER_SECOND;
}

export function computeSpawnInterval(baseInterval, score, elapsedSeconds) {
  const interval = baseInterval - score * INTERVAL_PER_POINT - elapsedSeconds * INTERVAL_PER_SECOND;
  return Math.max(MIN_INTERVAL, interval);
}
