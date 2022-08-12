import { BotConfig } from "../config";
import { createNewDatabase, Database, DatabaseResult } from "./Database";
import { newLogger } from "../bot/logger";
import { BaseDataModel, BaseDataModelRows } from "./BaseDataModel";

const logger = newLogger("RestaurantDatabase");

let database: Database | undefined = undefined;

export const ensureDefaultDatabase = function (config: BotConfig): Database {
  if (database) {
    return database;
  }

  database = createNewDatabase(config);
  return database;
};

const TABLE_NAME = "restaurant_data";

export interface RestaurantData extends BaseDataModel {
  restaurantName: string;
}

export const RestaurantDataRows = {
  RESTAURANT_NAME: "restaurant_name",
};

export const RestaurantDatabase = {
  restore: async function (config: BotConfig) {
    const db = ensureDefaultDatabase(config);
    logger.log("Restore restaurant database: ", db);
  },

  getAllRestaurants: async function (
    config: BotConfig
  ): Promise<DatabaseResult<RestaurantData[]>> {
    const db = ensureDefaultDatabase(config);
    return await db.query(`SELECT * FROM ${TABLE_NAME}`, [], (r: any) => {
      return {
        id: r[BaseDataModelRows.ID],
        createdAt: new Date(r[BaseDataModelRows.CREATED_AT]),
        messageId: r[BaseDataModelRows.MESSAGE_ID],
        channelId: r[BaseDataModelRows.CHANNEL_ID],
        userName: r[BaseDataModelRows.USER_NAME],
        userId: r[BaseDataModelRows.USER_ID],
        restaurantName: r[RestaurantDataRows.RESTAURANT_NAME],
      };
    });
  },
};
