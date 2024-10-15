export class Signal<T> {
  listeners: Array<(val: T) => void> = [];
  listen(listener: (val: T) => void) {
    this.listeners.push(listener);
  }
  oneTimeListeners: Array<(val: T) => void> = [];
  listenOnce(listener: (val: T) => void) {
    this.oneTimeListeners.push(listener);
  }
  emit(value: T) {
    for (const listener of this.listeners) {
      listener(value);
    }
    for (const listener of this.oneTimeListeners) {
      listener(value);
    }
    this.oneTimeListeners.length = 0;
  }
}
