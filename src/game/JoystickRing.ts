import { Mesh, MeshBasicMaterial, Object3D } from "three";
import { getFlatRingGeometry } from "./geometry/FlatRingGeometry";

export default class JoystickRing extends Mesh {
  inner: Object3D;
  constructor() {
    const mat = new MeshBasicMaterial({
      depthTest: false,
      depthWrite: false,
      opacity: 0.25,
      transparent: true,
    });
    super(getFlatRingGeometry(100, 80, 32), mat);
    const inner = new Mesh(getFlatRingGeometry(50, 20, 32), mat);
    this.add(inner);
    this.inner = inner;
  }
}
