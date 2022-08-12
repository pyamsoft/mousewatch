import { BotConfig } from "../../config";
import { KeyedObject } from "../model/KeyedObject";
import { MouseCommand } from "../../commands/MouseCommand";
export interface KeyedMessageHandler {
    id: string;
    type: "messageCreate" | "messageUpdate";
    handler: MessageHandler;
}
export interface MessageHandlerOutput {
    objectType: "MessageHandlerOutput";
    helpOutput: string;
    messages: KeyedObject<string>;
}
export declare const messageHandlerOutput: (messages: KeyedObject<string>) => MessageHandlerOutput;
export declare const messageHandlerHelpText: (message: string) => MessageHandlerOutput;
export interface MessageHandler {
    tag: string;
    handle: (config: BotConfig, command: {
        currentCommand: MouseCommand;
        oldCommand?: MouseCommand;
    }) => Promise<MessageHandlerOutput> | undefined;
}
