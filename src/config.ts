/*
 * Copyright 2025 pyamsoft
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
import { configDotenv } from "dotenv";

const logger = newLogger("BotConfig");

export interface BotConfig {
  prefix: string;
  token: string;
  targetedChannels: ReadonlyArray<string>;
  healthCheckUrl: string;
}

export const sourceConfig = function (): BotConfig {
  configDotenv();

  const rawSpecificChannel = process.env.BOT_TARGET_CHANNEL_IDS || "";
  const config: BotConfig = Object.freeze({
    prefix: process.env.BOT_PREFIX || "$",
    token: process.env.BOT_TOKEN || "",
    healthCheckUrl: process.env.BOT_HEALTHCHECK_URL || "",
    targetedChannels: rawSpecificChannel
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s),
  });
  logger.log("Bot Config: ", config);
  return config;
};
