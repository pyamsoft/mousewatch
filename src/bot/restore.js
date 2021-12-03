const Logger = require("../logger");
const { Client } = require("../client");
const Commands = require("./message/handler");
const Database = require("./db");

const logger = Logger.tag("bot/restore");

async function getUser(userId) {
  let user;
  try {
    user = await Client.users.fetch(userId);
  } catch (e) {
    logger.error(e, "Failed to fetch user: ", userId);
    user = null;
  }

  return user;
}

async function getChannel(user, channelId) {
  let discordChannel;

  if (Client.channels.cache) {
    try {
      discordChannel = await Client.channels.cache.get(channelId);
    } catch (e) {
      logger.error(e, "Failed to find discord channel in cache: ", channelId);
      discordChannel = null;
    }
  }

  if (!discordChannel) {
    try {
      discordChannel = await Client.channels.fetch(channelId);
    } catch (e) {
      logger.error(e, "Failed to fetch discord channel: ", channelId);
      discordChannel = null;
    }
  }

  // Maybe is a dm
  if (!discordChannel) {
    discordChannel = user.dmChannel;
  }

  return discordChannel;
}

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

      const user = await getUser(userId);
      logger.log("User: ", user);
      if (!user) {
        logger.error("Could not find user for watch ", watch);
        Database.markWatchInvalid({
          userId,
          userName,
          messageId,
          channelId,
          watchDateString: messageContent,
        });
        continue;
      }

      const discordChannel = await getChannel(user, channelId);
      logger.log("Channel: ", discordChannel);
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
