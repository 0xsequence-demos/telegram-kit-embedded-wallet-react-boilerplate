import { Object3D } from "three";

export type LimbDance = (
  limbTarget: Object3D,
  side: 1 | -1,
  time: number,
) => void;
