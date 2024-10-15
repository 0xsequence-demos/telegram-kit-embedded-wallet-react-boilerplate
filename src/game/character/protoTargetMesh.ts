import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";

let protoTargetMesh: Mesh | undefined;
export function getProtoTargetMesh() {
  if (!protoTargetMesh) {
    protoTargetMesh = new Mesh(
      new SphereGeometry(0.1, 8, 6),
      new MeshBasicMaterial({ wireframe: true, color: 0xff0000 }),
    );
  }
  return protoTargetMesh!;
}
