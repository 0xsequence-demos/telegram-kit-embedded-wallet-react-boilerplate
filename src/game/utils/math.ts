export function lerp(a: number, b: number, dt: number) {
  const out = a + dt * (b - a);
  return Math.abs(b - out) > 0.00001 ? out : b;
}

export function unlerp(min: number, max: number, value: number) {
  return (value - min) / (max - min);
}

export function unlerpClamped(min: number, max: number, value: number) {
  return clamp(unlerp(min, max, value), 0, 1);
}

export function unlerpClamped01(min: number, max: number, value: number) {
  return clamp01(unlerp(min, max, value));
}

export function remap(
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
  v: number,
) {
  const r = unlerp(fromMin, fromMax, v);
  return lerp(toMin, toMax, r);
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

export function clamp01(val: number) {
  return Math.min(1, Math.max(0, val));
}

export function sin(val: number, snappiness = 1) {
  const v = Math.sin(val);
  const s = Math.sign(v);
  return Math.pow(Math.abs(v), 1 / snappiness) * s;
}
const TAU = Math.PI * 0.5;
export function cos(val: number, snappiness = 1) {
  return sin(val + TAU, snappiness);
}

export function wrapRange(val: number, min: number, max: number) {
  const v1 = val - min;
  const r = max - min;
  const result = (((v1 % r) + r) % r) + min;
  return result;
}
// console.log(wrapRange(-0.5, 1, 3));
// console.log(wrapRange(2.95, 1, 3));

export function dist2(x: number, y: number) {
  return Math.sqrt(x * x + y * y);
}
