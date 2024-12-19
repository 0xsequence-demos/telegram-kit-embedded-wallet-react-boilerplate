import { Mesh, MeshStandardMaterial, Object3D } from "three";
import { getChamferedCylinderGeometry } from "./geometry/chamferedCylinderGeometry";
import { randFloatSpread } from "three/src/math/MathUtils.js";

export default class Coin extends Object3D {
  rotOffset = Math.random() * Math.PI * 2;
  material: MeshStandardMaterial;
  constructor(shadows = false, gentle = false) {
    super();
    this.name = "coin";
    const g = getChamferedCylinderGeometry(0.8, 0.2, 16, 8, 0.05);
    const material = new MeshStandardMaterial({
      color: 0xffff2c,
      roughness: 0.125,
      metalness: 0.8,
    });
    const mesh = new Mesh(g, material);
    this.material = material;
    this.add(mesh);
    mesh.receiveShadow = shadows;
    mesh.castShadow = shadows;
    mesh.rotation.set(Math.PI * 0.5, 0, randFloatSpread(Math.PI * 2));
    if (gentle) {
      mesh.onBeforeRender = () => {
        const t = performance.now() * 0.001;
        mesh.rotation.z = t + this.rotOffset;
        // mesh.position.y = Math.sin(t * 0.75 + this.rotOffset) * 0.3;
      };
    } else {
      mesh.onBeforeRender = () => {
        const t = performance.now() * 0.01;
        mesh.rotation.z = t + this.rotOffset;
        mesh.position.y = Math.sin(t * 0.75 + this.rotOffset) * 0.3;
      };
    }
  }
}
