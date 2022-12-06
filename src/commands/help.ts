import {
  MessageHandler,
  messageHandlerHelpText, MessageHandlerOutput,
} from "../bot/message/MessageHandler";
import { newLogger } from "../bot/logger";
import { BotConfig } from "../config";
import { outputHelpText } from "./outputs/help";
import { ParkCommand } from "./command";

const TAG = "HelpHandler";
const logger = newLogger(TAG);

export const HelpHandler: MessageHandler = {
  tag: TAG,

  handle: function (
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
      postExtraMessage: (output: MessageHandlerOutput) => void;
    }
  ) {
    // Only handle help
    const { currentCommand } = command;
    if (!currentCommand.isHelpCommand) {
      return;
    }

    logger.log("Handle help message", currentCommand);
    return Promise.resolve(messageHandlerHelpText(outputHelpText(config)));
  },
};
