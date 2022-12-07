import { DateTime } from "luxon";
import { Msg } from "../../bot/message/Msg";
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

export const watchEntryFromMessage = function (data: {
  message: Msg;
  magicKey: MagicKeyType;
  targetDate: DateTime;
}): WatchEntry {
  const { message, ...rest } = data;
  return createWatchEntry({
    ...rest,
    userId: message.author.id,
    userName: message.author.username,
    messageId: message.id,
    channelId: message.channel.id,
  });
};
