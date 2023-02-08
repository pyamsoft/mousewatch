import { newLogger } from "../bot/logger";
import {
  createResultFromEntry,
  WatchResult,
} from "../commands/model/WatchResult";
import { ParkCalendarLookupHandler } from "./ParkCalendarLooupHandler";
import { ParkWatchCache } from "./ParkWatchCache";

const logger = newLogger("ParkCalendarLookupLooper");

/**
 * Loop every 30 seconds
 */
const LOOP_TIME = 30 * 1000;

// Have we started?
let looping = false;

// The timer
let loopTimer: any = undefined;

const beginLooping = function (command: () => void) {
  stopLooping();

  loopTimer = setInterval(() => {
    logger.log("Loop firing command");
    command();
  }, LOOP_TIME);
};

const stopLooping = function () {
  if (loopTimer) {
    logger.log("Clearing loop timer");
    clearInterval(loopTimer);
    loopTimer = undefined;
  }
};

export const ParkCalendarLookupLooper = {
  loop: function (onResultsReceived: (results: WatchResult[]) => void) {
    if (looping) {
      logger.log("loop() called but already looping");
      return;
    }
    looping = true;

    logger.log("Begin loop!");
    beginLooping(() => {
      logger.log("Loop run: Get all keys and fetch calendar info");
      const magicKeys = ParkWatchCache.targetCalendars();
      const jobs: Promise<WatchResult[]>[] = [];

      for (const magicKey of magicKeys) {
        const entries = ParkWatchCache.magicKeyWatches(magicKey);
        const dates = entries.map((e) => e.targetDate);
        logger.log("Entries: ", entries)
        jobs.push(
          ParkCalendarLookupHandler.lookup(magicKey, dates).then((lookup) => {
            const results: WatchResult[] = [];

            for (const res of lookup) {
              const entry = entries.find(
                (e) =>
                  e.targetDate.valueOf() === res.targetDate.valueOf() &&
                  e.magicKey === res.magicKey
              );
              if (entry) {
                results.push(createResultFromEntry(entry, res.parkResponse));
              }
            }

            return results;
          })
        );
      }

      Promise.all(jobs).then((results) => {
        for (const watchResults of results) {
          onResultsReceived(watchResults);
        }
      });
    });
  },

  stop: function () {
    if (!looping) {
      logger.log("stop() called but not looping");
      return;
    }
    looping = false;

    logger.log("Stop loop!");
    stopLooping();
  },
};
