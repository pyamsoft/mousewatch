import { Msg } from "./Msg";
import { BotConfig } from "../../config";
export declare const validateMessageHasId: (message: Msg) => boolean;
export declare const validateMessageIsNotFromBot: (message: Msg) => boolean;
export declare const validateMessageHasChannel: (message: Msg) => boolean;
export declare const validateMessageIsTextChannel: (message: Msg) => boolean;
export declare const validateMessageIsSpecificChannel: (config: BotConfig, message: Msg) => boolean;
export declare const validateMessageIsWatched: (config: BotConfig, message: Msg) => boolean;
export declare const validateMessage: (config: BotConfig, message: Msg) => boolean;
