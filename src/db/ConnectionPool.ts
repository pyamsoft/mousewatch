import { Pool } from "pg";
import { BotConfig } from "../config";
import { newLogger } from "../bot/logger";

const logger = newLogger("ConnectionPool");

let pool: Pool | undefined = undefined;

export const ensurePoolConnection = function (config: BotConfig): Pool {
  if (pool) {
    return pool;
  }

  if (!config.databaseUrl) {
    const msg = "Cannot open psql database connection, missing databaseUrl";
    logger.warn(msg);
    throw new Error(msg);
  }

  pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return pool;
};
