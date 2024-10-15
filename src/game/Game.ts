import {
  Color,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from "three";
import Character from "./character/Character";
import makeSequenceLogo from "./makeSequenceLogo";
import AnimatedNumber from "./utils/AnimatedNumber";
import { loadGLTF } from "./utils/loadGLTF";
import { Easing } from "./utils/easing";
import { lerp } from "./utils/math";

const LIGHT_COLOR_SKY = 0xffffff;
const LIGHT_COLOR_GROUND = 0xafafaf;

const __tempColor = new Color();
const __tempColor2 = new Color();
export default class Game {
  paused = false;
  party: boolean = false;
  character: Character | undefined;

  constructor() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const lightAmbient = new HemisphereLight(
      LIGHT_COLOR_SKY,
      LIGHT_COLOR_GROUND,
      2,
    );
    const lightDirect = new SpotLight(0xffffff, 200, 20, Math.PI / 12);
    lightDirect.castShadow = true;
    lightDirect.shadow.mapSize.setScalar(1024);
    lightDirect.shadow.autoUpdate = true;
    lightDirect.shadow.bias = -0.0005;
    scene.add(lightAmbient);
    scene.add(lightDirect);
    makeSequenceLogo().then((logo) => {
      logo.position.set(0, -1.9, -2);
      logo.scale.multiplyScalar(5);
      scene.add(logo);
    });
    const floor = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshStandardMaterial({ color: 0x7f7f7f }),
    );
    floor.receiveShadow = true;
    floor.position.y = 0.1;
    floor.rotation.x = Math.PI * -0.5;
    // scene.add(floor);
    lightDirect.position.set(7, 7, -7);
    lightDirect.lookAt(new Vector3(0, 0, 0));
    loadGLTF("quinn-the-bot.glb").then((gltf) => {
      gltf.scene.traverse((n) => {
        n.receiveShadow = true;
        n.castShadow = true;
      });
      this.character = new Character(gltf.scene, scene);
    });

    const boom = new Object3D();
    boom.rotation.order = "YXZ";
    scene.add(boom);
    camera.position.z = -12;
    boom.position.y = 1.75;
    camera.rotateY(Math.PI);
    boom.add(camera);
    const partyFloat = new AnimatedNumber(0, 0.01);
    let lastTime = performance.now() * 0.001;
    this.render = (renderer: WebGLRenderer) => {
      if (this.paused) {
        return;
      }
      const time = performance.now() * 0.001;
      const deltaTime = time - lastTime;
      lastTime = time;
      if (this.character) {
        this.character.happiness.target = this.party ? 1 : 0;
        this.character.update(time);
      }
      lightAmbient.color.set(LIGHT_COLOR_SKY);
      lightAmbient.groundColor.set(LIGHT_COLOR_GROUND);
      partyFloat.target = this.party ? 1 : 0;
      partyFloat.update(deltaTime);
      const partyAnim = Easing.Quadratic.InOut(partyFloat.value);
      camera.position.z = lerp(-12, -4, partyAnim);
      if (partyAnim > 0.001) {
        __tempColor.setHSL(time * 0.5, 0.5, 0.75);
        lightAmbient.color.lerp(__tempColor, partyAnim);
        __tempColor2.setHSL(time * 0.5 - 0.1, 0.8, 0.2);
        lightAmbient.groundColor.lerp(__tempColor2, partyAnim);
      }
      __tempColor.set(0x3f3f3f).lerp(__tempColor2, partyAnim);
      renderer.setClearColor(__tempColor.getHex());
      renderer.render(scene, camera);
    };
    window.addEventListener("resize", (ev) => {
      void ev;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
    let usingTouch = false;
    window.addEventListener("mousemove", (ev) => {
      if (usingTouch) {
        return;
      }
      boom.rotation.y = (ev.clientX / window.innerWidth - 0.5) * 1;
      boom.rotation.x = -(ev.clientY / window.innerHeight - 0.5) * 0.5;
    });
    window.addEventListener("touchstart", (ev) => {
      void ev;
      usingTouch = true;
    });
  }

  render: (renderer: WebGLRenderer) => void;

  cleanup() {}
}
