import { BufferGeometry, PlaneGeometry } from "three";

let planeGeo: BufferGeometry | undefined;
export function getSharedPlaneGeometry() {
  if (!planeGeo) {
    planeGeo = new PlaneGeometry(0.1, 0.1);
  }
  return planeGeo;
}
