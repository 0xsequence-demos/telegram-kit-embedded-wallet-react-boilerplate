import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  NoToneMapping,
  ReinhardToneMapping,
  type WebGLRenderer,
} from "three";
import { lerp } from "./utils/math";

const runTest = false;
export function initToneMapping(renderer: WebGLRenderer) {
  renderer.toneMapping = ReinhardToneMapping;
  renderer.toneMappingExposure = 2;
  if (!runTest) {
    return () => {
      //
    };
  }
  const tones = [
    NoToneMapping,
    ReinhardToneMapping,
    CineonToneMapping,
    ACESFilmicToneMapping,
  ];
  const exposureMin = 0.3;
  const exposureMax = 3;
  let tick = 0.1;
  const intervalId = setInterval(() => {
    tick += 0.2;
    const v1 = ~~tick % tones.length;
    const v2 = tick % 1;
    renderer.toneMapping = tones[v1];
    renderer.toneMappingExposure = lerp(exposureMin, exposureMax, v2);
  }, 2000);
  return () => {
    clearInterval(intervalId);
  };
}
