/*
 * Copyright 2024 pyamsoft
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

import {
  Message,
  PartialMessage,
  PartialTextBasedChannelFields,
  TextChannel,
  User,
} from "discord.js";

interface DiscordMsg extends Msg {
  raw: Message;
}

interface LoggableMsg {
  id: string;
  content: string;
}

export interface Msg extends LoggableMsg {
  channel: TextChannel;
  author: User;
}

export interface MessageEditor {
  edit: (newMessageText: string) => Promise<Msg>;
}

export interface MessageRemover {
  remove: () => Promise<string>;
}

export interface SendChannel {
  send: (messageText: string) => Promise<Msg>;
}

export const logMsg = function (m: Msg): LoggableMsg {
  return {
    id: m.id,
    content: m.content,
  };
};

export const msgFromMessage = function (
  message: Message | PartialMessage,
): Msg {
  return {
    id: message.id,
    author: message.author as User,
    channel: message.channel as TextChannel,
    content: message.content as string,
    raw: message as Message,
  } as DiscordMsg;
};

export const editorFromMessage = function (
  message: Message | PartialMessage,
): MessageEditor {
  return {
    edit: async function (newMessageText: string) {
      return (message as Message)
        .edit(newMessageText)
        .then((msg) => msgFromMessage(msg));
    },
  };
};

export const removerFromMessage = function (
  message: Message | PartialMessage,
): MessageRemover {
  return {
    remove: async function () {
      return (message as Message).delete().then((msg) => msg.id);
    },
  };
};

export const messageFromMsg = function (message: Msg): Message {
  return (message as DiscordMsg).raw;
};

export const sendChannelFromMessage = function (
  message: Message | PartialMessage,
): SendChannel {
  return {
    send: async function (messageText: string) {
      const channel = (message as Message).channel;
      // Typescript is lame but I know this field exists on a message channel
      return (channel as unknown as PartialTextBasedChannelFields)
        .send(messageText)
        .then((msg) => msgFromMessage(msg));
    },
  };
};
