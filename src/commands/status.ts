import {
  MessageHandler,
  messageHandlerOutput,
} from "../bot/message/MessageHandler";
import { newLogger } from "../bot/logger";
import { BotConfig } from "../config";
import { ParkCommand, ParkCommandType } from "./command";
import { outputStatusText } from "./outputs/status";

const TAG = "StatusHandler";
const logger = newLogger(TAG);

export const StatusHandler: MessageHandler = {
  tag: TAG,

  handle: function (
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
    }
  ) {
    // Only handle status
    const { currentCommand } = command;
    if (
      currentCommand.isHelpCommand ||
      currentCommand.type !== ParkCommandType.STATUS
    ) {
      return;
    }

    logger.log("Handle status message", currentCommand);
    return Promise.resolve(messageHandlerOutput(outputStatusText(config)));
  },
};
