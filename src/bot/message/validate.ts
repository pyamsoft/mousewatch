/*
 * Copyright 2023 pyamsoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Msg } from "./Msg";
import { BotConfig } from "../../config";
import { Channel, ChannelType } from "discord.js";

const validateMessageHasId = function (message: Msg): boolean {
  return !!message.id;
};

const validateMessageIsNotFromBot = function (message: Msg): boolean {
  return !message.author.bot;
};

const validateMessageHasChannel = function (message: Msg): boolean {
  return !!message.channel;
};

const validateMessageIsTextChannel = function (message: Msg): boolean {
  const type = message.channel.type;

  // This does exist in the source?
  // noinspection JSUnresolvedReference
  return type === ChannelType.GuildText || type === ChannelType.DM;
};

const validateMessageIsTargetedChannel = function (
    config: BotConfig,
    message: Msg,
): boolean {
  if (config.targetedChannels && config.targetedChannels.length > 0) {
    // I know this works, discord is dumb
    const ch = message.channel as unknown as Channel;
    return config.targetedChannels.some((c) => ch.id === c);
  } else {
    return true;
  }
};

const validateMessageIsWatched = function (
  config: BotConfig,
  message: Msg,
): boolean {
  // Should be "!mouse " like "!mouse show" not "!mouseshow"
  const content = message.content;
  return content === config.prefix || content.startsWith(`${config.prefix} `);
};

export const validateMessage = function (
  config: BotConfig,
  message: Msg,
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

  const type = message.channel.type;

  // This does exist in the source?
  // noinspection JSUnresolvedReference
  if (type === ChannelType.GuildText) {
    if (!validateMessageIsTargetedChannel(config, message)) {
      return false;
    }
  }

  if (!validateMessageIsWatched(config, message)) {
    return false;
  }

  // Looks good
  return true;
};
