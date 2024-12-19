import { Vector3 } from "three";

export function xzDist(from: Vector3, to: Vector3) {
  const dx = from.x - to.x;
  const dz = from.z - to.z;
  return Math.sqrt(dx * dx + dz * dz);
}
