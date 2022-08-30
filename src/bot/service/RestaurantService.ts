import { RestaurantData } from "../../db/RestaurantDatabase";
import { RestaurantLooper } from "../../looper/RestaurantLooper";
import { newLogger } from "../logger";

const logger = newLogger("RestaurantService");

const watchAndNotifyRestaurantSlots = async function (
  restaurant: RestaurantData
) {
  RestaurantLooper.submit(restaurant, (slots) => {
    logger.log("Slots found for restaurant: ", {
      restaurant,
      slots,
    });
  });
};

export const watchAndNotifyRestaurantAvailability = function (
  restaurants: RestaurantData | RestaurantData[]
) {
  Promise.resolve().then(async () => {
    const watchers = [];

    let data: RestaurantData[];
    if (Array.isArray(restaurants)) {
      data = restaurants;
    } else {
      data = [restaurants];
    }

    for (const restaurant of data) {
      watchers.push(watchAndNotifyRestaurantSlots(restaurant));
    }

    return await Promise.all(watchers);
  });
};
