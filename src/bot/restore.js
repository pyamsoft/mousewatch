const Logger = require("../logger");
const { Client } = require("../client");
const Commands = require("./message/handler");
const Database = require("./db");

const logger = Logger.tag("bot/restore");

module.exports = {
  restoreWatches: async function restoreWatches(watches) {
    for (const watch of watches) {
      const userId = watch.user_id;
      const userName = watch.user_name;
      const messageId = watch.message_id;
      const channelId = watch.channel_id;
      const messageContent = watch.watch_date;
      logger.log("Restore DB watch ", {
        userId,
        userName,
        messageId,
        channelId,
        messageContent,
      });

      let discordChannel;
      if (Client.channels.cache) {
        try {
          discordChannel = await Client.channels.cache.get(channelId);
        } catch (e) {
          logger.error(
            e,
            "Failed to find discord channel in cache: ",
            channelId
          );
          discordChannel = null;
        }
      }

      if (!discordChannel) {
        try {
          discordChannel = Client.channels.fetch(channelId);
        } catch (e) {
          logger.error(e, "Failed to fetch discord channel: ", channelId);
          discordChannel = null;
        }
      }

      if (!discordChannel) {
        logger.error("Could not find discordChannel for watch ", watch);
        Database.markWatchInvalid({
          userId,
          userName,
          messageId,
          channelId,
          watchDateString: messageContent,
        });
        continue;
      }

      Commands.watch({
        oldMessage: null,
        message: {
          id: messageId,
          channel: discordChannel,
          author: {
            id: userId,
            username: userName,
          },
        },
        content: messageContent,
        addToDb: false,
        respond: false,
      });
    }
  },
};
