import { Color, DoubleSide, Mesh, MeshStandardMaterial } from "three";
import { getChamferedBoxGeometry } from "./geometry/chamferedBoxGeometry";
import { lerp, wrapRange } from "./utils/math";
import { getSharedPlaneGeometry } from "./getSharedPlaneGeometry";
import { distPerTile } from "./constants";
import { randFloatSpread } from "three/src/math/MathUtils.js";
import Coin from "./Coin";
import { clamp } from "./clamp";

export function makeTile(ix: number, iy: number, coinStillAvailable?: boolean) {
  const x = ix * distPerTile;
  const y = iy * distPerTile;

  const mesh = new Mesh(
    getSharedPlaneGeometry(),
    new MeshStandardMaterial({
      color: new Color(
        0.3,
        lerp(((ix * 37 + iy * 19 + 9) % 10) / 10, 0.6, 0.8),
        0.2,
      ),
      roughness: 0.75,
      metalness: 0,
      emissive: 0x171e2c,
    }),
  );
  mesh.receiveShadow = true;
  getChamferedBoxGeometry(distPerTile, 2, distPerTile, 0.25).then(
    (g) => (mesh.geometry = g),
  );
  if (wrapRange(ix * 37 + iy * 19 + 18, 0, wrapRange(ix + iy, 11, 21)) === 0) {
    getChamferedBoxGeometry(4, 2, 4, 0.5).then((g) => {
      const leafMat = new MeshStandardMaterial({
        color: 0x17ae2c,
        roughness: 0.75,
        metalness: 0,
        emissive: 0x171e2c,
        side: DoubleSide,
      });
      for (let i = 0; i < 5; i++) {
        const leaves = new Mesh(g, leafMat);
        leaves.position.set(
          randFloatSpread(6),
          randFloatSpread(4) + 6,
          randFloatSpread(6),
        );
        leaves.rotation.set(
          randFloatSpread(1),
          randFloatSpread(1),
          randFloatSpread(1),
        );
        mesh.add(leaves);
        leaves.receiveShadow = true;
        leaves.castShadow = true;
      }
    });
    getChamferedBoxGeometry(1, 6, 1, 0.25).then((g) => {
      const trunk = new Mesh(
        g,
        new MeshStandardMaterial({
          color: 0x572e2c,
          roughness: 0.75,
          metalness: 0,
          emissive: 0x171e2c,
          side: DoubleSide,
        }),
      );
      trunk.name = "treeTrunk";
      trunk.position.set(randFloatSpread(1), 4, randFloatSpread(1));
      trunk.rotation.set(
        randFloatSpread(0.4),
        randFloatSpread(0.4),
        randFloatSpread(0.4),
      );
      mesh.add(trunk);
      trunk.receiveShadow = true;
      trunk.castShadow = true;
    });
    mesh.userData.tree = true;
  } else if (
    wrapRange(ix * 47 + iy * 19 + 91, 0, wrapRange(ix + iy, 24, 31)) < 3
  ) {
    getChamferedBoxGeometry(2, 1, 2, 0.25).then((g) => {
      const t = ((x * 17 + y * 9 + 21) % 5) + 2;
      const rockMat = new MeshStandardMaterial({
        color: 0x777e9c,
        roughness: 0.75,
        metalness: 0,
      });
      for (let i = 0; i < t; i++) {
        const rock = new Mesh(g, rockMat);
        rock.position.set(
          randFloatSpread(6),
          randFloatSpread(0.5) + 1,
          randFloatSpread(6),
        );
        rock.rotation.set(
          randFloatSpread(1),
          randFloatSpread(1),
          randFloatSpread(1),
        );
        rock.receiveShadow = true;
        rock.castShadow = true;
        mesh.add(rock);
      }
    });
  } else if (
    wrapRange(ix * 37 + iy * 9 + 31, 0, wrapRange(ix + iy, 17, 23)) < 1
  ) {
    const t2 =
      ((x * 17 + y * 9 + 21) % 5) +
      clamp(13 - Math.round(Math.abs(ix) + Math.abs(iy)), 0, 6);
    if (t2 > 0) {
      getChamferedBoxGeometry(2, 1.5, 2.5, 0.25, 0.375).then((g) => {
        const rockMat = new MeshStandardMaterial({
          color: 0x777e9c,
          roughness: 0.75,
          metalness: 0,
          side: DoubleSide,
        });
        const t = 8;
        for (let i = 0; i < t; i++) {
          for (let j = 0; j < t2; j++) {
            if (j <= 1 && i % 2 === 0) {
              continue;
            }
            const rock = new Mesh(g, rockMat);
            const a =
              (i / t) * Math.PI * 2 + (j >= 2 && j % 2 === 0 ? Math.PI / 8 : 0);
            rock.position.set(
              randFloatSpread(0.25) + Math.cos(a) * 3.25,
              randFloatSpread(0.15) + 1.7 + j * 1.5,
              randFloatSpread(0.25) + Math.sin(a) * 3.25,
            );
            rock.rotation.set(0, randFloatSpread(0.2) - a, 0);
            rock.receiveShadow = true;
            rock.castShadow = true;
            mesh.add(rock);
          }
        }
        const keyRock = new Mesh(g, rockMat);
        keyRock.position.set(0, 0.25, 0);
        keyRock.rotation.z = Math.PI * -0.5;
        mesh.add(keyRock);
        keyRock.name = "tower";
      });
      mesh.userData.tower = true;
    }
  } else if (
    coinStillAvailable &&
    wrapRange(ix * 53 + iy * 109 - 91, 0, wrapRange(ix - iy, 24, 31)) < 10
  ) {
    const coin = new Coin(true);
    coin.position.set(randFloatSpread(7), 3, randFloatSpread(7));
    mesh.add(coin);
    mesh.userData.coin = true;
    coin.receiveShadow = true;
    coin.castShadow = true;
  }
  mesh.position.set(x, -1, y);
  mesh.rotation.set(
    randFloatSpread(0.05),
    randFloatSpread(0.05),
    randFloatSpread(0.05),
  );
  mesh.scale.setScalar(0.001);
  return mesh;
}
