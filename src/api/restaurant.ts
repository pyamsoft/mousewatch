import { RestaurantData } from "../db/RestaurantDatabase";
import { DiningSlot } from "./DiningSlot";
import { newLogger } from "../bot/logger";
import { DefaultDlrApi, DlrApi } from "./disney/dlr";

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
  try {
    const dlrResult = await resolveDlrApi(env).getAvailableSlots({
      restaurantId: restaurant.restaurantId,
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
