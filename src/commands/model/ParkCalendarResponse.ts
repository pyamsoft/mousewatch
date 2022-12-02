import { DateTime } from "luxon";

export interface ParkCalendarResponse {
  objectType: "ParkCalendarResponse";

  /**
   * Raw JSON
   */
  json: any;

  /**
   * Date
   */
  date: DateTime;

  /**
   * Is the day available
   */
  available: boolean;
}
