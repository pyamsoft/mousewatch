import { DateTime, SystemZone } from "luxon";
import { newLogger } from "../bot/logger";

const logger = newLogger("DateParser");

const options = { zone: SystemZone.instance };

const parseRawDate = function (content: string): DateTime | undefined {
  try {
    let date = DateTime.fromISO(content, options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromHTTP(content, options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromRFC2822(content, options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM/dd/yyyy", options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM-dd-yyyy", options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM dd yyyy", options);
    if (date.isValid) {
      return date;
    }

    return undefined;
  } catch (e) {
    logger.error(e, "Unable to parse date: ", content);
    return undefined;
  }
};

export const parseDate = function (content: string): DateTime | undefined {
  const date = parseRawDate(content);
  if (!date) {
    return date;
  } else {
    return date.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
};
