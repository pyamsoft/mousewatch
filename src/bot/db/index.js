const { Pool } = require("pg");
const { BotConfig } = require("../../config");
const Logger = require("../../logger");

const logger = Logger.tag("db/index");
const INSERT_WATCHES_QUERY = `INSERT INTO watches(user_id, user_name, message_id, channel_id, watch_date) VALUES ($1, $2, $3, $4, $5)`;
const QUERY_WATCHES = `SELECT user_id, user_name, message_id, channel_id, watch_date FROM watches`;
const REMOVE_SINGLE_WATCH = `DELETE FROM watches WHERE user_id = $1 AND watch_date = $2`;
const REMOVE_ALL_WATCHES = `DELETE FROM watches WHERE user_id = $1`;

let pool;
if (BotConfig.dbUrl) {
  pool = new Pool({
    connectionString: BotConfig.dbUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

module.exports = {
  getWatches: async function getWatches() {
    if (!pool) {
      logger.warn("No DB Pool, no query.");
      return [];
    }

    try {
      const result = await pool.query(QUERY_WATCHES);
      return result.rows;
    } catch (e) {
      logger.error(e, "Error getting watches from DB");
      return [];
    }
  },

  addWatch: async function addWatch({
    userId,
    userName,
    messageId,
    channelId,
    watchDateString,
  }) {
    if (!pool) {
      logger.warn("No DB Pool, no query.");
      return false;
    }

    try {
      logger.log("Add watch to DB: ", {
        userId,
        userName,
        messageId,
        channelId,
        watchDateString,
      });
      await pool.query(INSERT_WATCHES_QUERY, [
        userId,
        userName,
        messageId,
        channelId,
        watchDateString,
      ]);
      return true;
    } catch (e) {
      logger.error(e, "Error inserting watch to DB: ", {
        userId,
        userName,
        messageId,
        channelId,
        watchDateString,
      });
      return false;
    }
  },

  removeWatch: async function removeWatch({ userId, watchDateString }) {
    if (!pool) {
      logger.warn("No DB Pool, no query.");
      return false;
    }

    if (watchDateString) {
      try {
        logger.log("Delete watche from DB: ", {
          userId,
          watchDateString,
        });
        await pool.query(REMOVE_SINGLE_WATCH, [userId, watchDateString]);
        return true;
      } catch (e) {
        logger.error(e, "Error deleting single watch from DB: ", {
          userId,
          watchDateString,
        });
        return [];
      }
    } else {
      try {
        logger.log("Delete all watches from DB: ", {
          userId,
        });
        await pool.query(REMOVE_ALL_WATCHES, [userId]);
        return true;
      } catch (e) {
        logger.error(e, "Error deleting all watches from DB: ", {
          userId,
        });
        return [];
      }
    }
  },

  shutdown: function shutdown() {
    if (!pool) {
      logger.log("Shutting down DB pool");
      pool.end();
      pool = null;
    }
  },
};
