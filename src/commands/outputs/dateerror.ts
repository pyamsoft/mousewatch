import { codeBlock } from "../../bot/discord/format";

export const outputDateErrorText = function (dateString: string): string {
  return codeBlock(`Unable to figure out what date you want: "${dateString}"`);
};
