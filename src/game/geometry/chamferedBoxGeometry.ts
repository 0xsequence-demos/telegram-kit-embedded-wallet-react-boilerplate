import { Memoizer } from "memoizer-ts";
import { Mesh, Vector3 } from "three";
import { loadGLTF } from "../utils/loadGLTF";

export async function createChamferedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  chamfer = 0.005,
) {
  const gltf = await loadGLTF("chamfered-box-base.glb");
  const proto = gltf.scene.children[0];
  if (!(proto instanceof Mesh)) {
    throw new Error("child is not a mesh");
  }
  const geo = proto.geometry.clone();
  const posArr = geo.attributes.position.array;
  const tempPos = new Vector3();
  const halfWidth = width * 0.5 - chamfer;
  const halfHeight = height * 0.5 - chamfer;
  const halfDepth = depth * 0.5 - chamfer;
  for (let i3 = 0; i3 < posArr.length; i3 += 3) {
    tempPos.fromArray(posArr, i3);
    tempPos.multiplyScalar(chamfer);
    tempPos.x += halfWidth * Math.sign(tempPos.x);
    tempPos.y += halfHeight * Math.sign(tempPos.y);
    tempPos.z += halfDepth * Math.sign(tempPos.z);
    tempPos.toArray(posArr, i3);
  }
  return geo;
}

export const getChamferedBoxGeometry = Memoizer.makeMemoized(
  createChamferedBoxGeometry,
);
