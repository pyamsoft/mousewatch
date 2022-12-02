import { BotConfig } from "../../config";
import { codeBlock } from "../../bot/discord/format";

export const outputHelpText = function (config: BotConfig): string {
  const { prefix } = config;

  return codeBlock(`
Beep Boop.

[COMMANDS]
${prefix}                   This help
${prefix} help              This help
${prefix} status            Prints the status of the bot

${prefix} show <DATE>       Show park availability for a DATE
${prefix} watch <DATE>      Watch park availability for a DATE
${prefix} stop <DATE>       Stop watching a DATE
${prefix} cancel            Cancel all pending watch commands

[EXAMPLE]

Examples HERE

`);
};
