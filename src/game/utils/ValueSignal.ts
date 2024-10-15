import { Signal } from "./Signal";

export class ValueSignal<T> extends Signal<T> {
  public get value(): T {
    return this._value;
  }
  public set value(value: T) {
    if (this._value === value) {
      return;
    }
    this._value = value;
    this.emit(value);
  }
  constructor(private _value: T) {
    super();
  }
}
