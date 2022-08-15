import { MealPeriods } from "./MealPeriods";

export interface DiningSlot {
  requestedDate: Date;
  mealPeriod: MealPeriods;
  mealTime: Date;
  url: string;

  date: string;
  time: string;
}
