import { jsonApi } from "../../util/api";
import { URLSearchParams } from "url";
import { MealPeriods } from "../MealPeriods";
import { DlrRestaurantSlot } from "./DlrRestaurantSlot";
import { newLogger } from "../../bot/logger";

const logger = newLogger("api/dlr");

const USER_SESSION_IDS = [
  "B9AB3A4B-4758-4A87-9456-C1697C201B5A",
  "BC0EB0021-0D9D-43E5-B5D8-E74E2A4F8B43",
];

const DINING_ENDPOINT =
  "https://disneyland.disney.go.com/finder/api/v1/explorer-service/dining-availability";

export interface DlrApi {
  getAvailableSlots(data: {
    restaurantId: string;
    mealPeriod: MealPeriods;
    partySize: number;
    date: Date;
  }): Promise<DlrRestaurantSlot[]>;
}

const resolveDateString = function (date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const resolveUserSessionId = function (): string {
  const index = Math.floor(Math.random() * USER_SESSION_IDS.length);
  return USER_SESSION_IDS[index];
};

const resolveMealPeriodId = function (mealPeriod: MealPeriods): string {
  switch (mealPeriod) {
    case MealPeriods.BREAKFAST:
      return "";
    case MealPeriods.LUNCH:
      return "80000714";
    case MealPeriods.DINNER:
      return "80000717";
    case MealPeriods.BRUNCH:
      return "";
    default:
      throw new Error(`Invalid meal period: ${mealPeriod}`);
  }
};

export const DefaultDlrApi: DlrApi = {
  async getAvailableSlots(data: {
    restaurantId: string;
    mealPeriod: MealPeriods;
    partySize: number;
    date: Date;
  }): Promise<DlrRestaurantSlot[]> {
    const userSessionId = `{${resolveUserSessionId()}}`;
    const { restaurantId, mealPeriod, partySize, date } = data;

    const params = new URLSearchParams();
    params.set("mealPeriod", resolveMealPeriodId(mealPeriod));

    try {
      const result: any = await jsonApi(
        `${DINING_ENDPOINT}/${userSessionId}/dlr/${restaurantId};entityType=restaurant/table-service/${partySize}/${resolveDateString(
          date
        )}/?${params.toString()}`
      );

      if (
        result.offers &&
        Array.isArray(result.offers) &&
        result.offers.length > 0
      ) {
        const slots = [];
        for (const offer of result.offers) {
          slots.push({
            url: offer.url,
            time: offer.time,
            dateTime: new Date(offer.dateTime),
            mealPeriod,
            requestedDate: date,
          });
        }

        return slots;
      } else {
        logger.warn("No DLR dining slots available: ", {
          restaurantId,
          mealPeriod,
          partySize,
          date,
        });
        return [];
      }
    } catch (e: any) {
      logger.error("Failed to find DLR dining slots: ", {
        error: e,
        restaurantId,
        mealPeriod,
        partySize,
        date,
      });
      return [];
    }
  },
};
