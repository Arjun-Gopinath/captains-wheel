export function isMatch(wheelSegment, obstacleSegment) {
  if (obstacleSegment.wildcard) return true;
  return wheelSegment.label === obstacleSegment.label;
}
