import { DateTime } from "luxon";
import { MagicKeyType } from "./MagicKeyType";
import { ParkCalendarResponse } from "./ParkCalendarResponse";
import { WatchEntry } from "./WatchEntry";

export interface LookupResult {
  objectType: "LookupResult";

  // Info
  magicKey: MagicKeyType;
  targetDate: DateTime;
  parkResponse: ParkCalendarResponse;
}

export interface WatchResult {
  objectType: "WatchResult";
  userId: string;
  userName: string;
  messageId: string;
  channelId: string;

  // Info
  magicKey: MagicKeyType;
  targetDate: DateTime;

  // Response
  parkResponse: ParkCalendarResponse;
}

export const createLookupResult = function (
  magicKey: MagicKeyType,
  date: DateTime,
  response: ParkCalendarResponse
): LookupResult {
  return {
    objectType: "LookupResult",

    magicKey: magicKey,
    targetDate: date,
    parkResponse: response,
  };
};

export const createResultFromEntry = function (
  entry: WatchEntry,
  response: ParkCalendarResponse
): WatchResult {
  return {
    objectType: "WatchResult",
    userId: entry.userId,
    userName: entry.userName,
    messageId: entry.messageId,
    channelId: entry.channelId,

    magicKey: entry.magicKey,
    targetDate: entry.targetDate,

    parkResponse: response,
  };
};
