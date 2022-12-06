import { DateTime } from "luxon";
import { newLogger } from "../bot/logger";

const logger = newLogger("DateParser");

export const parseDate = function (content: string): DateTime | undefined {
  try {
    let date = DateTime.fromISO(content);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromHTTP(content);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromRFC2822(content);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM/dd/yyyy");
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM-dd-yyyy");
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM dd yyyy");
    if (date.isValid) {
      return date;
    }

    return undefined;
  } catch (e) {
    logger.error(e, "Unable to parse date: ", content);
    return undefined;
  }
};
