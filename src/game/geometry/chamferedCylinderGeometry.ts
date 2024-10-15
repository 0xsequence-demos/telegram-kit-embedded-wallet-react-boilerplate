import { Memoizer } from "memoizer-ts";
import type { BufferGeometry } from "three";
import { LatheGeometry } from "three";
import { Vector2 } from "three";
import { lerp } from "../utils/math";

export function createChamferedCylinderGeometry(
  radius: number,
  height: number,
  resU: number,
  resV: number,
  spherifyB = 0.1,
  markForFlatShading = false,
): BufferGeometry {
  const points: Vector2[] = [];
  const spherify = spherifyB / radius;
  const heightDeltaHalf = height - radius;
  for (let i = 0; i <= resV; i++) {
    const a = (i / resV) * Math.PI;
    const v = new Vector2(Math.sin(a), -Math.cos(a));
    v.x = lerp(Math.sign(v.x), v.x, spherify);
    const sy = Math.sign(v.y);
    v.y = lerp(sy, v.y, spherify);
    v.multiplyScalar(radius);
    v.y += sy * heightDeltaHalf;
    points.push(v);
  }
  const last = points[points.length - 1].clone();
  last.x = 0;
  points.push(last);

  const geometry = new LatheGeometry(points, resU);
  geometry.userData.requestFlatShading = markForFlatShading;
  return geometry;
}

export const getChamferedCylinderGeometry = Memoizer.makeMemoized(
  createChamferedCylinderGeometry,
);
