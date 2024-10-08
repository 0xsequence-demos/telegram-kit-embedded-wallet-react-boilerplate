import { AxesHelper, Mesh, Object3D, Vector3 } from "three";
import { unlerpClamped01 } from "../math";
import { getProtoTargetMesh } from "./protoTargetMesh";
import { LimbDance } from "./LimbDance";

const searchParams = new URLSearchParams(window.location.search);
const debug = searchParams.has("debug");
const __tempVec3 = new Vector3();
const __tempVec3B = new Vector3();

export default class Limb {
  mesh: Mesh;
  targetHelper: Object3D;
  constructor(
    templateMesh: Mesh,
    flipJoint = false,
    public side: 1 | -1,
    private _dance: LimbDance,
    private _secondaryTarget: Vector3,
  ) {
    this.mesh = templateMesh.clone();
    this.mesh.up.set(0, flipJoint ? 1 : -1, 0);
    this.targetHelper = new Object3D();
    if (debug) {
      this.mesh.add(new AxesHelper(0.5));
      this.targetHelper.add(getProtoTargetMesh().clone());
    }
  }
  resetHelper() {
    this.targetHelper.position.copy(this.mesh.position);
  }
  update(time: number) {
    this._dance(this.targetHelper, this.side, time);
    this.targetHelper.position.add(this.mesh.position);
    // this.targetHelper.position.set(0,Math.cos(time * 2),Math.sin(time * 1.5) - 1.4)
    __tempVec3.set(0, 0, 0);
    this.targetHelper.localToWorld(__tempVec3);
    if (this.mesh.morphTargetInfluences) {
      __tempVec3B.copy(__tempVec3);
      this.mesh.worldToLocal(__tempVec3B);
      const dist = __tempVec3B.length();
      const ratio = 1 - unlerpClamped01(0.2, 0.5, dist);
      const qTime = ratio * 3;
      this.mesh.morphTargetInfluences[0] = Math.max(0, 1 - Math.abs(qTime - 1));
      this.mesh.morphTargetInfluences[1] = Math.max(0, 1 - Math.abs(qTime - 2));
      this.mesh.morphTargetInfluences[2] = Math.max(0, 1 - Math.abs(qTime - 3));
    }
    this.mesh.lookAt(__tempVec3);
    this.mesh.updateMatrixWorld();
    __tempVec3.copy(this._secondaryTarget);
    this.mesh.worldToLocal(__tempVec3);
    const a = Math.atan2(__tempVec3.y, __tempVec3.x) + Math.PI * 0.5;
    this.mesh.rotateZ(a);
    this.mesh.rotateX(Math.PI * -0.5);
  }
}
