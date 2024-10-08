import { Mesh, Object3D, Vector3 } from "three";
import Limb from "./Limb";
import { getProtoTargetMesh } from "./protoTargetMesh";
import { LimbDance } from "./LimbDance";
import { Dance } from "./Dance";
import { cos, sin } from "../math";

const secondaryTargets = {
  elbows: new Vector3(-15, 10, -10),
  knees: new Vector3(-3, 0, 10),
};

const limbNames = ["arm", "leg"];
const danceBasic: Dance = {
  arm: (target, side, time) => {
    time += (side * Math.PI) / 16;
    time += sin(time * 8 + 4) / 12;
    target.position.set(
      (sin(time * 8, 3) + 0.5) * side,
      cos(time * 16, 2) - 0.25,
      sin(time * 8, 2) * 0.2 - 0.5,
    );
    target.position.multiplyScalar(0.3);
  },
  leg: (target, side, time) => {
    const halfPhase = Math.PI * 0.25 * side;
    target.position.set(
      0,
      //   sin(time * 4, 8) * side * 0.4,
      Math.abs(cos(time * 16 + halfPhase, 0.5)) * 0.5 - 1.5,
      //   -0.25
      sin(time * 8 + halfPhase + Math.PI * 0.25, 3) * 0.6 - 0.25,
    );
    target.position.multiplyScalar(0.3);
  },
  head: function (head: Object3D, time: number): void {
    time *= 2;
    head.position.y = sin(time * 8, 2) * 0.1 + 2.2;
    head.rotation.x = cos(time * 8, 2) * 0.1;
    head.rotation.z = sin(time * 4, 2.5) * 0.2;
  },
  body: function (body: Object3D, time: number): void {
    body.rotation.x = cos(time * 8, 2) * 0.05 + 0.1;
    body.rotation.z = cos(-time * 4, 2) * 0.1;
    body.rotation.y = sin(-time * 4, 2) * 0.15;
  },
};

export default class Character {
  limbTargets: Object3D[] = [];
  head: Object3D;
  limbs: Limb[] = [];
  botPivot = new Object3D();
  constructor(piecesPool: Object3D, destination: Object3D) {
    destination.add(this.botPivot);
    this.head = getProtoTargetMesh().clone();
    const addLimb = (
      child: Mesh,
      flipJoint: boolean,
      side: 1 | -1,
      dance: LimbDance,
      ltDestination: Object3D,
      secondaryTarget: Vector3,
    ) => {
      const st = secondaryTarget.clone();
      st.x *= side;
      const limb = new Limb(child, flipJoint, side, dance, st);
      limb.mesh.position.x *= side;
      this.limbTargets.push(limb.targetHelper);
      ltDestination.add(limb.targetHelper);
      this.botPivot.add(limb.mesh);
      this.limbs.push(limb);
      limb.resetHelper();
    };
    for (const child of piecesPool.children) {
      if (limbNames.includes(child.name) && child instanceof Mesh) {
        const isLeg = child.name === "leg";
        const flipJoint = isLeg;
        const dance = isLeg ? danceBasic.leg : danceBasic.arm;
        const ltDestination = isLeg ? destination : this.botPivot;
        const st = isLeg ? secondaryTargets.knees : secondaryTargets.elbows;
        addLimb(child, flipJoint, 1, dance, ltDestination, st);
        addLimb(child, flipJoint, -1, dance, ltDestination, st);
      } else {
        const clone = child.clone(true);
        this.botPivot.add(clone);
        if (clone.name === "head") {
          this.head = clone;
          const mirrorThese: Object3D[] = [];
          clone.traverse((headNode) => {
            if (headNode.name.includes("eye")) {
              if (headNode.name !== "eye-happy") {
                headNode.visible = false;
              } else {
                mirrorThese.push(headNode);
              }
            }
          });
          for (const n of mirrorThese) {
            const n2 = n.clone();
            n2.position.x -= 0.6;
            n.parent!.add(n2);
          }
        }
      }
    }
  }
  update(time: number) {
    time *= 1.8 / 2;
    for (const limb of this.limbs) {
      limb.update(time);
    }
    danceBasic.body(this.botPivot, time);
    danceBasic.head(this.head, time);
  }
}
