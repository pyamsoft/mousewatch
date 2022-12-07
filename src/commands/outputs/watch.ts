import { DateTime } from "luxon";
import { bold, italic } from "../../bot/discord/format";
import { magicKeyName, MagicKeyType } from "../model/MagicKeyType";

export const outputWatchStarted = function (
  magicKey: MagicKeyType,
  date: DateTime
): string {
  return `:thumbsup: Watching ${italic(
    magicKeyName(magicKey)
  )} reservations on ${bold(
    date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
  )}`;
};
