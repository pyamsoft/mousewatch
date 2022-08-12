import { newLogger } from "./bot/logger";

const logger = newLogger("BotConfig");

// Use require here instead of import
//
// Parse the .env file if one exists
require("dotenv").config();

export interface BotConfig {
  prefix: string;
  token: string;
  specificChannel: string;
  databaseUrl: string;
}

export const sourceConfig = function (): BotConfig {
  const config = Object.freeze({
    prefix: process.env.BOT_PREFIX || "$",
    token: process.env.BOT_TOKEN || "",
    specificChannel: process.env.BOT_CHANNEL_ID || "",
    databaseUrl: process.env.BOT_DATABASE_URL || "",
  });
  logger.log("Bot Config: ", config);
  return config;
};
