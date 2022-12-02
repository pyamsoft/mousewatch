import { MagicKeyType } from "../commands/model/MagicKeyType";
import { newLogger } from "../bot/logger";
import { ParkCalendarResponse } from "../commands/model/ParkCalendarResponse";
import { DateTime } from "luxon";
import { jsonApi } from "../util/api";

const logger = newLogger("MagicKeyCalendarApi");

/**
 * The Disney API blocks us unless we spoof our user agent to Firefox
 */
const DISNEY_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:93.0) Gecko/20100101 Firefox/93.0",
};

/**
 * For some reason, it only works like the website with 13.
 */
const NUMBER_MONTHS = 13;

/**
 * String data returned when there is no availability
 */
const AVAILABILITY_BLOCKED = "cms-key-no-availability";

function createAvailability(json: any): ParkCalendarResponse {
  return {
    objectType: "ParkCalendarResponse",
    json,
    date: DateTime.fromISO(json.date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }),
    available:
      !!json.availability && json.availability !== AVAILABILITY_BLOCKED,
  };
}

function createAvailabilityList(json: any): ParkCalendarResponse[] {
  const cal = json[0];
  if (!cal) {
    logger.warn("Missing cal object in json list response: ", json);
    return [];
  }

  const list = cal["calendar-availabilities"];
  if (!list || list.length <= 0) {
    return [];
  }
  return list.map(createAvailability);
}

function lookupCalendar(
  magicKey: MagicKeyType,
  numberMonths: number
): Promise<ParkCalendarResponse[]> {
  logger.log("Hit upstream calendar endpoint", {
    magicKey,
    numberMonths,
  });
  return jsonApi(
    `https://disneyland.disney.go.com/passes/blockout-dates/api/get-availability/?product-types=${magicKey}&destinationId=DLR&numMonths=${numberMonths}`,
    DISNEY_HEADERS
  )
    .then(createAvailabilityList)
    .catch((e: any) => {
      logger.error(e, "Error getting DLR availability", {
        magicKey,
        numberMonths,
      });
      return [];
    });
}

const getData = function (
  magicKey: MagicKeyType
): Promise<ParkCalendarResponse[]> {
  return lookupCalendar(magicKey, NUMBER_MONTHS);
};

export const MagicKeyCalendarApi = {
  inspireKey: function dreamKey() {
    return getData(MagicKeyType.INSPIRE);
  },

  dreamKey: function dreamKey() {
    return getData(MagicKeyType.DREAM);
  },
};
