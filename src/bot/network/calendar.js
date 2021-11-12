const { disneyApi } = require("../../util/api");
const { DateTime } = require("luxon");
const { CacheMan, MemoryStorageBackend } = require("@runmeetly/cache-man");
const Logger = require("../../logger");
const { CACHE_INTERVAL } = require("../constants");

const logger = Logger.tag("bot/network/calendar");

const NUMBER_MONTHS = 3;

const availabilityCaches = {};

function getCacheFor(magicKey, numberMonths) {
  numberMonths = numberMonths || NUMBER_MONTHS;
  const key = `${magicKey}|${numberMonths}`;
  let cache = availabilityCaches[key];
  if (!cache) {
    cache = CacheMan.create(() => lookupCalendar(magicKey, numberMonths), {
      backend: MemoryStorageBackend.create(CACHE_INTERVAL),
    });
    availabilityCaches[key] = cache;
  }

  return cache.get();
}

function availabilityToModel(availability) {
  return availability
    ? {
        available: availability.available,
        blocked: availability.blocked,
      }
    : {
        available: false,
        blocked: false,
      };
}

function findAvailability(facilities, park) {
  const parkAvailability = facilities.find((f) => f.facilityName === park);
  return availabilityToModel(parkAvailability);
}

function createAvailability(json) {
  const facilities = json.facilities || [];
  const disneyland = findAvailability(facilities, "DLR_DP");
  const californiaAdventure = findAvailability(facilities, "DLR_CA");
  return {
    // Clear times
    date: DateTime.fromISO(json.date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }),
    available: disneyland.available || californiaAdventure.available,
    availability: {
      disneyland,
      californiaAdventure,
    },
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
  dreamKey: function dreamKey(numberMonths) {
    return getCacheFor("dream-key-pass", numberMonths);
  },

  believeKey: function dreamKey(numberMonths) {
    return getCacheFor("believe-key-pass", numberMonths);
  },

  enchantKey: function dreamKey(numberMonths) {
    return getCacheFor("enchant-key-pass", numberMonths);
  },

  imagineKey: function dreamKey(numberMonths) {
    return getCacheFor("imagine-key-pass", numberMonths);
  },
};
