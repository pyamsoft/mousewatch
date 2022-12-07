import { Message, MessageReaction, PartialMessage } from "discord.js";

export interface ReactionChannel {
  /**
   * @param emoji - either a custom emoji.id or a unicode emoji.name
   */
  react: (emoji: string) => Promise<MessageReaction>;
}

export const reactionChannelFromMessage = function (
  message: Message | PartialMessage
): ReactionChannel {
  return {
    react: function (emoji: string) {
      return message.react(emoji);
    },
  };
};
