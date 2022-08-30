import { Looper } from "./Looper";
import { clearInterval, setInterval, setTimeout } from "timers";
import { LooperUnregister } from "./LooperUnregister";
import { generateRandomId } from "../bot/model/id";
import { Logger, newLogger } from "../bot/logger";

const delay = function (amount: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), amount);
  });
};

export abstract class BaseLooper<T, R> implements Looper<T, R> {
  private readonly logger: Logger;
  private interval: any;
  private registrations: {
    key: string;
    submission: T;
    callback: (data: R) => boolean;
  }[];

  protected constructor(tag: string) {
    this.logger = newLogger(`BaseLooper[${tag}]`);
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
            self.logger.log("Looper is marked completed:", {
              key,
              data: submission,
            });
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
      const deleted = self.registrations.splice(index, 1);
      self.logger.log("Remove looper for submission: ", {
        key,
        deleted,
      });
    }

    if (self.registrations.length <= 0) {
      self.shutdown();
    }
  }

  private onRegistrationsUpdated() {
    const self = this;
    if (self.interval) {
      self.logger.log("Already looping, do not need to re-register");
      return;
    }

    if (self.registrations.length > 0) {
      self.logger.log("Begin looping with registrations");
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
        self.logger.log("Request stop looping: ", {
          key,
          data,
        });
        self.removeSubmission(key);
      },
    };
    return result;
  };

  shutdown: () => void = () => {
    const self = this;
    if (!self.interval) {
      return;
    }

    self.logger.log("Shutdown looper");
    clearInterval(self.interval);
    self.interval = undefined;
    self.registrations = [];
  };

  protected abstract loopPeriod: number;

  protected abstract upstream: (data: T) => Promise<R>;
}
