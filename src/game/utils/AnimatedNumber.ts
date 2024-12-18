export default class AnimatedNumber {
  target = 0;
  constructor(
    public value = 0,
    private speedLimit: number,
  ) {
    this.target = value;
  }
  update(timeDelta: number) {
    const delta = this.target - this.value;
    const sign = Math.sign(delta);
    const mag = Math.abs(delta);
    this.value +=
      sign * Math.min(mag, this.speedLimit) * Math.min(timeDelta, 0.2) * 60;
  }
}
