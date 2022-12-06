import { DateTime } from "luxon";
import { bold, italic } from "../../bot/discord/format";
import { magicKeyName, MagicKeyType } from "../model/MagicKeyType";
import { LookupResult } from "../model/WatchResult";

export const outputParkAvailability = function (result: LookupResult): string {
  const { parkResponse, magicKey } = result;
  return `${bold(
    parkResponse.date.toLocaleString(DateTime.DATE_SHORT)
  )}: ${italic(magicKeyName(magicKey))} reservations are ${bold(
    parkResponse.available ? "AVAILABLE" : "BLOCKED"
  )}`;
};

export const outputParkUnknown = function (
  magicKey: MagicKeyType,
  date: DateTime
): string {
  return `${bold(date.toLocaleString(DateTime.DATE_SHORT))}: ${italic(
    magicKeyName(magicKey)
  )} reservations are ${bold("UNKNOWN")}`;
};
