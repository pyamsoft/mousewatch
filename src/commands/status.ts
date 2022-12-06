import { newLogger } from "../bot/logger";
import {
  MessageHandler,
  messageHandlerHelpText,
  MessageHandlerOutput,
} from "../bot/message/MessageHandler";
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
      postExtraMessage: (output: MessageHandlerOutput) => void;
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
    return outputStatusText(config).then((text) =>
      messageHandlerHelpText(text)
    );
  },
};
