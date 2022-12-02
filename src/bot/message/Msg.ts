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
  message: Message | PartialMessage
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
  message: Message | PartialMessage
): MessageEditor {
  return {
    edit: function (newMessageText: string) {
      return (message as Message)
        .edit(newMessageText)
        .then((msg) => msgFromMessage(msg));
    },
  };
};

export const removerFromMessage = function (
  message: Message | PartialMessage
): MessageRemover {
  return {
    remove: function () {
      return (message as Message).delete().then((msg) => msg.id);
    },
  };
};

export const messageFromMsg = function (message: Msg): Message {
  return (message as DiscordMsg).raw;
};

export const sendChannelFromMessage = function (
  message: Message | PartialMessage
): SendChannel {
  return {
    send: function (messageText: string) {
      const channel = (message as Message).channel;
      // Typescript is lame but I know this field exists on a message channel
      return (channel as unknown as PartialTextBasedChannelFields)
        .send(messageText)
        .then((msg) => msgFromMessage(msg));
    },
  };
};
