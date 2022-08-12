import { Message, PartialMessage, TextChannel, User } from "discord.js";
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
export declare const logMsg: (m: Msg) => LoggableMsg;
export declare const msgFromMessage: (message: Message | PartialMessage) => Msg;
export declare const editorFromMessage: (message: Message | PartialMessage) => MessageEditor;
export declare const removerFromMessage: (message: Message | PartialMessage) => MessageRemover;
export declare const messageFromMsg: (message: Msg) => Message;
export declare const sendChannelFromMessage: (message: Message | PartialMessage) => SendChannel;
export {};
