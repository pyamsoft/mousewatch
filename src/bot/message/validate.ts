import { Msg } from "./Msg";
import { BotConfig } from "../../config";
import { Channel } from "discord.js";

export const validateMessageHasId = function (message: Msg): boolean {
  return !!message.id;
};

export const validateMessageIsNotFromBot = function (message: Msg): boolean {
  return !message.author.bot;
};

export const validateMessageHasChannel = function (message: Msg): boolean {
  return !!message.channel;
};

export const validateMessageIsTextChannel = function (message: Msg): boolean {
  const type = message.channel.type;
  return type === "GUILD_TEXT" || type === "DM";
};

export const validateMessageIsSpecificChannel = function (
  config: BotConfig,
  message: Msg
): boolean {
  if (config.specificChannel) {
    // I know this works, discord is dumb
    const ch = message.channel as unknown as Channel;
    return ch.id === config.specificChannel;
  } else {
    return true;
  }
};

export const validateMessageIsWatched = function (
  config: BotConfig,
  message: Msg
): boolean {
  // Should be "!mouse " like "!mouse show" not "!mouseshow"
  const content = message.content;
  return content === config.prefix || content.startsWith(`${config.prefix} `);
};

export const validateMessage = function (
  config: BotConfig,
  message: Msg
): boolean {
  if (!validateMessageHasId(message)) {
    return false;
  }

  if (!validateMessageIsNotFromBot(message)) {
    return false;
  }

  if (!validateMessageHasChannel(message)) {
    return false;
  }

  if (!validateMessageIsTextChannel(message)) {
    return false;
  }

  if (!validateMessageIsSpecificChannel(config, message)) {
    return false;
  }

  if (!validateMessageIsWatched(config, message)) {
    return false;
  }

  // Looks good
  return true;
};
