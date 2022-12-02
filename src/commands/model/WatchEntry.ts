import { DateTime } from "luxon";
import { MagicKeyType } from "./MagicKeyType";

export interface WatchEntry {
  objectType: "WatchEntry";

  userId: string;
  userName: string;
  messageId: string;
  channelId: string;

  // Info
  magicKey: MagicKeyType;
  targetDate: DateTime;
}

export const createWatchEntry = function (data: {
  userId: string;
  userName: string;
  messageId: string;
  channelId: string;

  // Info
  magicKey: MagicKeyType;
  targetDate: DateTime;
}): WatchEntry {
  return {
    objectType: "WatchEntry",
    ...data,
  };
};
