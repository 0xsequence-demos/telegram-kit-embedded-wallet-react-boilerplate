export default class AnimatedNumber {
  target = 0;
  constructor(
    public value = 0,
    private speedLimit: number,
  ) {
    this.target = value;
  }
  update(timeDelta: number) {
    const deltaV =
      (this.value - this.target) * this.speedLimit * timeDelta * 60;
    const deltaS = Math.sign(deltaV);
    const boundDeltaV = Math.min(this.speedLimit, Math.abs(deltaV)) * deltaS;
    this.value -= boundDeltaV;
  }
}
