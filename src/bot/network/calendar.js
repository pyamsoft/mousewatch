const { disneyApi } = require("../../util/api");
const { DateTime } = require("luxon");
const { CacheMan, MemoryStorageBackend } = require("@runmeetly/cache-man");
const Logger = require("../../logger");
const { CACHE_INTERVAL } = require("../constants");

const logger = Logger.tag("bot/network/calendar");

/**
 * For some reason, it only works like the website with 13.
 */
const NUMBER_MONTHS = 13;

const availabilityCaches = {};

function getCacheFor(force, magicKey) {
  const numberMonths = NUMBER_MONTHS;

  // If force, bypass cache
  if (force) {
    return lookupCalendar(magicKey, numberMonths);
  }

  const key = `${magicKey}|${numberMonths}`;
  let cache = availabilityCaches[key];
  if (!cache) {
    cache = CacheMan.create(
      (magicKey, numberMonths) => lookupCalendar(magicKey, numberMonths),
      {
        backend: MemoryStorageBackend.create(CACHE_INTERVAL),
      }
    );
    availabilityCaches[key] = cache;
  }

  return cache.get(magicKey, numberMonths);
}

function createAvailability(json) {
  return {
    // Clear times
    json,
    date: DateTime.fromISO(json.date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }),
    available:
      json.availability && json.availability !== "cms-key-no-availability",
  };
}

function createAvailabilityList(json) {
  return (json["calendar-availabilities"] || []).map(createAvailability);
}

function lookupCalendar(magicKey, numberMonths) {
  logger.log("Hit upstream calendar endpoint", {
    magicKey,
    numberMonths,
  });
  return disneyApi(
    `https://disneyland.disney.go.com/passes/blockout-dates/api/get-availability/?product-types=${magicKey}&destinationId=DLR&numMonths=${numberMonths}`
  )
    .then(createAvailabilityList)
    .catch((e) => {
      logger.error(e, "Error getting DLR availability", {
        magicKey,
        numberMonths,
      });
      return [];
    });
}

module.exports = {
  dreamKey: function dreamKey(force) {
    return getCacheFor(force, "dream-key-pass");
  },

  believeKey: function believeKey(force) {
    return getCacheFor(force, "believe-key-pass");
  },

  enchantKey: function enchantKey(force) {
    return getCacheFor(force, "enchant-key-pass");
  },

  imagineKey: function imagineKey(force) {
    return getCacheFor(force, "imagine-key-pass");
  },
};
