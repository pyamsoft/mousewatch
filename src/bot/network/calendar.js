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

/**
 * String data returned when there is no availability
 */
const AVAILABILITY_BLOCKED = "cms-key-no-availability";

/**
 * Cached for long term
 */
const availabilityCaches = {};

/**
 * Cached for the duration of the request and then cleared
 */
const availabilityDebouncers = {};

function getCacheKey(force, magicKey) {
  return `${force}|${magicKey}`;
}

function getCacheFor(caches, key) {
  let cache = caches[key];
  if (!cache) {
    cache = CacheMan.create(
      (magicKey) => lookupCalendar(magicKey, NUMBER_MONTHS),
      {
        backend: MemoryStorageBackend.create(CACHE_INTERVAL),
      }
    );
    caches[key] = cache;
  }

  return cache;
}

function createAvailability(json) {
  logger.log("Available: ", json)
  return {
    // Clear times
    json,
    date: DateTime.fromISO(json.date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }),
    available: json.availability && json.availability !== AVAILABILITY_BLOCKED,
  };
}

function createAvailabilityList(json) {
  const cal = json[0];
  const list = cal["calendar-availabilities"];
  return (list || []).map(createAvailability);
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

function getData(force, magicKey) {
  const key = getCacheKey(force, magicKey);
  const cache = getCacheFor(
    force ? availabilityDebouncers : availabilityCaches,
    key
  );

  return cache.get(magicKey).finally(() => {
    if (force) {
      logger.log("Upstream request debounced for:", key);
      cache.clear();
    }
  });
}

module.exports = {
  dreamKey: function dreamKey(force) {
    return getData(force, "dream-key-pass");
  },

  believeKey: function believeKey(force) {
    return getData(force, "believe-key-pass");
  },

  enchantKey: function enchantKey(force) {
    return getData(force, "enchant-key-pass");
  },

  imagineKey: function imagineKey(force) {
    return getData(force, "imagine-key-pass");
  },
};
