export const BATTERY_SAVINGS_MODE = false;

type DeviceType = "mobile" | "tablet" | "desktop";
type DeviceOrientation = "landscape" | "portrait";

type Listener = () => void;

class Device {
  width = 1920;
  height = 1080;
  aspect = 1;
  deviceWidth: number = 1920; // landscape orientation
  deviceHeight: number = 1080; // landscape orientation
  deviceAspect: number = 1920 / 1080; // landscape orientation
  orientation: DeviceOrientation = "landscape";
  pixelRatio: number = 1;
  fps = 0;
  targetFPS = 60;
  useTouch = false;
  type: DeviceType = "desktop";
  listeners: Set<Listener> = new Set();

  private cachedPPCm = -1;
  private _overrideWidth: number | undefined;
  private _overrideHeight: number | undefined;
  physicalDeviceHeight: number = 1920;
  physicalDeviceWidth: number = 1080;

  constructor() {
    const handleResize = () => {
      this.handleChange();

      // XXX Fix for IOS homescreen: Need to wait a little bit for the screen to settle
      setTimeout(this.handleChange, 50);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("fullscreenchange", handleResize);

    this.handleChange();
  }

  handleChange = () => {
    const targetWidth =
      this._overrideWidth === undefined
        ? window.innerWidth
        : this._overrideWidth;
    const targetHeight =
      this._overrideHeight === undefined
        ? window.innerHeight
        : this._overrideHeight;

    if (this.width === targetWidth && this.height === targetHeight) {
      return;
    }

    this.useTouch =
      /Mobi|Android|iPhone|iPad|BlackBerry|Windows Phone|webOS/i.test(
        navigator.userAgent,
      );

    this.width = targetWidth;
    this.height = targetHeight;
    this.aspect = this.width / this.height;
    this.deviceHeight = Math.min(this.width, this.height);
    this.deviceWidth = Math.max(this.width, this.height);
    this.deviceAspect = this.deviceWidth / this.deviceHeight;
    this.pixelRatio = window.devicePixelRatio;
    this.physicalDeviceHeight = this.deviceHeight * this.pixelRatio;
    this.physicalDeviceWidth = this.deviceWidth * this.pixelRatio;
    this.orientation = this.aspect < 1 ? "portrait" : "landscape";
    this.type = this.useTouch
      ? this.deviceWidth < 1024 && this.deviceAspect > 1.6
        ? "mobile"
        : "tablet"
      : "desktop";

    for (const listener of this.listeners) {
      listener();
    }
  };

  trackCanvas(canvas: HTMLCanvasElement) {
    setInterval(() => {
      this._overrideWidth = canvas.clientWidth;
      this._overrideHeight = canvas.clientHeight;
      this.handleChange();
    }, 100);
  }

  onChange(listener: Listener, firstOneForFree = false) {
    this.listeners.add(listener);
    if (firstOneForFree) {
      listener();
    }

    return () => this.listeners.delete(listener);
  }

  get isMobile() {
    return this.type === "mobile";
  }

  get isTablet() {
    return this.type === "tablet";
  }

  get isDesktop() {
    return this.type === "desktop";
  }

  get isIOS() {
    const av = navigator.appVersion;
    const explicitIphone = av.includes("iPhone");
    const explicitIpad = av.includes("iPad");
    const iosPlatform = /^(iPhone|iPad|iPod)/.test(navigator.platform);
    return explicitIphone || explicitIpad || iosPlatform;
  }

  get isIpadOS() {
    const av = navigator.appVersion;
    const explicitIpad = av.includes("iPad");
    const safari13 = av.includes("Version/13.") && av.includes("Safari");
    const osx = av.includes("Mac OS X");
    return explicitIpad || (safari13 && osx);
  }

  get pixelsPerCm() {
    if (this.cachedPPCm === -1) {
      // create an empty element
      const div = document.createElement("div");
      // give it an absolute size of one inch
      div.style.height = "1in";
      // append it to the body
      const body = document.getElementsByTagName("body")[0];
      body.appendChild(div);
      // read the computed width
      const ppi = getComputedStyle(div, null).getPropertyValue("height");
      // remove it again
      body.removeChild(div);
      // and return the value
      this.cachedPPCm = Number.parseFloat(ppi) * 2.54;
    }
    return this.cachedPPCm;
  }

  get screenHeightCms() {
    return this.height / this.pixelsPerCm;
  }

  get screenWidthCms() {
    return this.width / this.pixelsPerCm;
  }

  get screenShorterCms() {
    return Math.min(this.width, this.height) / this.pixelsPerCm;
  }

  get performance() {
    if (this.fps < this.targetFPS * 0.4) {
      // < 24 FPS
      return "low";
    }
    if (this.fps < this.targetFPS * 0.8) {
      // > 24 < 48 FPS
      return "medium";
    }
    // > 48 FPS
    return "high";
  }
}

const device = new Device();

export default device;
