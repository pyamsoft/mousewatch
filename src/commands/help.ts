import { newLogger } from "../bot/logger";
import {
  MessageHandler,
  messageHandlerHelpText,
} from "../bot/message/MessageHandler";
import { Msg } from "../bot/message/Msg";
import { BotConfig } from "../config";
import { ParkCommand } from "./command";
import { outputHelpText } from "./outputs/help";

const TAG = "HelpHandler";
const logger = newLogger(TAG);

export const HelpHandler: MessageHandler = {
  tag: TAG,

  handle: function (
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
      message: Msg;
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
