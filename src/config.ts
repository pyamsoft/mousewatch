/*
 * Copyright 2023 pyamsoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { newLogger } from "./bot/logger";
import env from "dotenv";

const logger = newLogger("BotConfig");

// Use require here instead of import
//
// Parse the .env file if one exists
env.config();

export interface BotConfig {
  prefix: string;
  token: string;
  specificChannel: string;
  healthCheckUrl: string;
}

export const sourceConfig = function (): BotConfig {
  const config = Object.freeze({
    prefix: process.env.BOT_PREFIX || "$",
    token: process.env.BOT_TOKEN || "",
    specificChannel: process.env.BOT_CHANNEL_ID || "",
    healthCheckUrl: process.env.BOT_HEALTHCHECK_URL || "",
  });
  logger.log("Bot Config: ", config);
  return config;
};
