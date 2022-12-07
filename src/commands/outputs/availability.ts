import { DateTime } from "luxon";
import { bold, italic } from "../../bot/discord/format";
import { magicKeyName, MagicKeyType } from "../model/MagicKeyType";
import { BaseResult } from "../model/WatchResult";

const RESERVE_LINK = "https://disneyland.disney.go.com/entry-reservation/";

export const outputParkAvailability = function (
  userId: string | undefined,
  result: BaseResult
): string {
  const { parkResponse, magicKey } = result;

  const link = parkResponse.available ? `\n${RESERVE_LINK.trim()}` : "";

  return `${userId ? `<@${userId}> ` : ""}${bold(
    parkResponse.date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
  )}: ${italic(magicKeyName(magicKey))} reservations are ${bold(
    parkResponse.available ? "AVAILABLE" : "BLOCKED"
  )}${link}`;
};

export const outputParkUnknown = function (
  magicKey: MagicKeyType,
  date: DateTime
): string {
  return `${bold(
    date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
  )}: ${italic(magicKeyName(magicKey))} reservations are ${bold("UNKNOWN")}`;
};
