// Parse the .env file if one exists
require("dotenv").config();

module.exports = {
  BotConfig: {
    prefix: process.env.BOT_PREFIX || "!",
    token: process.env.BOT_TOKEN || null,
    specificChannel: process.env.BOT_CHANNEL_ID || null,
  },
};
