import { Message, PartialMessage } from "discord.js";
import { stringContentToParkCommand } from "../../commands/command";
import { BotConfig } from "../../config";
import { newLogger } from "../logger";
import { KeyedObject } from "../model/KeyedObject";
import { MessageEventType } from "../model/MessageEventType";
import {
  createCommunicationMessage,
  createCommunicationResult,
  sendMessage,
} from "./communicate";
import { MessageCache } from "./MessageCache";
import { KeyedMessageHandler, MessageHandlerOutput } from "./MessageHandler";
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
  const msg = msgFromMessage(message);
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

  const postMessage = function (outputs: MessageHandlerOutput[]) {
    sendMessageAfterParsing(outputs, msg, sendChannel, env);
  };

  const work: Promise<MessageHandlerOutput>[] = [];
  const { handlers } = env;
  for (const item of handlers) {
    // If it was removed, skip it
    if (!item) {
      continue;
    }

    const { handler, id, type } = item;
    if (type === eventType) {
      const output = handler.handle(config, {
        currentCommand: current,
        oldCommand: old,
        postExtraMessage: (output) => {
          logger.log("Posting extra message:", {
            id,
            type,
            name: handler.tag,
            output,
            message: msg,
            sendChannel,
            env,
          });
          postMessage([output]);
        },
      });
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

  Promise.all(work).then(postMessage);
};
