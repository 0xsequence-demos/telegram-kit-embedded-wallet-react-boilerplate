import { Memoizer } from "memoizer-ts";
import { BufferGeometry, Mesh, Vector3 } from "three";
import { loadGLTF } from "../utils/loadGLTF";

export async function createChamferedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  chamfer = 0.005,
  bias = 0,
) {
  const gltf = await loadGLTF("chamfered-box-base.glb");
  const proto = gltf.scene.children[0];
  if (!(proto instanceof Mesh)) {
    throw new Error("child is not a mesh");
  }
  const geo = proto.geometry.clone();
  if (!(geo instanceof BufferGeometry)) {
    throw new Error("mesh geometry is unexpected type");
  }
  const posArr = geo.attributes.position.array;
  const tempPos = new Vector3();
  const halfWidth = width * 0.5 - chamfer;
  const halfHeight = height * 0.5 - chamfer;
  const halfDepth = depth * 0.5 - chamfer;
  for (let i3 = 0; i3 < posArr.length; i3 += 3) {
    tempPos.fromArray(posArr, i3);
    const b = bias * Math.sign(tempPos.z);
    tempPos.multiplyScalar(chamfer);
    const sz = Math.sign(tempPos.x);
    tempPos.x += halfWidth * Math.sign(tempPos.x);
    tempPos.y += halfHeight * Math.sign(tempPos.y);
    tempPos.z += halfDepth * Math.sign(tempPos.z) + b * sz;
    tempPos.toArray(posArr, i3);
  }
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

export const getChamferedBoxGeometry = Memoizer.makeMemoized(
  createChamferedBoxGeometry,
);
