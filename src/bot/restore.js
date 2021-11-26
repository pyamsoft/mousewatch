const Logger = require("../logger");
const { Client } = require("../client");
const Commands = require("./message/handler");
const Database = require("./db");

const logger = Logger.tag("bot/restore");

module.exports = {
  restoreWatches: function restoreWatches(watches) {
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
        discordChannel = Client.channels.cache.get(channelId);
      } else {
        discordChannel = Client.channels.fetch(channelId);
      }

      if (!discordChannel) {
        logger.error("Could not find discordChannel for watch ", watch);
        Database.removeWatch({
          userId,
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
