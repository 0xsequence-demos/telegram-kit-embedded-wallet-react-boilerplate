import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import {
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from "three";
import Character from "./Game/character/Character";

let initd = false;
function initGame(refContainer: React.MutableRefObject<HTMLDivElement | null>) {
  if (initd) {
    return;
  }
  initd = true;
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new WebGLRenderer();
  renderer.setClearColor(0x3f3f3f);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild( renderer.domElement );
  // use ref as a mount point of the js scene instead of the document.body
  refContainer.current?.appendChild(renderer.domElement);
  const loader = new GLTFLoader();
  const lightAmbient = new HemisphereLight(0xffffff, 0xafafaf, 2);
  const lightDirect = new SpotLight(0xffffff, 200, 20, Math.PI / 12);
  lightDirect.castShadow = true;
  lightDirect.shadow.mapSize.setScalar(1024);
  lightDirect.shadow.autoUpdate = true;
  lightDirect.shadow.bias = -0.0005;
  scene.add(lightAmbient);
  scene.add(lightDirect);
  const floor = new Mesh(
    new PlaneGeometry(10, 10),
    new MeshStandardMaterial({ color: 0x7f7f7f }),
  );
  floor.receiveShadow = true;
  floor.position.y = 0.1;
  floor.rotation.x = Math.PI * -0.5;
  scene.add(floor);
  lightDirect.position.set(7, 7, -7);
  lightDirect.lookAt(new Vector3(0, 0, 0));
  let character: Character | undefined;
  loader.load("quinn-the-bot.glb", (gltf) => {
    gltf.scene.traverse((n) => {
      n.receiveShadow = true;
      n.castShadow = true;
    });
    character = new Character(gltf.scene, scene);
  });

  const boom = new Object3D();
  boom.rotation.order = "YXZ";
  scene.add(boom);
  camera.position.z = -3;
  boom.position.y = 1.75;
  camera.rotateY(Math.PI);
  boom.add(camera);
  camera.userData.rotationX = -Math.PI;
  const animate = function () {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    character?.update(time);
    renderer.render(scene, camera);
  };
  animate();
  window.addEventListener("resize", (ev) => {
    void ev;
    console.log("test");
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  let usingTouch = false;
  window.addEventListener("mousemove", (ev) => {
    if (usingTouch) {
      return;
    }
    boom.rotation.y = (ev.clientX / window.innerWidth - 0.5) * 4;
    boom.rotation.x = -(ev.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener("touchstart", (ev) => {
    void ev;
    usingTouch = true;
  });
}

function Game() {
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    initGame(refContainer);
  }, []);
  return <div ref={refContainer}></div>;
}

export default Game;
