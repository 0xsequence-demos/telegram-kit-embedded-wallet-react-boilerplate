import { Mesh, Object3D, Vector3 } from "three";
import Limb from "./Limb";
import { getProtoTargetMesh } from "./protoTargetMesh";
import { charactetAnimations } from "./dances";
import { SubDanceLayer } from "./SubDanceLayer";
import AnimatedNumber from "../utils/AnimatedNumber";

const __tempNode = new Object3D();

const secondaryTargets = {
  elbows: new Vector3(-15, 10, 10),
  knees: new Vector3(-3, 0, 10),
};

const limbNames = ["arm", "leg"];
export default class Character {
  limbTargets: Object3D[] = [];
  head: Object3D;
  legs: Limb[] = [];
  eyes: Object3D[] = [];
  arms: Limb[] = [];
  botPivot = new Object3D();
  happiness = new AnimatedNumber(0, 0.02);
  running = new AnimatedNumber(0, 0.05);
  idling = new AnimatedNumber(0, 0.02);
  constructor(piecesPool: Object3D, destination: Object3D) {
    destination.add(this.botPivot);
    this.head = getProtoTargetMesh().clone();
    const addLimb = (
      child: Mesh,
      flipJoint: boolean,
      side: 1 | -1,
      ltDestination: Object3D,
      secondaryTarget: Vector3,
    ) => {
      const st = secondaryTarget.clone();
      st.x *= side;
      const limb = new Limb(child, flipJoint, side, st);
      limb.mesh.position.x *= side;
      this.limbTargets.push(limb.targetHelper);
      ltDestination.add(limb.targetHelper);
      this.botPivot.add(limb.mesh);
      limb.resetHelper();
      return limb;
    };
    for (const child of piecesPool.children) {
      if (limbNames.includes(child.name) && child instanceof Mesh) {
        const isLeg = child.name === "leg";
        const flipJoint = isLeg;
        const ltDestination = isLeg ? destination : this.botPivot;
        const st = isLeg ? secondaryTargets.knees : secondaryTargets.elbows;
        const left = addLimb(child, flipJoint, 1, ltDestination, st);
        const right = addLimb(child, flipJoint, -1, ltDestination, st);
        (isLeg ? this.legs : this.arms).push(left, right);
      } else {
        const clone = child.clone(true);
        this.botPivot.add(clone);
        if (clone.name === "head") {
          this.head = clone;
          const mirrorThese: Object3D[] = [];
          clone.traverse((headNode) => {
            if (headNode.name.includes("eye")) {
              mirrorThese.push(headNode);
              this.eyes.push(headNode);
              if (headNode.name !== "eye-happy") {
                headNode.visible = false;
              }
            }
          });
          for (const n of mirrorThese) {
            const n2 = n.clone();
            n2.position.x -= 0.6;
            n.parent!.add(n2);
            this.eyes.push(n2);
          }
        }
      }
    }
  }
  lastTime: number | undefined = undefined;
  update(time: number) {
    if (this.lastTime === undefined) {
      this.lastTime = time;
    }
    this.idling.update(time - this.lastTime);
    this.happiness.update(time - this.lastTime);
    this.running.update(time - this.lastTime);
    this.lastTime = time;
    const danceTime = time * (1.8 / 2);
    const danceBasic = charactetAnimations.danceBasic;
    const danceGreeting = charactetAnimations.greeting;
    const danceRunning = charactetAnimations.running;
    let weightDance = this.happiness.value * this.idling.value;
    let weightGreeting = 1 - weightDance;
    const weightRunning = this.running.value;
    weightDance *= 1 - weightRunning;
    weightGreeting *= 1 - weightRunning;
    const isHappy = weightDance > 0.5;
    const isBlinking = time % 1.5 < 0.125 || time % 3.3 < 0.125;
    const targetEyes = isHappy
      ? "eye-happy"
      : isBlinking
        ? "eye-blink"
        : "eye-normal";
    for (const eye of this.eyes) {
      eye.visible = eye.name === targetEyes;
    }
    for (const arm of this.arms) {
      arm.update(danceTime, [
        { weight: weightDance, dance: danceBasic.arm },
        { weight: weightGreeting, dance: danceGreeting.arm },
        { weight: weightRunning, dance: danceRunning.arm },
      ]);
    }
    for (const leg of this.legs) {
      leg.update(danceTime, [
        { weight: weightDance, dance: danceBasic.leg },
        { weight: weightGreeting, dance: danceGreeting.leg },
        { weight: weightRunning, dance: danceRunning.leg },
      ]);
    }
    applyDance(
      this.botPivot,
      [
        { weight: weightDance, dance: danceBasic.body },
        { weight: weightGreeting, dance: danceGreeting.body },
        { weight: weightRunning, dance: danceRunning.body },
      ],
      danceTime,
    );
    applyDance(
      this.head,
      [
        { weight: weightDance, dance: danceBasic.head },
        { weight: weightGreeting, dance: danceGreeting.head },
        { weight: weightRunning, dance: danceRunning.head },
      ],
      danceTime,
    );
  }
}

function applyDance(
  node: Object3D,
  danceLayers: SubDanceLayer[],
  time: number,
) {
  node.position.set(0, 0, 0);
  node.rotation.set(0, 0, 0);
  for (const danceLayer of danceLayers) {
    if (danceLayer.weight > 0) {
      __tempNode.position.set(0, 0, 0);
      __tempNode.rotation.x = 0;
      __tempNode.rotation.y = 0;
      __tempNode.rotation.z = 0;
      danceLayer.dance(__tempNode, time);
      __tempNode.position.multiplyScalar(danceLayer.weight);
      __tempNode.rotation.x *= danceLayer.weight;
      __tempNode.rotation.y *= danceLayer.weight;
      __tempNode.rotation.z *= danceLayer.weight;
      node.position.add(__tempNode.position);
      node.rotation.x += __tempNode.rotation.x;
      node.rotation.y += __tempNode.rotation.y;
      node.rotation.z += __tempNode.rotation.z;
    }
  }
}
