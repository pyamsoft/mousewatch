import { BaseLooper } from "./BaseLooper";
import { RestaurantData } from "../db/RestaurantDatabase";
import { DiningSlot } from "../model/DiningSlot";
import { getReservationAvailabilityForRestaurant } from "../api/restaurant";
import { newLogger } from "../bot/logger";
import { Looper } from "./Looper";

const logger = newLogger("RestaurantLooper");

class RestaurantLooperImpl extends BaseLooper<RestaurantData, DiningSlot[]> {
  loopPeriod = 15;

  // Open constructor
  public constructor() {
    super();
  }

  upstream = async (data: RestaurantData) => {
    try {
      const slots = await getReservationAvailabilityForRestaurant(data);

      logger.log("Availability for restaurant: ", {
        restaurant: data,
        slots,
      });

      return slots;
    } catch (e: any) {
      logger.error(e, "Error getting restaurant availability: ", data);
      return [];
    }
  };
}

// Our global looper
export const RestaurantLooper: Looper<RestaurantData, DiningSlot[]> =
  new RestaurantLooperImpl();
