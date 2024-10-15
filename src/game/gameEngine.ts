import { PCFSoftShadowMap, WebGLRenderer } from "three";
import type {} from "vite";
import Game from "./Game";
import { initToneMapping } from "./initToneMapping";
import { renderMetrics } from "./renderMetrics";
import { userSettings } from "./userSettings";
// import { testModelCluster } from "./testModelCluster"

let gameEngine:
  | {
      renderer: WebGLRenderer;
      game: Game;
    }
  | undefined;

export function getGameEngine() {
  if (!gameEngine) {
    // camera.position.set(Number(c[0]), Number(c[1]) + 1, Number(c[2]))
    const renderer = new WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: userSettings.graphicsAntialias() === 1,
    });
    let cleanup = initToneMapping(renderer);
    if (import.meta.hot) {
      import.meta.hot.accept("./initToneMapping", (mod) => {
        cleanup();
        cleanup = mod!.initToneMapping(renderer);
      });
    }

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type = PCFSoftShadowMap;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const animate = () => {
      requestAnimationFrame(animate);
      if (!gameEngine) {
        return;
      }
      gameEngine.game.render(renderer);
    };

    animate();
    for (const v of [
      "-moz-crisp-edges",
      "-webkit-crisp-edges",
      "crisp-edges",
      "pixelated",
    ]) {
      renderer.domElement.style.setProperty("image-rendering", v);
    }

    const cb = () => {
      renderer.setPixelRatio(renderMetrics.finalDevicePixelRatio.value);
      renderer.setSize(window.innerWidth, window.innerHeight, true);
    };

    renderMetrics.finalDevicePixelRatio.listen(cb);
    renderMetrics.onSizeChange(cb);

    let game = new Game();

    const _gameEngine = {
      renderer,
      game,
    };

    if (import.meta.hot) {
      import.meta.hot.accept("./Game", (mod) => {
        game.cleanup();
        game = new mod!.default();
        _gameEngine.game = game;
      });
    }
    gameEngine = _gameEngine;
  }
  return gameEngine;
}
