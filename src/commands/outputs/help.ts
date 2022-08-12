import { BotConfig } from "../../config";
import { codeBlock } from "../../bot/discord/format";

export const outputHelpText = function (config: BotConfig): string {
  const { prefix } = config;

  const p = function (text: string): string {
    return `${prefix}${text}`;
  };

  return codeBlock(`
Beep Boop.

[COMMANDS]
${p("                       This help")}

What is my purpose?
`);
};
