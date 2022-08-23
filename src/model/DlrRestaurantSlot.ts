import { MealPeriods } from "./MealPeriods";
import { DlrRestaurant } from "./DlrRestaurants";

export interface DlrRestaurantSlot {
  restaurant: DlrRestaurant;
  requestedDate: Date;
  mealPeriod: MealPeriods;
  dateTime: Date;
  time: string;
  url: string;
}
