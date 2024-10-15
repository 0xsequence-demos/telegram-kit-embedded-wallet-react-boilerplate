import type { PerspectiveCamera, WebGLRenderer } from "three";

export function initResizeHandler(
  cameras: PerspectiveCamera[],
  renderer: WebGLRenderer,
) {
  // Resize handler
  function onWindowResize() {
    for (const camera of cameras) {
      // Update camera aspect ratio
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onWindowResize);
}
