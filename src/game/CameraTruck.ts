import { Object3D, PerspectiveCamera } from "three";

export default class CameraTruck extends Object3D {
  virtualPivot: Object3D;
  constructor(camera: PerspectiveCamera, camDist: number, boomDist: number) {
    super();
    const virtualPivot = new Object3D();
    this.virtualPivot = virtualPivot;
    this.add(virtualPivot);
    this.rotation.order = "YXZ";
    camera.position.z = 0;
    virtualPivot.position.z = 0;
    this.position.z = -boomDist;
    this.position.y = 0.5;
    camera.rotateY(Math.PI);
    camera.position.z = -camDist;
    this.add(camera);
  }
}
