import {
  Message,
  MessageReaction,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { stringContentToParkCommand } from "../../commands/command";
import { BotConfig } from "../../config";
import { newLogger } from "../logger";
import { KeyedObject } from "../model/KeyedObject";
import { MessageEventType, MessageEventTypes } from "../model/MessageEventType";
import {
  createCommunicationMessage,
  createCommunicationResult,
  sendMessage,
} from "./communicate";
import { MessageCache } from "./MessageCache";
import {
  KeyedMessageHandler,
  MessageHandler,
  MessageHandlerOutput,
  ReactionHandler,
} from "./MessageHandler";
import {
  logMsg,
  Msg,
  msgFromMessage,
  SendChannel,
  sendChannelFromMessage,
} from "./Msg";
import { validateMessage } from "./validate";

const logger = newLogger("messages");

const sendMessageAfterParsing = function (
  results: MessageHandlerOutput[],
  message: Msg,
  sendChannel: SendChannel,
  env: {
    handlers: KeyedMessageHandler[];
    cache: MessageCache;
  }
) {
  // None of our handlers have done this, if we continue, behavior is undefined
  if (results.length <= 0) {
    logger.warn("No results, unhandled message: ", logMsg(message));
    return;
  }

  const combinedOutputs: KeyedObject<string> = {};
  for (const res of results) {
    // Any help outputs immediately stop the message sending
    if (!!res.helpOutput && !!res.helpOutput.trim()) {
      sendMessage(
        message.id,
        sendChannel,
        createCommunicationMessage(res.helpOutput),
        env
      ).then((responded) => {
        logger.log("Responded with help text", !!responded);
      });
      return;
    } else {
      for (const key of Object.keys(res.messages)) {
        combinedOutputs[key] = res.messages[key];
      }
    }
  }

  // Otherwise we've collected all of our output, so spit it out into a single message
  sendMessage(
    message.id,
    sendChannel,
    createCommunicationResult(combinedOutputs),
    env
  ).then((responded) => {
    logger.log(
      "Responded with combined output for keys: ",
      Object.keys(combinedOutputs),
      !!responded
    );
  });
};

export const handleBotMessage = function (
  config: BotConfig,
  eventType: MessageEventType,
  message: Message | PartialMessage,
  optionalOldMessage: Message | PartialMessage | undefined,
  env: {
    handlers: KeyedMessageHandler[];
    cache: MessageCache;
  }
) {
  // Reactions are handled by a different function
  if (eventType === MessageEventTypes.REACTION) {
    return;
  }

  const msg = msgFromMessage(message);

  // Normal message handling
  if (!validateMessage(config, msg)) {
    return;
  }

  const oldMsg = optionalOldMessage
    ? msgFromMessage(optionalOldMessage)
    : undefined;

  const sendChannel = sendChannelFromMessage(message);
  const current = stringContentToParkCommand(config, msg.content);
  const old = oldMsg
    ? stringContentToParkCommand(config, oldMsg.content)
    : undefined;

  const work: Promise<MessageHandlerOutput>[] = [];
  const { handlers } = env;
  for (const item of handlers) {
    // If it was removed, skip it
    if (!item) {
      continue;
    }

    const { handler, id, type } = item;
    if (type === eventType) {
      let output: Promise<MessageHandlerOutput> | undefined = undefined;
      if (handler.objectType === "MessageHandler") {
        const messageHandler = handler as MessageHandler;
        output = messageHandler.handle(config, {
          currentCommand: current,
          oldCommand: old,
          message: msg,
        });
      } else {
        logger.warn(
          "Handler type cannot handle bot messages: ",
          handler.objectType
        );
        return;
      }

      if (output) {
        logger.log("Pass message to handler: ", {
          id,
          type,
          name: handler.tag,
        });
        work.push(output);
      }
    }
  }

  Promise.all(work).then((outputs) =>
    sendMessageAfterParsing(outputs, msg, sendChannel, env)
  );
};

export const handleBotMessageReaction = function (
  config: BotConfig,
  eventType: MessageEventType,
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  env: {
    handlers: KeyedMessageHandler[];
    cache: MessageCache;
  }
) {
  // Messages are handled by a different function
  if (eventType !== MessageEventTypes.REACTION) {
    return;
  }

  const { handlers } = env;
  for (const item of handlers) {
    // If it was removed, skip it
    if (!item) {
      continue;
    }

    const { handler, type } = item;
    if (type === eventType) {
      if (handler.objectType === "ReactionHandler") {
        const reactionHandler = handler as ReactionHandler;
        reactionHandler.handle(config, reaction, user);
      } else {
        logger.warn(
          "Handler type cannot handle bot reactions: ",
          handler.objectType
        );
        return;
      }
    }
  }
};
