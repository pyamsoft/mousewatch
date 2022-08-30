import { Looper } from "./Looper";
import { clearInterval, setInterval, setTimeout } from "timers";
import { LooperUnregister } from "./LooperUnregister";

const delay = function (amount: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), amount);
  });
};

export abstract class BaseLooper<T, R> implements Looper<T, R> {
  private interval: any;
  private registrations: {
    submission: T;
    callback: (data: R) => void;
  }[];

  protected constructor() {
    this.interval = undefined;
    this.registrations = [];
  }

  private async onTimerCallback() {
    const self = this;
    const list = [...self.registrations];

    const jobs = [];

    for (const stored of list) {
      const { submission, callback } = stored;

      // Run each submission in parallel
      const job = self.upstream(submission).then(callback);

      // Add processing delay to avoid overloading third-party endpoint
      await delay(500);

      jobs.push(job);
    }

    await Promise.all(jobs);
  }

  private onRegistrationsUpdated() {
    const self = this;
    if (self.interval) {
      return;
    }

    if (self.registrations.length > 0) {
      self.interval = setInterval(
        () => self.onTimerCallback(),
        self.loopPeriod * 60 * 1000
      );
    }
  }

  submit = (data: T, onProcess: (data: R) => void) => {
    const self = this;

    const item = {
      submission: data,
      callback: onProcess,
    };

    self.registrations.push(item);
    self.onRegistrationsUpdated();

    const result: LooperUnregister = {
      unregister: () => {
        const index = self.registrations.indexOf(item);
        if (index >= 0) {
          self.registrations.splice(index, 1);
        }
      },
    };
    return result;
  };

  shutdown: () => void = () => {
    if (!this.interval) {
      return;
    }

    clearInterval(this.interval);
    this.interval = undefined;
    this.registrations = [];
  };

  protected abstract loopPeriod: number;

  protected abstract upstream: (data: T) => Promise<R>;
}
