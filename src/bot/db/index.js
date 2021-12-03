const { Pool } = require("pg");
const { BotConfig } = require("../../config");
const Logger = require("../../logger");

const logger = Logger.tag("db/index");
const INSERT_WATCHES_QUERY = `INSERT INTO watches(user_id, user_name, message_id, channel_id, watch_date, valid) VALUES ($1, $2, $3, $4, $5, $6)`;
const UPDATE_WATCHES_QUERY = `UPDATE watches SET valid = $6 WHERE user_id = $1 AND user_name = $2 AND message_id = $3 AND channel_id = $4 AND watch_date = $5`;
const QUERY_WATCHES = `SELECT user_id, user_name, message_id, channel_id, watch_date FROM watches WHERE valid = $1 OR valid = $2`;
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
  getWatches: async function getWatches(all = false) {
    if (!pool) {
      logger.warn("No DB Pool, no query.");
      return [];
    }

    try {
      // If "all" is set, we get all valid or not
      const result = await pool.query(QUERY_WATCHES, [
        true,
        all ? false : true,
      ]);
      return result.rows;
    } catch (e) {
      logger.error(e, "Error getting watches from DB");
      return [];
    }
  },

  markWatchInvalid: async function markWatchInvalid({
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
      logger.log("Update watch in DB: ", {
        userId,
        userName,
        messageId,
        channelId,
        watchDateString,
      });
      await pool.query(UPDATE_WATCHES_QUERY, [
        userId,
        userName,
        messageId,
        channelId,
        watchDateString,
        false,
      ]);
      return true;
    } catch (e) {
      logger.error(e, "Error updating watch to DB: ", {
        userId,
        userName,
        messageId,
        channelId,
        watchDateString,
      });
      return false;
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
        true,
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
