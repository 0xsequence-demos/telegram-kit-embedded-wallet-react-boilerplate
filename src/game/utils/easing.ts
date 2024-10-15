import { clamp01, lerp, unlerpClamped } from "./math";

function Linear(k: number) {
  return k;
}

export function nestEases(eases: Ease[]) {
  return function nestedEase(v: number) {
    return eases.reduce((workingV, currEase) => currEase(workingV), v);
  };
}

const Quadratic = {
  In(k: number) {
    return k * k;
  },
  Out(k: number) {
    return k * (2 - k);
  },
  InOut(k: number) {
    k *= 2;
    if (k < 1) {
      return 0.5 * k * k;
    }
    return -0.5 * (--k * (k - 2) - 1);
  },
};
const Cubic = {
  In(k: number) {
    return k * k * k;
  },
  Out(k: number) {
    return --k * k * k + 1;
  },
  InOut(k: number) {
    k *= 2;
    if (k < 1) {
      return 0.5 * k * k * k;
    }
    k -= 2;
    return 0.5 * (k * k * k + 2);
  },
};
const Quartic = {
  In(k: number) {
    return k * k * k * k;
  },
  Out(k: number) {
    return 1 - --k * k * k * k;
  },
  InOut(k: number) {
    k *= 2;
    if (k < 1) {
      return 0.5 * k * k * k * k;
    }
    k -= 2;
    return -0.5 * (k * k * k * k - 2);
  },
};
const Quintic = {
  In(k: number) {
    return k * k * k * k * k;
  },
  Out(k: number) {
    return --k * k * k * k * k + 1;
  },
  InOut(k: number) {
    k *= 2;
    if (k < 1) {
      return 0.5 * k * k * k * k * k;
    }
    k -= 2;
    return 0.5 * (k * k * k * k * k + 2);
  },
};
const Sinusoidal = {
  In(k: number) {
    return 1 - Math.cos((k * Math.PI) / 2);
  },
  Out(k: number) {
    return Math.sin((k * Math.PI) / 2);
  },
  InOut(k: number) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  },
};
const Exponential = {
  In(k: number) {
    return k === 0 ? 0 : Math.pow(1024, k - 1);
  },
  Out(k: number) {
    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
  },
  InOut(k: number) {
    if (k === 0) {
      return 0;
    }
    if (k === 1) {
      return 1;
    }
    k *= 2;
    if (k < 1) {
      return 0.5 * Math.pow(1024, k - 1);
    }
    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
  },
};
const Circular = {
  In(k: number) {
    return 1 - Math.sqrt(1 - k * k);
  },
  Out(k: number) {
    return Math.sqrt(1 - --k * k);
  },
  InOut(k: number) {
    k *= 2;
    if (k < 1) {
      return -0.5 * (Math.sqrt(1 - k * k) - 1);
    }
    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
  },
};
const Elastic = {
  In(k: number) {
    let s;
    let a = 0.1;
    const p = 0.4;
    if (k === 0) {
      return 0;
    }
    if (k === 1) {
      return 1;
    }
    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    }
    return -(
      a *
      Math.pow(2, 10 * (k -= 1)) *
      Math.sin(((k - s) * (2 * Math.PI)) / p)
    );
  },
  Out(k: number) {
    let s;
    let a = 0.1;
    const p = 0.4;
    if (k === 0) {
      return 0;
    }
    if (k === 1) {
      return 1;
    }
    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    }
    return (
      a * Math.pow(2, -10 * k) * Math.sin(((k - s) * (2 * Math.PI)) / p) + 1
    );
  },
  InOut(k: number) {
    let s;
    let a = 0.1;
    const p = 0.4;
    if (k === 0) {
      return 0;
    }
    if (k === 1) {
      return 1;
    }
    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    }
    k *= 2;
    if (k < 1) {
      return (
        -0.5 *
        (a *
          Math.pow(2, 10 * (k -= 1)) *
          Math.sin(((k - s) * (2 * Math.PI)) / p))
      );
    }
    return (
      a *
        Math.pow(2, -10 * (k -= 1)) *
        Math.sin(((k - s) * (2 * Math.PI)) / p) *
        0.5 +
      1
    );
  },
};
const Back = {
  In(k: number) {
    const s = 1.70158;
    return k * k * ((s + 1) * k - s);
  },
  Out(k: number) {
    const s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
  },
  InOut(k: number) {
    const s = 1.70158 * 1.525;
    k *= 2;
    if (k < 1) {
      return 0.5 * (k * k * ((s + 1) * k - s));
    }
    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
  },
};
const Bounce = {
  In(k: number) {
    return 1 - Bounce.Out(1 - k);
  },
  Out(k: number) {
    if (k < 1 / 2.75) {
      return 7.5625 * k * k;
    } else if (k < 2 / 2.75) {
      return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    } else if (k < 2.5 / 2.75) {
      return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    } else {
      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
    }
  },
  InOut(k: number) {
    if (k < 0.5) {
      return Bounce.In(k * 2) * 0.5;
    }
    return Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
  },
};
const Custom = {
  FadeInOut(k: number) {
    return Easing.Quadratic.Out(Math.sin(Math.pow(k, 0.75) * Math.PI));
  },
  FadeInOut2(k: number) {
    return Easing.Quadratic.Out(Math.sin(Math.pow(k, 0.5) * Math.PI));
  },
  RoundedOut(k: number) {
    return Quadratic.Out(lerp(Sinusoidal.InOut(k), k, 0.25));
  },
  RoundedOutHard(k: number) {
    return Cubic.Out(lerp(Sinusoidal.InOut(k), k, 0.25));
  },
  Pulse(k: number) {
    return Quintic.Out(lerp(Quintic.Out(k), k, k) - k);
  },
  GlitchyPulseLoop(v: number) {
    return (
      Math.sin(v * Math.PI * 4) * 0.2 +
      0.8 +
      unlerpClamped(-0.1, 0.1, Math.min(Math.sin(v * 30), Math.sin(v * 70))) *
        (Math.sin(Math.sin(v * 100) * 100) * 0.1 + 0.1)
    );
  },
  AvoidEdges(v: number) {
    const k = v - 0.5;
    const sign = Math.sign(k);
    const t = Math.max(0, Math.abs(k) - 0.3) * 5;
    const final1 = v - t * sign * 0.2;
    return lerp(v, final1, t * 0.5);
  },
  SuperFastOut(v: number) {
    return 1 - Math.pow(1 - Easing.Circular.Out(v), 2);
  },
  FlatTopHalfSin(v: number) {
    return Easing.Quartic.Out(Math.sin(v * Math.PI));
  },
  ParabolaHop(v: number) {
    return Easing.Quartic.In(Math.sin(v * Math.PI));
  },
  WheelSpin(v: number) {
    return lerp(
      Easing.Back.In(Easing.Cubic.Out(v)),
      Easing.Quadratic.Out(v),
      Easing.Quadratic.Out(v),
    );
  },
  SnappyButSmooth(v: number) {
    return Easing.Quadratic.InOut(Easing.Quartic.Out(v));
  },
};
export const Easing = {
  Linear,
  Quadratic,
  Cubic,
  Quartic,
  Quintic,
  Sinusoidal,
  Exponential,
  Circular,
  Elastic,
  Back,
  Bounce,
  Custom,
};

