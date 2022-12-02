import { BotConfig } from "../../config";
import { codeBlock } from "../../bot/discord/format";
import { KeyedObject } from "../../bot/model/KeyedObject";

export const outputStatusText = function (
  config: BotConfig
): KeyedObject<string> {
  const { prefix } = config;

  const outputs: KeyedObject<string> = {};

  outputs["STATUS"] = codeBlock(`
  STATUS ${prefix}
`);

  return outputs;
};
