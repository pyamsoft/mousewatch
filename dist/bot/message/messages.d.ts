import { BotConfig } from "../../config";
import { Message, PartialMessage } from "discord.js";
import { KeyedMessageHandler } from "./MessageHandler";
import { MessageCache } from "./MessageCache";
import { MessageEventType } from "../model/MessageEventType";
export declare const handleBotMessage: (config: BotConfig, eventType: MessageEventType, message: Message | PartialMessage, optionalOldMessage: Message | PartialMessage | undefined, env: {
    handlers: KeyedMessageHandler[];
    cache: MessageCache;
}) => void;
