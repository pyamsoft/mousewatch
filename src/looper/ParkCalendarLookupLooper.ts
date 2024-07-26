/*
 * Copyright 2024 pyamsoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
let loopTimer: NodeJS.Timeout | undefined = undefined;

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

        logger.log("Lookup dates for watch entries: ", entries);

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
