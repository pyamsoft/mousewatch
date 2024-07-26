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

import { MessageCache } from "./MessageCache";
import { newLogger } from "../logger";
import {
  editorFromMessage,
  MessageEditor,
  messageFromMsg,
  Msg,
  removerFromMessage,
  SendChannel,
} from "./Msg";
import { ensureArray } from "../../util/array";
import { KeyedObject } from "../model/KeyedObject";

const GLOBAL_CACHE_KEY = "global-cache-key";
const logger = newLogger("communicate");

export interface CommunicationResult<T> {
  objectType: "CommunicationResult";
  data: T;
}

export interface CommunicationMessage {
  objectType: "CommunicationMessage";
  message: string;
}

export const createCommunicationMessage = function (
  message: string,
): CommunicationMessage {
  return {
    objectType: "CommunicationMessage",
    message,
  };
};

export const createCommunicationResult = function <T>(
  data: T,
): CommunicationResult<T> {
  return {
    objectType: "CommunicationResult",
    data,
  };
};

const deleteOldMessages = function (
  receivedMessageId: string,
  keys: string[],
  env: {
    cache: MessageCache;
  },
): Promise<void | void[]> {
  const { cache } = env;
  const allOldData = cache.getAll(receivedMessageId);
  const oldContents = Object.keys(allOldData);
  if (oldContents.length <= 0) {
    logger.log("No old contents to delete, continue.");
    return Promise.resolve();
  }

  const work = [];
  for (const key of oldContents) {
    // If the new message replacing this one does not include previous existing content, delete the old message
    // that holds the old content
    if (!keys.includes(key) && oldContents.includes(key)) {
      const oldMessage = allOldData[key];

      // Double check
      if (!oldMessage) {
        continue;
      }

      logger.log("Key existed in old message but not new message, delete it", {
        oldContent: key,
        newContents: keys,
      });

      // We know this to be true
      const remover = removerFromMessage(messageFromMsg(oldMessage));
      const working = remover
        .remove()
        .then((id) => {
          logger.log("Deleted old message: ", {
            key,
            messageId: id,
          });
          cache.remove(receivedMessageId, key);
        })
        .catch((e) => {
          logger.error(e, "Failed to delete old message", {
            key,
            messageId: oldMessage.id,
          });
        });

      // Add to the list of jobs we are waiting for
      work.push(working);
    }
  }

  return Promise.all(work);
};

const postNewMessages = async function (
  messageId: string,
  channel: SendChannel,
  keys: string[],
  messages: KeyedObject<string>,
  env: {
    cache: MessageCache;
  },
): Promise<Msg[]> {
  const work = [];
  for (const key of keys) {
    const messageText = messages[key];
    if (!!messageText && !!messageText.trim()) {
      const working = postMessageToPublicChannel(
        messageId,
        channel,
        messageText,
        {
          ...env,
          cacheKey: key,
          cacheResult: true,
        },
      );

      // Add to the list of jobs we are waiting for
      work.push(working);
    }
  }

  return Promise.all(work).then((results) => {
    const messagesOnly = [];
    for (const msg of results) {
      if (msg) {
        messagesOnly.push(msg);
      }
    }

    return messagesOnly;
  });
};

const editExistingMessage = function (
  receivedMessageId: string,
  editor: MessageEditor,
  oldMessage: Msg,
  messageText: string,
  env: {
    cacheKey: string;
    cache: MessageCache;
    cacheResult: boolean;
  },
): Promise<Msg | undefined> {
  const { cache, cacheKey, cacheResult } = env;
  return new Promise((resolve) => {
    editor
      .edit(messageText)
      .then((newMessage) => {
        logger.log("Updated old message with new content: ", {
          key: cacheKey,
          oldMessageId: oldMessage.id,
          newMessageId: newMessage.id,
          receivedMessageId,
        });
        if (cacheResult) {
          logger.log("Caching update result: ", {
            messageId: receivedMessageId,
            key: cacheKey,
          });
          cache.insert(receivedMessageId, cacheKey, newMessage);
          resolve(newMessage);
        }
      })
      .catch((e) => {
        logger.error(e, "Unable to update old message with new content: ", {
          key: cacheKey,
          oldMessageId: oldMessage.id,
          receivedMessageId,
        });
        resolve(undefined);
      });
  });
};

const sendNewMessageToChannel = function (
  receivedMessageId: string,
  channel: SendChannel,
  messageText: string,
  env: {
    cacheKey: string;
    cache: MessageCache;
    cacheResult: boolean;
  },
): Promise<Msg | undefined> {
  const { cache, cacheKey, cacheResult } = env;
  return new Promise((resolve) => {
    channel
      .send(messageText)
      .then((newMessage) => {
        logger.log("Send new message: ", {
          messageId: newMessage.id,
          receivedMessageId,
          key: cacheKey,
        });

        if (cacheResult) {
          logger.log("Caching new message result: ", {
            messageId: newMessage.id,
            receivedMessageId,
            key: cacheKey,
          });
          cache.insert(receivedMessageId, cacheKey, newMessage);
        }
        resolve(newMessage);
      })
      .catch((e) => {
        logger.error(e, "Unable to send message", {
          key: cacheKey,
          text: messageText,
          receivedMessageId,
        });
        resolve(undefined);
      });
  });
};

const postMessageToPublicChannel = function (
  receivedMessageId: string,
  channel: SendChannel,
  messageText: string,
  env: {
    cacheKey: string;
    cache: MessageCache;
    cacheResult: boolean;
  },
): Promise<Msg | undefined> {
  const { cache, cacheKey } = env;
  const oldMessage =
    !!cacheKey && !!cacheKey.trim()
      ? cache.get(receivedMessageId, cacheKey)
      : undefined;

  if (oldMessage) {
    // We know this to be true
    const editor = editorFromMessage(messageFromMsg(oldMessage));
    return editExistingMessage(
      receivedMessageId,
      editor,
      oldMessage,
      messageText,
      env,
    );
  } else {
    return sendNewMessageToChannel(
      receivedMessageId,
      channel,
      messageText,
      env,
    );
  }
};

export const sendMessage = async function (
  receivedMessageId: string,
  channel: SendChannel,
  content: CommunicationMessage | CommunicationResult<KeyedObject<string>>,
  env: {
    cache: MessageCache;
  },
): Promise<Msg[]> {
  if (content.objectType === "CommunicationMessage") {
    // Plain text message
    return postMessageToPublicChannel(
      receivedMessageId,
      channel,
      content.message,
      {
        ...env,
        cacheKey: GLOBAL_CACHE_KEY,
        cacheResult: true,
      },
    ).then((msg) => {
      if (msg) {
        return ensureArray(msg);
      } else {
        return [];
      }
    });
  } else {
    const { data } = content;
    // Delete any old messages first
    const keys = Object.keys(data);
    return deleteOldMessages(receivedMessageId, keys, env).then(() =>
      postNewMessages(receivedMessageId, channel, keys, data, env),
    );
  }
};
