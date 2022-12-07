import { newLogger } from "../bot/logger";
import {
  messageHandlerHelpText,
  newMessageHandler,
} from "../bot/message/MessageHandler";
import { Msg } from "../bot/message/Msg";
import { BotConfig } from "../config";
import { ParkCommand, ParkCommandType } from "./command";
import { outputStatusText } from "./outputs/status";

const TAG = "StatusHandler";
const logger = newLogger(TAG);

export const StatusHandler = newMessageHandler(
  TAG,
  function (
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
      message: Msg;
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
  }
);
