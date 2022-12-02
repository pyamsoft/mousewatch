import { newLogger } from "../bot/logger";

const logger = newLogger("ParkCalendarLookupLooper");

// Have we started?
let looping = false;

// The timer
let loopTimer: any = undefined;

const beginLooping = function (command: () => void) {
  stopLooping();

  loopTimer = setInterval(() => {
    logger.log("Loop firing command");
    command();
  }, 60 * 1000);
};

const stopLooping = function () {
  if (loopTimer) {
    logger.log("Clearing loop timer");
    clearInterval(loopTimer);
    loopTimer = undefined;
  }
};

export const ParkCalendarLookupLooper = {
  loop: function () {
    if (looping) {
      logger.log("loop() called but already looping");
      return;
    }

    logger.log("Begin loop!");
    beginLooping(() => {
        
    });
  },

  stop: function () {
    if (!looping) {
      logger.log("stop() called but not looping");
      return;
    }

    logger.log("Stop loop!");
    stopLooping();
  },
};
