import { MealPeriods } from "../MealPeriods";

export interface DlrRestaurantSlot {
  requestedDate: Date;
  mealPeriod: MealPeriods;
  dateTime: Date;
  time: string;
  url: string;
}
