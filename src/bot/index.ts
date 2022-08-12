import { BotConfig } from "../config";
import { Client, Intents, Message, PartialMessage } from "discord.js";
import { newLogger } from "./logger";
import { KeyedMessageHandler, MessageHandler } from "./message/MessageHandler";
import { KeyedObject } from "./model/KeyedObject";
import { generateRandomId } from "./model/id";
import { Listener, newListener } from "./model/listener";
import { handleBotMessage } from "./message/messages";
import { createMessageCache } from "./message/MessageCache";
import { MessageEventType, MessageEventTypes } from "./model/MessageEventType";

const logger = newLogger("DiscordBot");

export interface DiscordBot {
  login: () => Promise<boolean>;

  addHandler: (type: MessageEventType, handler: MessageHandler) => string;

  removeHandler: (id: string) => boolean;

  watchMessages: (onStop: () => void) => Listener;
}

export const initializeBot = function (config: BotConfig): DiscordBot {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGES,
    ],
    partials: ["MESSAGE", "CHANNEL"],
  });

  const handlers: KeyedObject<KeyedMessageHandler | undefined> = {};
  const messageCache = createMessageCache();

  // Keep this cached to avoid having to recalculate it each time
  let handlerList: KeyedMessageHandler[] = [];

  const messageHandler = function (message: Message | PartialMessage) {
    handleBotMessage(config, MessageEventTypes.CREATE, message, undefined, {
      handlers: handlerList,
      cache: messageCache,
    });
  };

  const messageUpdateHandler = function (
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage
  ) {
    handleBotMessage(config, MessageEventTypes.UPDATE, newMessage, oldMessage, {
      handlers: handlerList,
      cache: messageCache,
    });
  };

  return Object.freeze({
    addHandler: function (type: MessageEventType, handler: MessageHandler) {
      const id = generateRandomId();
      handlers[id] = { id, handler, type };
      logger.log("Add new handler: ", handlers[id]);
      handlerList = Object.values(handlers).filter(
        (h) => !!h
      ) as KeyedMessageHandler[];
      return id;
    },
    removeHandler: function (id: string) {
      if (handlers[id]) {
        logger.log("Removed handler: ", handlers[id]);
        handlers[id] = undefined;
        handlerList = Object.values(handlers).filter(
          (h) => !!h
        ) as KeyedMessageHandler[];
        return true;
      } else {
        return false;
      }
    },
    watchMessages: function (onStop: () => void) {
      const readyHandler = function () {
        logger.log("Bot is ready!");
        logger.log("Watch for messages");
        client.on(MessageEventTypes.CREATE, messageHandler);
        client.on(MessageEventTypes.UPDATE, messageUpdateHandler);
      };

      const errorHandler = function (error: Error) {
        logger.error(error, "BOT ERROR");
        client.off("ready", readyHandler);
        client.off(MessageEventTypes.CREATE, messageHandler);
        client.off(MessageEventTypes.UPDATE, messageUpdateHandler);
        onStop();
      };

      client.on("error", errorHandler);

      logger.log("Wait until bot is ready");
      client.once("ready", readyHandler);
      return newListener(() => {
        logger.log("Stop watching for messages");
        client.off("ready", readyHandler);
        client.off(MessageEventTypes.CREATE, messageHandler);
        client.off(MessageEventTypes.UPDATE, messageUpdateHandler);
        onStop();
      });
    },
    login: function () {
      const { token } = config;
      return client
        .login(token)
        .then(() => {
          logger.log("Bot logged in!");
          return true;
        })
        .catch((e) => {
          logger.error(e, "Error logging in");
          return false;
        });
    },
  });
};