function makeEaseOutIn(inOut: Ease) {
  //assume inOut passes through 0.5, 0.5
  return function OutInVariant(k: number) {
    if (k <= 0.5) {
      return inOut(k + 0.5) - 0.5;
    } else {
      return inOut(k - 0.5) + 0.5;
    }
  };
}
void makeEaseOutIn;

function makeDilutedEase(ease: (k: number) => number, strength: number) {
  return function dilutedEase(k: number) {
    return lerp(k, ease(k), strength);
  };
}
void makeDilutedEase;

export type Ease = (k: number) => number;
export type Ease3 = { x: Ease; y: Ease; z: Ease };

export function isEase3(ease: Ease | Ease3): ease is Ease3 {
  // eslint-disable-next-line no-prototype-builtins
  return ease.hasOwnProperty("x");
}

export function makeRelativeTimelineRemap(
  preDelay: number,
  duration: number,
  postDelay: number,
) {
  const total = preDelay + duration + postDelay;
  const speed = total / duration;
  const relPreDelay = preDelay / total;
  return function relativeTimelineRemap(v: number) {
    return clamp01((v - relPreDelay) * speed);
  };
}
export function makeSkipMiddleEase(amt: number) {
  const mappedAmt = 1 - amt;
  return (v: number) => {
    return v < 0.5 ? v * mappedAmt : 1 - (1 - v) * mappedAmt;
  };
}
