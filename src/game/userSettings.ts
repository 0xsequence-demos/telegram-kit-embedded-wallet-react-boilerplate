export const userSettings = {
  graphicsResolution: () =>
    Number.parseInt(localStorage.getItem("graphicsResolution") || "1"),
  graphicsAntialias: () =>
    Number.parseInt(localStorage.getItem("graphicsAntialias") || "1"),
  audioVolume: () =>
    Number.parseInt(localStorage.getItem("audioVolume") || "100"),
};
