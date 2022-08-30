import { Looper } from "./Looper";
import { clearInterval, setInterval, setTimeout } from "timers";
import { LooperUnregister } from "./LooperUnregister";
import { generateRandomId } from "../bot/model/id";

const delay = function (amount: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), amount);
  });
};

export abstract class BaseLooper<T, R> implements Looper<T, R> {
  private interval: any;
  private registrations: {
    key: string;
    submission: T;
    callback: (data: R) => boolean;
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
      const { key, submission, callback } = stored;

      // Run each submission in parallel
      const job = self
        .upstream(submission)
        .then(callback)
        .then((remove) => {
          if (remove) {
            self.removeSubmission(key);
          }
        });

      // Add processing delay to avoid overloading third-party endpoint
      await delay(500);

      jobs.push(job);
    }

    await Promise.all(jobs);
  }

  private removeSubmission(key: string) {
    const self = this;
    const index = self.registrations.findIndex((r) => r.key === key);
    if (index >= 0) {
      self.registrations.splice(index, 1);
    }
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

  submit = (data: T, onProcess: (data: R) => boolean) => {
    const self = this;

    // For later lookup or deletion
    const key = generateRandomId();

    const item = {
      key,
      submission: data,
      callback: onProcess,
    };

    self.registrations.push(item);
    self.onRegistrationsUpdated();

    const result: LooperUnregister = {
      unregister: () => {
        self.removeSubmission(key);
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
