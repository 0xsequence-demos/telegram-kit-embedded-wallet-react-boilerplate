import { Mesh, MeshStandardMaterial, Object3D } from "three";
import { getChamferedBoxGeometry } from "./geometry/chamferedBoxGeometry";

export default async function makeSequenceLogo() {
  const pivot = new Object3D();
  const roughness = 0.4;
  const base = new Mesh(
    await getChamferedBoxGeometry(10, 8, 60, 2),
    new MeshStandardMaterial({
      color: 0x171e2c,
      roughness,
      metalness: 1,
      emissive: 0x171e2c,
    }),
  );
  base.scale.z = 1 / 6;
  base.position.z = 4.5;
  pivot.add(base);

  //10 x 8
  const data = [
    [
      [0.5, 1, 0x4462fd],
      [4.5, 5, 0x56d2ff],
    ],
    [
      [2.5, 5, 0x8252ff],
      [6.5, 1, 0x54d1ff],
    ],
    [
      [0.5, 1, 0xcb59ec],
      [4.5, 5, 0x4a66fc],
    ],
  ];
  for (let iy = 0; iy < data.length; iy++) {
    const row = data[iy];
    for (let ix = 0; ix < row.length; ix++) {
      const element = row[ix];
      const rect = new Mesh(
        await getChamferedBoxGeometry(element[1], 1, 1, 0.5),
        new MeshStandardMaterial({
          color: element[2],
          roughness,
          metalness: 1,
          emissive: element[2],
        }),
      );
      rect.position.x = element[0] - 3.5;
      rect.position.y = iy * 2 - 2;
      rect.position.z = -0.5;
      pivot.add(rect);
    }
  }
  pivot.scale.setScalar(0.1);
  return pivot;
}
