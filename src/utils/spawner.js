const TWO_PI = Math.PI * 2;

export function pickRandomAngle(randomFn = Math.random) {
  return randomFn() * TWO_PI;
}
