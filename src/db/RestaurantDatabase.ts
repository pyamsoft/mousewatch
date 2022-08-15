import { BotConfig } from "../config";
import { createNewDatabase, Database, DatabaseResult } from "./Database";
import { newLogger } from "../bot/logger";
import { BaseDataModel, BaseDataModelRows } from "./BaseDataModel";
import { MealPeriods } from "../api/MealPeriods";

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
  restaurantUrl: string;
  restaurantId: string;
  restaurantName: string;

  mealPeriod: MealPeriods;
  partySize: number;
  mealDate: Date;

  lastCheckTime: Date;
  lastNotifyTime: Date;
}

export const RestaurantDataRows = {
  RESTAURANT_URL: "restaurant_url",
  RESTAURANT_NAME: "restaurant_name",
  RESTAURANT_ID: "restaurant_id",

  MEAL_PERIOD: "meal_period",
  PARTY_SIZE: "party_size",
  MEAL_DATE: "meal_date",

  LAST_CHECK_TIME: "last_check_time",
  LAST_NOTIFY_TIME: "last_notify_time",
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
      const d: RestaurantData = {
        id: r[BaseDataModelRows.ID],
        createdAt: new Date(r[BaseDataModelRows.CREATED_AT]),
        messageId: r[BaseDataModelRows.MESSAGE_ID],
        channelId: r[BaseDataModelRows.CHANNEL_ID],
        userName: r[BaseDataModelRows.USER_NAME],
        userId: r[BaseDataModelRows.USER_ID],

        restaurantId: r[RestaurantDataRows.RESTAURANT_ID],
        restaurantUrl: r[RestaurantDataRows.RESTAURANT_URL],
        restaurantName: r[RestaurantDataRows.RESTAURANT_NAME],

        mealDate: new Date(r[RestaurantDataRows.MEAL_DATE]),
        mealPeriod: r[RestaurantDataRows.MEAL_PERIOD],
        partySize: r[RestaurantDataRows.PARTY_SIZE],

        lastCheckTime: new Date(r[RestaurantDataRows.LAST_CHECK_TIME]),
        lastNotifyTime: new Date(r[RestaurantDataRows.LAST_NOTIFY_TIME]),
      };
      return d;
    });
  },
};
