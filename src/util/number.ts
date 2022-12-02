import { newLogger } from "../bot/logger";

const logger = newLogger("NumberUtils");

export const safeParseNumber = function (s: string): number {
  try {
    return parseFloat(s);
  } catch (e) {
    logger.error(e, "Failed to parse to float: ", s);
    return -1;
  }
};
