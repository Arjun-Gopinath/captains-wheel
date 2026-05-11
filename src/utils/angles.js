const TWO_PI = Math.PI * 2;

export function normalizeAngle(angle) {
  return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
}

export function getPointerAngle(x, y, cx, cy) {
  return Math.atan2(y - cy, x - cx);
}

export function getSegmentIndexFacing(directionAngle, wheelAngle, segmentCount) {
  const relative = normalizeAngle(directionAngle - wheelAngle);
  return Math.floor(relative / (TWO_PI / segmentCount));
}

export function getEdgeSpawnPoint(angle, cx, cy, width, height) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const candidates = [];

  if (Math.abs(cos) > 1e-10) {
    const t = cos > 0 ? (width - cx) / cos : -cx / cos;
    if (t > 0) candidates.push(t);
  }

  if (Math.abs(sin) > 1e-10) {
    const t = sin > 0 ? (height - cy) / sin : -cy / sin;
    if (t > 0) candidates.push(t);
  }

  const t = Math.min(...candidates);
  return { x: cx + t * cos, y: cy + t * sin };
}

export function normalizeSpeedForDistance(speed, spawnX, spawnY, cx, cy) {
  const dist   = Math.hypot(spawnX - cx, spawnY - cy);
  const refDist = cx; // half canvas width — right-edge spawn is the reference
  return speed * (dist / refDist);
}
