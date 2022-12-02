import { BotConfig } from "../config";

export enum ParkCommandType {
  SHOW = "SHOW",
  WATCH = "WATCH",
  STOP = "STOP",
  CANCEL = "CANCEL",
  STATUS = "STATUS",
  HELP = "HELP",
  NONE = "NONE",
}

export interface ParkCommand {
  isHelpCommand: boolean;
  type: ParkCommandType;
  dates: string[];
}

const stringContentToArray = function (
  config: BotConfig,
  sliceOut: number,
  content: string
): ParkCommand {
  const { prefix } = config;
  // This is just the prefix
  if (content.split("").every((s) => s === prefix)) {
    return {
      isHelpCommand: true,
      type: ParkCommandType.NONE,
      dates: [],
    };
  }

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // symbol = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = content.slice(sliceOut).trim().split(/\s+/g);

  // Shift out the first element, which is just the ${prefix}
  args.shift();

  // Type of command should be first, dates are the rest
  let rawType = args.shift();

  // No further command was passed, this is just the prefix
  if (!rawType) {
    return {
      isHelpCommand: true,
      type: ParkCommandType.NONE,
      dates: [],
    };
  }

  let type = ParkCommandType.NONE;
  rawType = rawType.toUpperCase();
  if (rawType === ParkCommandType.SHOW) {
    type = ParkCommandType.SHOW;
  } else if (rawType === ParkCommandType.WATCH) {
    type = ParkCommandType.WATCH;
  } else if (rawType === ParkCommandType.STATUS) {
    type = ParkCommandType.STATUS;
  } else if (rawType === ParkCommandType.STOP) {
    type = ParkCommandType.STOP;
  } else if (rawType === ParkCommandType.CANCEL) {
    type = ParkCommandType.CANCEL;
  } else if (rawType === ParkCommandType.HELP) {
    type = ParkCommandType.HELP;
  }

  return {
    isHelpCommand:
      type === ParkCommandType.HELP || type === ParkCommandType.NONE,
    type,
    dates: args,
  };
};

export const stringContentToParkCommand = function (
  config: BotConfig,
  content: string
): ParkCommand {
  const { isHelpCommand, type, dates } = stringContentToArray(
    config,
    0,
    content
  );

  let needsDatesButHasNone = true;
  if (type === ParkCommandType.CANCEL || type === ParkCommandType.STATUS) {
    needsDatesButHasNone = false;
  } else {
    needsDatesButHasNone = dates.length <= 0;
  }

  return {
    isHelpCommand:
      isHelpCommand ||
      type === ParkCommandType.NONE ||
      type === ParkCommandType.HELP ||
      needsDatesButHasNone,
    type,
    dates,
  };
};
