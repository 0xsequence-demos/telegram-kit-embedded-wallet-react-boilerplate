import { Memoizer } from "memoizer-ts";
import { PlaneGeometry, Vector3 } from "three";

export function createFlatRingGeometry(
  radiusOuter: number,
  radiusInner: number,
  segs: number,
) {
  const geo = new PlaneGeometry(100, 100, 1, segs);
  const posArr = geo.attributes.position.array;
  const tempPos = new Vector3();
  const increments = posArr.length / 6 - 1;
  for (let i3 = 0; i3 < posArr.length; i3 += 3) {
    const i = Math.floor(i3 / 6);
    const inner = i3 % 6 === 0;
    const a = (i / increments) * Math.PI * 2;
    tempPos.fromArray(posArr, i3);
    tempPos.multiplyScalar(2);
    const radius = inner ? radiusInner : radiusOuter;
    tempPos.x = Math.cos(a) * -radius;
    tempPos.y = Math.sin(a) * radius;
    tempPos.toArray(posArr, i3);
  }
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

export const getFlatRingGeometry = Memoizer.makeMemoized(
  createFlatRingGeometry,
);
