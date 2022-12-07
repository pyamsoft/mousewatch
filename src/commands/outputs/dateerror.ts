import { bold } from "../../bot/discord/format";

export const outputDateErrorText = function (dateString: string): string {
  return `:cry: Unable to figure out what date you want: "${bold(dateString)}"`;
};

export const outputDateMissingText = function (): string {
  return `:cry: You need to tell me a Date`;
};
