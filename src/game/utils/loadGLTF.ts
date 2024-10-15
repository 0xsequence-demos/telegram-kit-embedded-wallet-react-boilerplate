import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

const promises = new Map<string, Promise<GLTF>>();
const gltfs = new Map<string, GLTF>();

let loader: GLTFLoader | undefined;
export function loadGLTF(url: string) {
  if (gltfs.has(url)) {
    return new Promise<GLTF>((resolve) => {
      resolve(gltfs.get(url)!);
    });
  }
  if (promises.has(url)) {
    return promises.get(url)!;
  } else {
    const loadPromise = new Promise<GLTF>((resolveLoad) => {
      if (!loader) {
        loader = new GLTFLoader();
      }
      loader.load(url, (gltf) => {
        gltfs.set(url, gltf);
        resolveLoad(gltf);
      });
    });
    promises.set(url, loadPromise);
    return loadPromise;
  }
}
