// given the following inputs: a**** **** b******* *c  ****** **e** * ****f ****** ** g ****h
// throttle would output    : a          b          c          e          f          g          h
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T, F extends (...args: any) => any>(
  this: T,
  func: F,
  timeout = 300,
) {
  let shouldWait = false;
  let followUp = false;
  let delayedArgs: Parameters<F>;

  const wrapped = (...args: Parameters<F>) => {
    if (shouldWait) {
      followUp = true;
      delayedArgs = args;
    } else {
      func.apply(this, args);
      shouldWait = true;
      setTimeout(() => {
        shouldWait = false;
        if (followUp) {
          followUp = false;
          wrapped.apply(this, delayedArgs);
        }
      }, timeout);
    }
  };
  return wrapped;
}

function testThrottle() {
  setTimeout(() => {
    let uuid = 0;

    let val = 0;

    function talk(i: number) {
      uuid++;
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(`talk all       ${i} (${uuid}) ${performance.now()}`);
    }

    function talk2(i: number) {
      uuid++;
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(`talk throttled ${i} (${uuid}) ${performance.now()}`);
    }

    const talk3 = throttle(talk2, 500);

    const t = setInterval(() => {
      val++;
      talk(val);
      talk3(val);
    }, 50);

    setTimeout(() => {
      clearInterval(t);
    }, 2300);
  }, 2000);
}

// biome-ignore lint/complexity/noVoid: <explanation>
void testThrottle;

// testThrottle()
