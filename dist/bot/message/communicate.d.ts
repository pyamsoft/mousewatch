import { MessageCache } from "./MessageCache";
import { Msg, SendChannel } from "./Msg";
import { KeyedObject } from "../model/KeyedObject";
export interface CommunicationResult<T> {
    objectType: "CommunicationResult";
    data: T;
}
export interface CommunicationMessage {
    objectType: "CommunicationMessage";
    message: string;
}
export declare const createCommunicationMessage: (message: string) => CommunicationMessage;
export declare const createCommunicationResult: <T>(data: T) => CommunicationResult<T>;
export declare const sendMessage: (receivedMessageId: string, channel: SendChannel, content: CommunicationMessage | CommunicationResult<KeyedObject<string>>, env: {
    cache: MessageCache;
}) => Promise<Msg[]>;
