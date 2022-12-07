import { DateTime } from "luxon";
import { bold, italic } from "../../bot/discord/format";
import { magicKeyName, MagicKeyType } from "../model/MagicKeyType";

export const outputStopWatch = function (
  magicKey: MagicKeyType,
  date: DateTime
): string {
  return `:negative_squared_cross_mark: Stopped watching ${italic(
    magicKeyName(magicKey)
  )} reservations on ${bold(date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY))}`;
};

export const outputClearWatch = function (
  magicKey: MagicKeyType,
  userName: string
): string {
  return `:negative_squared_cross_mark: Stopped watching ${italic(
    magicKeyName(magicKey)
  )} reservations for ${userName}`;
};

export const outputCancelFailed = function (
  magicKey: MagicKeyType,
  date: DateTime
): string {
  return `:x: Unable to stop watching ${italic(
    magicKeyName(magicKey)
  )} reservations on ${bold(date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY))}`;
};

export const outputClearFailed = function (
  magicKey: MagicKeyType,
  userName: string
): string {
  return `:x: Unable to stop watching ${italic(
    magicKeyName(magicKey)
  )} reservations for ${userName}`;
};
