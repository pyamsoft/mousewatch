import { DateTime } from "luxon";
import { bold, italic } from "../../bot/discord/format";
import { magicKeyName, MagicKeyType } from "../model/MagicKeyType";
import { BaseResult } from "../model/WatchResult";

export const outputParkAvailability = function (
  userId: string | undefined,
  result: BaseResult
): string {
  const { parkResponse, magicKey } = result;
  return `${userId ? `<@${userId}> ` : ""}${bold(
    parkResponse.date.toLocaleString(DateTime.DATE_MED)
  )}: ${italic(magicKeyName(magicKey))} reservations are ${bold(
    parkResponse.available ? "AVAILABLE" : "BLOCKED"
  )}`;
};

export const outputParkUnknown = function (
  magicKey: MagicKeyType,
  date: DateTime
): string {
  return `${bold(date.toLocaleString(DateTime.DATE_MED))}: ${italic(
    magicKeyName(magicKey)
  )} reservations are ${bold("UNKNOWN")}`;
};
