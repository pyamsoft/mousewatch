import { LooperUnregister } from "./LooperUnregister";

export interface Looper<T, R> {
  submit: (data: T, onProcess: (data: R) => boolean) => LooperUnregister;

  shutdown: () => void;
}
