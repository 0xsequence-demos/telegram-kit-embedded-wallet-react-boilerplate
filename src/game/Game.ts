import {
  CameraHelper,
  CircleGeometry,
  Color,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import Character from "./character/Character";
import makeSequenceLogo from "./makeSequenceLogo";
import AnimatedNumber from "./utils/AnimatedNumber";
import { loadGLTF } from "./utils/loadGLTF";
import { Easing } from "./utils/easing";
import { dist2, lerp, remap } from "./utils/math";
import { clamp } from "./clamp";
import { searchParams } from "./character/searchParams";
import { makeTile } from "./makeTile";
import {
  distPerTile,
  mapReachDist,
  mapReachTiles,
  sunDist,
  uiCoinScreenX,
  uiCoinScreenY,
} from "./constants";
import { removeFromArray } from "./removeFromArray";
import Coin from "./Coin";
import CameraTruck from "./CameraTruck";
import Animation from "./Animation";
import { xzDist } from "./utils/xzDist";
import JoystickRing from "./JoystickRing";

const debug = searchParams.has("debug");
const mouseTouch = searchParams.has("mouseTouch");

const LIGHT_COLOR_SKY = 0xffffff;
const LIGHT_COLOR_GROUND = 0xafafaf;

const __tempColor = new Color();
const __tempColor2 = new Color();
export default class Game {
  paused = false;
  party: boolean = false;
  character: Character | undefined;
  partyFloat = new AnimatedNumber(0, 0.01);
  charHolder: Object3D;
  camera: PerspectiveCamera;
  camTruck: CameraTruck;
  private _coinBalance = 0;
  usingTouch = false;
  uiCoin: Coin;
  keysDown = new Map<string, boolean>();
  scene: Scene;
  uiCamera: OrthographicCamera;
  uiScene: Scene;
  worldspaceUiCoinTarget: Object3D;
  activeTouchIds: number[] = [];
  idledTime = 10;

  public get coinBalance() {
    return this._coinBalance;
  }
  public set coinBalance(value) {
    this._coinBalance = value;
    if (this.onCoinBalanceChange) {
      this.onCoinBalanceChange(value);
    }
  }
  onCoinBalanceChange: ((v: number) => void) | undefined;

  constructor() {
    const uiScene = new Scene();
    const uiCamera = new OrthographicCamera(0, 1920, 1080, 0, -1000, 1000);
    uiScene.add(uiCamera);
    this.uiScene = uiScene;
    this.uiCamera = uiCamera;
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.scene = scene;
    this.camera = camera;
    const cookieCutter = new Mesh(
      new CircleGeometry(0.02),
      new MeshBasicMaterial({
        colorWrite: false,
        // alphaHash: true,
        // opacity: 0.75,
      }),
    );
    this.camera.add(cookieCutter);
    cookieCutter.position.y = -0.04;
    cookieCutter.position.z = -0.1;
    const camDist = 4;
    const boomDist = 8;
    const camTruck = new CameraTruck(camera, camDist, boomDist);
    this.camTruck = camTruck;
    scene.add(camTruck);
    const lightAmbient = new HemisphereLight(
      LIGHT_COLOR_SKY,
      LIGHT_COLOR_GROUND,
      2,
    );
    const worldspaceUiCoinTarget = new Mesh(
      new SphereGeometry(1, 16, 8),
      new MeshBasicMaterial({
        wireframe: true,
        color: 0xff0000,
        visible: false,
      }),
    );
    this.worldspaceUiCoinTarget = worldspaceUiCoinTarget;
    scene.add(worldspaceUiCoinTarget);
    camera.updateProjectionMatrix();
    const sun = new DirectionalLight(0xffffff, 2);
    sun.position.set(sunDist, sunDist, 0);
    sun.lookAt(new Vector3(0, 0, 0));
    const uiSun = sun.clone();
    uiSun.position.set(50, 7, 0);
    uiSun.lookAt(new Vector3(0, 0, 0));
    uiScene.add(uiSun);
    const uiLightAmbient = lightAmbient.clone();
    uiScene.add(uiLightAmbient);
    sun.castShadow = true;
    sun.shadow.camera.far = sunDist * 2;
    if (debug) {
      const dlh = new DirectionalLightHelper(sun);
      const dlh2 = new CameraHelper(sun.shadow.camera);
      scene.add(dlh);
      scene.add(dlh2);
    }
    const uiCoin = new Coin(false, true);
    uiCoin.material.depthTest = false;
    this.uiCoin = uiCoin;
    uiScene.add(uiCoin);
    uiCoin.scale.setScalar(50);
    this.updateUiCoinTarget();
    this.updateScreen();
    const d = mapReachDist * 0.5;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = -d;
    sun.shadow.camera.bottom = d;
    sun.shadow.mapSize.setScalar(1024);
    sun.shadow.autoUpdate = true;
    sun.shadow.bias = -0.0005;
    scene.add(sun.target);
    scene.add(lightAmbient);
    scene.add(sun);
    const logoHolder = new Object3D();
    scene.add(logoHolder);
    makeSequenceLogo().then((logo) => {
      logo.position.set(0, -1.9, -2);
      logo.scale.multiplyScalar(5);
      logoHolder.add(logo);
    });
    const floor = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshStandardMaterial({ color: 0x7f7f7f }),
    );
    floor.receiveShadow = true;
    floor.position.y = 0.1;
    floor.rotation.x = Math.PI * -0.5;
    // scene.add(floor);
    const charHolder = new Object3D();
    scene.add(charHolder);
    this.charHolder = charHolder;
    loadGLTF("quinn-the-bot.glb").then((gltf) => {
      gltf.scene.traverse((n) => {
        n.receiveShadow = true;
        n.castShadow = true;
      });
      this.character = new Character(gltf.scene, charHolder);
    });
    let lastTime = performance.now() * 0.001;
    const walkSpeed = 0.5;
    const charMoveDelta = 0.05;
    let charMoveX = 0;
    let charMoveY = 0;
    let angleTarget = 0;

    const mapCache = new Map<string, Mesh>();
    const knownCoins: string[] = [];
    const availableCoins: string[] = [];
    const knownTrees: string[] = [];
    const availableTrees: string[] = [];
    const knownTowers: string[] = [];
    const availableTowers: string[] = [];
    const foundCoins: string[] = [];
    const animations: Animation[] = [];
    const animationsFinished: Animation[] = [];

    this.render = (renderer: WebGLRenderer) => {
      if (this.paused) {
        return;
      }
      const time = performance.now() * 0.001;
      const deltaTime = time - lastTime;
      lastTime = time;

      const cx = Math.round(charHolder.position.x / distPerTile);
      const cy = Math.round(charHolder.position.z / distPerTile);

      if (this.character) {
        this.character.happiness.target = this.party ? 1 : 0;
        this.character.update(time);
      }
      lightAmbient.color.set(LIGHT_COLOR_SKY);
      lightAmbient.groundColor.set(LIGHT_COLOR_GROUND);
      this.partyFloat.target = this.party ? 1 : 0;
      this.partyFloat.update(deltaTime);
      const partyAnim = Easing.Quadratic.InOut(this.partyFloat.value);
      camera.position.z = lerp(-12, -camDist, partyAnim);
      camera.position.y = lerp(0, 6, partyAnim);
      const dp = camTruck.virtualPivot.position
        .clone()
        .applyMatrix4(camTruck.matrixWorld);
      const dc = charHolder.position.clone();
      const d = dp.clone().sub(dc);
      const a = Math.atan2(d.z, d.x);

      if (partyAnim > 0.25 && !this.paused) {
        let x = false;
        let y = false;
        // const j = false;
        const j =
          this.activeTouchIds.length > 0 &&
          this.joystickRings.get(this.activeTouchIds[0]);
        if (j) {
          x = true;
          y = true;
          charMoveX = j.inner.position.x / 100;
          charMoveY = j.inner.position.y / 100;
        }

        if ((!j && this.keysDown.get("KeyW")) || this.keysDown.get("ArrowUp")) {
          charMoveY = clamp(
            Math.max(0, charMoveY + charMoveDelta),
            -walkSpeed,
            walkSpeed,
          );
          y = true;
        }
        if (
          (!j && this.keysDown.get("KeyS")) ||
          this.keysDown.get("ArrowDown")
        ) {
          charMoveY = clamp(
            Math.min(0, charMoveY - charMoveDelta),
            -walkSpeed,
            walkSpeed,
          );
          y = true;
        }
        if (!y) {
          const sign = Math.sign(charMoveY);
          const mag = Math.abs(charMoveY);
          charMoveY = Math.max(0, mag - charMoveDelta) * sign;
        }
        if (
          (!j && this.keysDown.get("KeyA")) ||
          this.keysDown.get("ArrowLeft")
        ) {
          charMoveX = clamp(
            Math.min(0, charMoveX - charMoveDelta),
            -walkSpeed,
            walkSpeed,
          );
          x = true;
        }
        if (
          (!j && this.keysDown.get("KeyD")) ||
          this.keysDown.get("ArrowRight")
        ) {
          charMoveX = clamp(
            Math.max(0, charMoveX + charMoveDelta),
            -walkSpeed,
            walkSpeed,
          );
          x = true;
        }
        if (!x) {
          const sign = Math.sign(charMoveX);
          const mag = Math.abs(charMoveX);
          charMoveX = Math.max(0, mag - charMoveDelta) * sign;
        }
        const charMove = charHolder.position.clone();
        const charMoveAngle = Math.atan2(charMoveY, charMoveX);
        const charMoveMag = Math.min(0.5, dist2(charMoveX, charMoveY));
        if (charMoveMag > 0.1) {
          this.idledTime = 0;
        } else {
          this.idledTime += deltaTime;
        }
        if (this.character) {
          this.character.idling.target = this.idledTime > 4 ? 1 : 0;
          this.character.running.target = Math.min(1, charMoveMag * 2);
        }
        const walkX = Math.cos(charMoveAngle) * charMoveMag * walkSpeed;
        const walkY = Math.sin(charMoveAngle) * charMoveMag * walkSpeed;
        charHolder.position.x -= Math.cos(a + Math.PI * 0.5) * walkX;
        charHolder.position.z -= Math.sin(a + Math.PI * 0.5) * walkX;
        charHolder.position.x -= Math.cos(a) * walkY;
        charHolder.position.z -= Math.sin(a) * walkY;
        charMove.sub(charHolder.position);
        if (charMove.length() > 0.01) {
          angleTarget = Math.atan2(-charMove.z, charMove.x) + Math.PI * 0.5;
        }
        const locationKey = `${cx};${cy}`;
        if (availableCoins.includes(locationKey)) {
          const tileMesh = mapCache.get(locationKey)!;
          const coin = tileMesh.getObjectByName("coin")!;
          const p = coin.position.clone();
          p.applyMatrix4(coin.parent!.matrixWorld);
          if (xzDist(p, charHolder.position) <= 1.8) {
            console.log("ding");
            removeFromArray(availableCoins, locationKey);
            foundCoins.push(locationKey);
            scene.attach(coin);
            const origin = coin.position.clone();
            let coinAdded = false;
            animations.push(
              new Animation(
                (v) => {
                  coin.scale.setScalar(1 - v * 0.75);
                  coin.position.copy(origin);
                  coin.position.y += v * 10;
                  coin.position.lerp(worldspaceUiCoinTarget.position, v * v);
                  if (!coinAdded && v > 0.85) {
                    this.coinBalance++;
                    coinAdded = true;
                  }
                },
                (a) => {
                  scene.remove(coin);
                  animationsFinished.push(a);
                },
                0.04,
              ),
            );
          }
        }
        if (availableTrees.includes(locationKey)) {
          const tileMesh = mapCache.get(locationKey)!;
          const tree = tileMesh.getObjectByName("treeTrunk")!;
          const p = tree.position.clone();
          p.applyMatrix4(tree.parent!.matrixWorld);
          const dist = xzDist(p, charHolder.position);
          if (dist <= 1.8) {
            console.log("chop");
            const dx = p.x - charHolder.position.x;
            const dz = p.z - charHolder.position.z;
            const a = Math.atan2(dz, dx);
            const gap = dist - 1.8;
            charHolder.position.x += Math.cos(a) * gap;
            charHolder.position.z += Math.sin(a) * gap;
          }
        }
        if (availableTowers.includes(locationKey)) {
          const tileMesh = mapCache.get(locationKey)!;
          const tower = tileMesh.getObjectByName("tower")!;
          for (let i = 0; i < 4; i++) {
            const a = (Math.PI * 2 * (i + 0.5)) / 4;
            const ix = Math.cos(a) * 3.25;
            const iy = Math.sin(a) * 3.25;
            const p = tower.position.clone();
            p.x += ix;
            p.z += iy;
            p.applyMatrix4(tower.parent!.matrixWorld);
            const dist = xzDist(p, charHolder.position);
            if (dist <= 2) {
              console.log("boom");
              const dx = p.x - charHolder.position.x;
              const dz = p.z - charHolder.position.z;
              const a = Math.atan2(dz, dx);
              const gap = dist - 2;
              charHolder.position.x += Math.cos(a) * gap;
              charHolder.position.z += Math.sin(a) * gap;
            }
          }
        }
        let ad = charHolder.rotation.y - angleTarget;
        if (ad > Math.PI) {
          ad -= Math.PI * 2;
        } else if (ad < -Math.PI) {
          ad += Math.PI * 2;
        }
        charHolder.rotation.y -= ad * 0.5;
        camTruck.rotation.y = -a - Math.PI * 0.5;
        camTruck.position.x -=
          (camTruck.position.x -
            (Math.cos(a + Math.PI) * -boomDist + charHolder.position.x)) *
          0.2;
        camTruck.position.z -=
          (camTruck.position.z -
            (Math.sin(a + Math.PI) * -boomDist + charHolder.position.z)) *
          0.2;
      }

      sun.position.set(sunDist, sunDist, 0).add(charHolder.position);
      sun.target.position.copy(charHolder.position);

      this.updateUiCoinTarget();

      // this.uiCoin.updateMatrixWorld();
      // this.uiCoin.lookAt(new Vector3(0, 12, 0));
      // this.uiCoin.updateMatrix();

      for (const anim of animations) {
        anim.update(deltaTime);
      }
      if (animationsFinished.length > 0) {
        for (let i = animationsFinished.length - 1; i >= 0; i--) {
          removeFromArray(animations, animationsFinished[i]);
        }
        animationsFinished.length = 0;
      }

      for (let iy = cy - mapReachTiles; iy <= cy + mapReachTiles; iy++) {
        for (let ix = cx - mapReachTiles; ix <= cx + mapReachTiles; ix++) {
          const x = ix * distPerTile;
          const y = iy * distPerTile;
          const dx = charHolder.position.x - x;
          const dy = charHolder.position.z - y;
          const tileScale =
            (mapReachDist - Math.sqrt(dx * dx + dy * dy)) / mapReachDist;
          const key = `${ix};${iy}`;
          const tileExists = mapCache.has(key);
          if (!tileExists && tileScale > 0) {
            const mesh = makeTile(ix, iy, !foundCoins.includes(key));
            if (mesh.userData.coin && !knownCoins.includes(key)) {
              knownCoins.push(key);
              availableCoins.push(key);
            }
            if (mesh.userData.tree && !knownTrees.includes(key)) {
              knownTrees.push(key);
              availableTrees.push(key);
            }
            if (mesh.userData.tower && !knownTowers.includes(key)) {
              knownTowers.push(key);
              availableTowers.push(key);
            }
            scene.add(mesh);
            mapCache.set(key, mesh);
          } else if (tileExists && tileScale <= 0) {
            const m = mapCache.get(key)!;
            scene.remove(m);
            mapCache.delete(key);
          } else if (tileExists) {
            const m = mapCache.get(key)!;
            m.scale.setScalar(partyAnim * (1 - Math.pow(1 - tileScale, 3)));
          }
        }
      }
      if (partyAnim > 0.001) {
        __tempColor.setHSL(time * 0.5, 0.5, 0.75);
        lightAmbient.color.lerp(__tempColor, partyAnim);
        __tempColor2.setHSL(time * 0.5 - 0.1, 0.8, 0.2);
        lightAmbient.groundColor.lerp(__tempColor2, partyAnim);
      }
      __tempColor.set(0x3f3f3f).lerp(__tempColor2, partyAnim);

      logoHolder.scale.setScalar(1 - partyAnim);
      logoHolder.position.set(
        charHolder.position.x,
        -partyAnim,
        charHolder.position.z,
      );
      logoHolder.visible = partyAnim < 0.995;

      renderer.setClearColor(__tempColor.getHex());
      renderer.clear();
      cookieCutter.visible = false;
      camera.near = 10;
      camera.far = 1000;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      renderer.clearDepth();
      cookieCutter.visible = true;
      camera.near = 0.1;
      camera.far = 10;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      renderer.render(uiScene, uiCamera);
    };
    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchEnd);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    if (mouseTouch) {
      window.addEventListener("mousedown", this.onMouseTouchDown);
      window.addEventListener("mousemove", this.onMouseTouchMove);
      window.addEventListener("mouseup", this.onMouseTouchUp);
    }
  }
  updateUiCoinTarget() {
    this.camTruck.updateMatrixWorld();
    this.worldspaceUiCoinTarget.position.set(
      remap(0, window.innerWidth, -1, 1, uiCoinScreenX),
      remap(0, window.innerHeight, -1, 1, window.innerHeight - uiCoinScreenY),
      0.967,
    );
    const pm = this.camera.projectionMatrix.clone().invert();
    const wm = this.camera.matrixWorld;
    this.worldspaceUiCoinTarget.position.applyMatrix4(pm);
    this.worldspaceUiCoinTarget.position.applyMatrix4(wm);
    this.worldspaceUiCoinTarget.updateMatrix();
    this.worldspaceUiCoinTarget.updateMatrixWorld();
    // this.worldspaceUiCoinTarget.position.set(0, 0, 0);
    // this.worldspaceUiCoinTarget.rotation.set(0, 0, 0);
    // this.worldspaceUiCoinTarget.applyMatrix4(this.uiCoin.matrixWorld);
  }

  pointers = new Map<number, [number, number]>();
  joystickRings = new Map<number, JoystickRing>();
  private pointerStart(x: number, y: number, id: number) {
    const fixedY = window.innerHeight - y;
    this.activeTouchIds.push(id);
    this.pointers.set(id, [x, fixedY]);
    const joystickRing = new JoystickRing();
    this.uiScene.add(joystickRing);
    joystickRing.position.set(x, fixedY, 0);
    this.joystickRings.set(id, joystickRing);
  }

  private pointerMove(x: number, y: number, id: number) {
    const fixedY = window.innerHeight - y;
    const p = this.pointers.get(id);
    if (p) {
      p[0] = x;
      p[1] = fixedY;
    }
    const j = this.joystickRings.get(id);
    if (j) {
      const dx = x - j.position.x;
      const dy = fixedY - j.position.y;
      const a = Math.atan2(dy, dx);
      const d = Math.min(50, dist2(dx, dy));

      j.inner.position.x = Math.cos(a) * d;
      j.inner.position.y = Math.sin(a) * d;
    }
  }

  private pointerEnd(x: number, y: number, id: number) {
    void x;
    void y;
    this.pointers.delete(id);
    const j = this.joystickRings.get(id);
    if (j) {
      this.uiScene.remove(j);
      this.joystickRings.delete(id);
    }
    removeFromArray(this.activeTouchIds, id);
  }

  onResize = (ev: UIEvent) => {
    void ev;
    this.updateScreen();
  };
  private updateScreen() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.uiCamera.right = window.innerWidth;
    this.uiCamera.top = window.innerHeight;
    this.uiCamera.updateProjectionMatrix();
    this.updateUiCoinTarget();
    this.uiCoin.position.x = uiCoinScreenX;
    this.uiCoin.position.y = window.innerHeight - uiCoinScreenY;
  }
  onTouchStart = (ev: TouchEvent) => {
    ev.preventDefault();
    this.usingTouch = true;
    for (let i = 0; i < ev.changedTouches.length; i++) {
      const touch = ev.changedTouches.item(i)!;
      this.pointerStart(touch.clientX, touch.clientY, touch.identifier);
    }
  };
  onTouchMove = (ev: TouchEvent) => {
    for (let i = 0; i < ev.changedTouches.length; i++) {
      const touch = ev.changedTouches.item(i)!;
      this.pointerMove(touch.clientX, touch.clientY, touch.identifier);
    }
  };
  onTouchEnd = (ev: TouchEvent) => {
    for (let i = 0; i < ev.changedTouches.length; i++) {
      const touch = ev.changedTouches.item(i)!;
      this.pointerEnd(touch.clientX, touch.clientY, touch.identifier);
    }
  };
  onMouseMove = (ev: MouseEvent) => {
    if (this.usingTouch) {
      return;
    }
    void ev;
    // boomRotationTargetY = (ev.clientX / window.innerWidth - 0.5) * 1;
    // boomRotationTargetX = -(ev.clientY / window.innerHeight - 0.5) * 0.5;
  };
  onMouseTouchDown = (ev: MouseEvent) => {
    ev.preventDefault();
    this.usingTouch = true;
    this.pointerStart(ev.clientX, ev.clientY, 0);
  };
  onMouseTouchMove = (ev: MouseEvent) => {
    this.pointerMove(ev.clientX, ev.clientY, 0);
  };
  onMouseTouchUp = (ev: MouseEvent) => {
    this.pointerEnd(ev.clientX, ev.clientY, 0);
  };
  onKeyDown = (ev: KeyboardEvent) => {
    this.keysDown.set(ev.code, true);
  };
  onKeyUp = (ev: KeyboardEvent) => {
    this.keysDown.set(ev.code, false);
  };

  render: (renderer: WebGLRenderer) => void;

  cleanup() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    if (mouseTouch) {
      window.removeEventListener("mousedown", this.onMouseTouchDown);
      window.removeEventListener("mousemove", this.onMouseTouchMove);
      window.removeEventListener("mouseup", this.onMouseTouchUp);
    }
  }
}
