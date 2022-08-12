import {
  MessageHandler,
  messageHandlerHelpText,
} from "../bot/message/MessageHandler";
import { newLogger } from "../bot/logger";
import { BotConfig } from "../config";
import { outputHelpText } from "./outputs/help";
import { MouseCommand } from "./MouseCommand";

const TAG = "HelpHandler";
const logger = newLogger(TAG);

export const HelpHandler: MessageHandler = {
  tag: TAG,

  handle: function (
    config: BotConfig,
    command: {
      currentCommand: MouseCommand;
      oldCommand?: MouseCommand;
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
