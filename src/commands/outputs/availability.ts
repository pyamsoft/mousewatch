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
  const stopWatching = userId
    ? `\n(React to this message with an emoji to stop watching, otherwise I will assume you did not get a reservation spot, and will keep watching.)`
    : "";

  return `${userId ? `<@${userId}> ` : ""}${bold(
    parkResponse.date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
  )}: ${italic(magicKeyName(magicKey))} reservations are ${bold(
    parkResponse.available ? "AVAILABLE" : "BLOCKED"
  )}${link}${stopWatching}`;
};

export const outputParkUnknown = function (
  magicKey: MagicKeyType,
  date: DateTime
): string {
  return `${bold(
    date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
  )}: ${italic(magicKeyName(magicKey))} reservations are ${bold("UNKNOWN")}`;
};
