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
