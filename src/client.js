const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGES,
  ],
  partials: ["MESSAGE", "CHANNEL"],
});

module.exports = {
  Client: client,
};
