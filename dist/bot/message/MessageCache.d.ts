import { Msg } from "./Msg";
import { KeyedObject } from "../model/KeyedObject";
export interface MessageCache {
    insert: (messageId: string, key: string, message: Msg) => void;
    get: (messageId: string, key: string) => Msg | undefined;
    getAll: (messageId: string) => KeyedObject<Msg>;
    remove: (messageId: string, key: string) => void;
    removeAll: (messageId: string) => void;
}
export declare const createMessageCache: (timeout?: number) => MessageCache;
