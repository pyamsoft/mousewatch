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
