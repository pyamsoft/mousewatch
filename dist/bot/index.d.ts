import { BotConfig } from "../config";
import { MessageHandler } from "./message/MessageHandler";
import { Listener } from "./model/listener";
import { MessageEventType } from "./model/MessageEventType";
export interface DiscordBot {
    login: () => Promise<boolean>;
    addHandler: (type: MessageEventType, handler: MessageHandler) => string;
    removeHandler: (id: string) => boolean;
    watchMessages: (onStop: () => void) => Listener;
}
export declare const initializeBot: (config: BotConfig) => DiscordBot;
