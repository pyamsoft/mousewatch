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
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { ParkCommand } from "../../commands/command";
import { BotConfig } from "../../config";
import { KeyedObject } from "../model/KeyedObject";
import { MessageEventType } from "../model/MessageEventType";
import { Msg } from "./Msg";

export interface KeyedMessageHandler {
  id: string;
  type: MessageEventType;
  handler: MessageHandler | ReactionHandler;
}

export interface MessageHandlerOutput {
  objectType: "MessageHandlerOutput";
  helpOutput: string;
  messages: KeyedObject<string>;
}

export const messageHandlerOutput = function (
  messages: KeyedObject<string>
): MessageHandlerOutput {
  return {
    objectType: "MessageHandlerOutput",
    helpOutput: "",
    messages,
  };
};

export const messageHandlerHelpText = function (
  message: string
): MessageHandlerOutput {
  return {
    objectType: "MessageHandlerOutput",
    helpOutput: message,
    messages: {},
  };
};

export interface MessageHandler {
  objectType: "MessageHandler";

  tag: string;

  handle: (
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
      message: Msg;
    }
  ) => Promise<MessageHandlerOutput> | undefined;
}

export const newMessageHandler = function (
  tag: string,
  handle: (
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
      message: Msg;
    }
  ) => Promise<MessageHandlerOutput> | undefined
): MessageHandler {
  return {
    objectType: "MessageHandler",
    tag,
    handle,
  };
};

export interface ReactionHandler {
  objectType: "ReactionHandler";

  tag: string;

  handle: (
    config: BotConfig,
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => void;
}

export const newReactionHandler = function (
  tag: string,
  handle: (
    config: BotConfig,
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => void
): ReactionHandler {
  return {
    objectType: "ReactionHandler",
    tag,
    handle,
  };
};
