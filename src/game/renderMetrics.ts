import { userSettings } from "./userSettings";
import device from "./device";
import { throttle } from "./utils/throttlers";
import { ValueSignal } from "./utils/ValueSignal";

type SizeListener = (width: number, height: number) => void;

const __sizeChangeListeners: Set<SizeListener> = new Set();
function onSizeChange(listener: SizeListener, firstOneForFree = false) {
  __sizeChangeListeners.add(listener);
  if (firstOneForFree) {
    listener(renderMetrics.width.value, renderMetrics.height.value);
  }

  return () => __sizeChangeListeners.delete(listener);
}

function vs(v: number) {
  return new ValueSignal(v);
}
const width = vs(1920);
const height = vs(1080);
const uiWidth = vs(1920);
const uiHeight = vs(1080);
const devicePixelRatio = vs(window.devicePixelRatio);
const finalDevicePixelRatio = vs(1);
const pixelDownsample = vs(userSettings.graphicsResolution());
const virtualPixelRatio = vs(1);
const finalPointScale = vs(1);
const halfScreenWidthPixels = vs(1920 / 2);
const pixelWidthInClipSpace = vs(1);
const pixelHeightInClipSpace = vs(1);
const aspect = vs(16 / 9);
const uiScale = vs(1);

function __notifySizeListeners() {
  for (const cb of __sizeChangeListeners) {
    cb(width.value, height.value);
  }
  sizeChangeRequested = false;
}

let sizeChangeRequested = false;
export function requestSizeChange() {
  if (sizeChangeRequested) {
    return;
  }
  sizeChangeRequested = true;
  setTimeout(__notifySizeListeners, 10);
}

function updateFinalPixelRatio() {
  virtualPixelRatio.value =
    devicePixelRatio.value / (4 - pixelDownsample.value);
  finalDevicePixelRatio.value =
    (virtualPixelRatio.value * window.innerHeight) / window.innerHeight;
}

devicePixelRatio.listen(updateFinalPixelRatio);
pixelDownsample.listen(updateFinalPixelRatio);

finalDevicePixelRatio.listen((fpr: number) => {
  finalPointScale.value = fpr / devicePixelRatio.value;
});

function onWidthOrHeightChange() {
  devicePixelRatio.value = window.devicePixelRatio;
  updateFinalPixelRatio();
  requestSizeChange();
}

width.listen(onWidthOrHeightChange);
height.listen(onWidthOrHeightChange);

function updateUIWidthPixels() {
  uiWidth.value = width.value / uiScale.value;
}

function updateUIHeightPixels() {
  uiHeight.value = height.value / uiScale.value;
}

width.listen(updateUIWidthPixels);
height.listen(updateUIHeightPixels);
uiScale.listen(() => {
  updateUIWidthPixels();
  updateUIHeightPixels();
});

function updateHalfScreenWidthPixels() {
  halfScreenWidthPixels.value = finalDevicePixelRatio.value * width.value * 0.5;
}
width.listen(updateHalfScreenWidthPixels);

finalDevicePixelRatio.listen(updateHalfScreenWidthPixels);
// const isProbablyFullscreen = gameMode !== GameMode.UNKNOWN
const isProbablyFullscreen = true;

const attemptResize = () => {
  //   const width = isProbablyFullscreen ? window.innerWidth : canvas.clientWidth
  //   const height = isProbablyFullscreen ? window.innerHeight : canvas.clientHeight
  const w = device.width;
  const h = device.height;
  width.value = w;
  height.value = h;
  aspect.value = w / h;
};

const throttledAttemptResize = throttle(attemptResize, 100);

if (isProbablyFullscreen) {
  //probably fullscreen
  device.onChange(throttledAttemptResize, true);
} else {
  //probably embedded widget
  setTimeout(() => {
    setInterval(throttledAttemptResize, 500);
  }, 1000);
}

export const renderMetrics = {
  width,
  height,
  uiWidth,
  uiHeight,
  devicePixelRatio,
  finalDevicePixelRatio,
  pixelDownsample,
  virtualPixelRatio,
  finalPointScale,
  halfScreenWidthPixels,
  pixelWidthInClipSpace,
  pixelHeightInClipSpace,
  aspect,
  uiScale,
  onSizeChange,
};
