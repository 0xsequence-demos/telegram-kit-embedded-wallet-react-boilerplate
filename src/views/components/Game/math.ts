export function unlerp(min: number, max: number, value: number) {
  return (value - min) / (max - min);
}

export function unlerpClamped(min: number, max: number, value: number) {
  return clamp(unlerp(min, max, value), 0, 1);
}

export function unlerpClamped01(min: number, max: number, value: number) {
  return clamp01(unlerp(min, max, value));
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
