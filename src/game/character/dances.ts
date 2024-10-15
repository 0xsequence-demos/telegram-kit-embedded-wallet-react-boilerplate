import { Object3D } from "three";
import { Dance } from "./Dance";
import { clamp01, cos, sin } from "../utils/math";
import { Easing } from "../utils/easing";

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
    body.position.y = Math.abs(cos(time * 16, 0.5)) * 0.1;
  },
};

const greeting: Dance = {
  arm: (target, side, time) => {
    let wtime = time + (side * Math.PI) / 16;
    wtime += sin(wtime * 8 + 4) / 12;
    target.position.set(
      (sin(-wtime * 1, 1.5) - 0.1) * side * 0.2,
      cos(wtime * 2, 1.5) * 0.1 - 1.3,
      sin(wtime * 2, 1.5) * 0.2 - 0.5,
    );
    const lift = Easing.Quintic.InOut(clamp01(2 - Math.abs(3 - (time % 8))));
    const waveHello = Easing.Quintic.InOut(
      clamp01(1.85 - Math.abs(3 - (time % 8))),
    );
    if (side === 1) {
      target.position.x += 1.2 * lift + sin(time * 25) * waveHello;
      target.position.y += 2 * lift + sin(time * 25) * -0.2 * waveHello;
      target.position.z += -0.5 * lift;
    }
    target.position.multiplyScalar(0.3);
  },
  leg: (target) => {
    target.position.set(0, -1.4, 0);
    target.position.multiplyScalar(0.3);
  },
  head: function (head: Object3D, time: number): void {
    time *= 2;
    head.position.y = sin(time * 1, 0.5) * 0.1 + 2.2;
    head.rotation.z = sin(time * 0.25, 0.25) * 0.2;
    head.rotation.y = sin(time * 0.25, 0.125) * 0.5;
  },
  body: function (body: Object3D, time: number): void {
    time += Math.sin(time * 2) * 0.25;
    body.rotation.x = cos(time * 0.75, 0.125) * 0.05 + 0.1;
    body.rotation.z = sin(-time * 1, 0.125) * 0.1;
    body.rotation.y = sin(-time * 1, 0.125) * 0.15;
  },
};

export const charactetAnimations = {
  danceBasic,
  greeting,
};
