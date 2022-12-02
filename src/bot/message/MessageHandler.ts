import { BotConfig } from "../../config";
import { KeyedObject } from "../model/KeyedObject";
import { ParkCommand } from "../../commands/command";

export interface KeyedMessageHandler {
  id: string;
  type: "messageCreate" | "messageUpdate";
  handler: MessageHandler;
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
  tag: string;

  handle: (
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
    }
  ) => Promise<MessageHandlerOutput> | undefined;
}
