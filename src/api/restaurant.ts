import { RestaurantData } from "../db/RestaurantDatabase";
import { DiningSlot } from "../model/DiningSlot";
import { newLogger } from "../bot/logger";
import { DefaultDlrApi, DlrApi } from "./dlr";
import { convertRestaurantRowToDlrRestaurant } from "../model/DlrRestaurants";

const logger = newLogger("api/restaurant");

const resolveDlrApi = function (
  env:
    | {
        api?: DlrApi;
      }
    | undefined
): DlrApi {
  if (!env) {
    return DefaultDlrApi;
  } else if (!env.api) {
    return DefaultDlrApi;
  } else {
    return env.api;
  }
};

export const getReservationAvailabilityForRestaurant = async function (
  restaurant: RestaurantData,
  env?: {
    api?: DlrApi;
  }
): Promise<DiningSlot[]> {
  const dlrRestaurant = convertRestaurantRowToDlrRestaurant(restaurant);
  if (!dlrRestaurant) {
    logger.warn(
      "Unable to convert RestaurantData to DLR restaurant",
      restaurant
    );
    return [];
  }

  try {
    const dlrResult = await resolveDlrApi(env).getAvailableSlots({
      restaurant: dlrRestaurant,
      mealPeriod: restaurant.mealPeriod,
      partySize: restaurant.partySize,
      date: restaurant.mealDate,
    });

    return dlrResult.map((r) => {
      return {
        requestedDate: r.requestedDate,
        mealPeriod: r.mealPeriod,
        mealTime: r.dateTime,
        url: r.url,

        get time() {
          return `${this.mealTime.getHours()}:${this.mealTime.getMinutes()}`;
        },

        get date() {
          return `${this.mealTime.getMonth()}/${this.mealTime.getDate()}/${this.mealTime.getFullYear()}`;
        },
      };
    });
  } catch (e: any) {
    logger.error(
      e,
      "Error getting reservation availability for restaurant: ",
      restaurant
    );
    return [];
  }
};
