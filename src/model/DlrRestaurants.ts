import { RestaurantData } from "../db/RestaurantDatabase";
import { DlrLocation } from "./DlrLocation";

export interface DlrRestaurant {
  id: string;
  name: string;
  url: string;
}

/**
 *  Pulled from network console
 *
 * https://disneyland.disney.go.com/finder/api/v1/explorer-service/list-ancestor-entities/dlr/80008297;entityType=destination/2022-08-23/dining
 */
export class DlrRestaurants {
  static CARTHAY_ALFRESCO_LOUNGE: DlrRestaurant = {
    id: "16588263",
    name: "Carthay Circle Lounge - Alfresco Dining",
    url: `${DlrLocation.CALIFORNIA_ADVENTURE}/carthay-circle-lounge`,
  };

  static CARTHAY_CIRCLE: DlrRestaurant = {
    id: "16515009",
    name: "Carthay Circle Restaurant",
    url: `${DlrLocation.CALIFORNIA_ADVENTURE}/carthay-circle-restaurant`,
  };

  static LA_BREA_BAKERY_CAFE: DlrRestaurant = {
    id: "354327",
    name: "La Brea Bakery Cafe",
    url: `${DlrLocation.DOWNTOWN_DISNEY}/la-brea-bakery-cafe`,
  };

  static NAPLES_RISTORANTE_BAR: DlrRestaurant = {
    id: "354378",
    name: "Naples Ristorante e Bar",
    url: `${DlrLocation.DOWNTOWN_DISNEY}/naples-ristorante-e-bar`,
  };

  static RALPH_BRENNANS_JAZZ_KITCHEN: DlrRestaurant = {
    id: "354435",
    name: "Ralph Brennan's Jazz Kitchen",
    url: `${DlrLocation.DOWNTOWN_DISNEY}/ralph-brennans-jazz-kitchen`,
  };

  static SPLITSVILLE_LUXURY_LANES: DlrRestaurant = {
    id: "18735825",
    name: "Splitsville Luxury Lanes",
    url: `${DlrLocation.DOWNTOWN_DISNEY}/splitsville-restaurant`,
  };

  static TORTILLA_JOS: DlrRestaurant = {
    id: "354528",
    name: "Tortilla Jo's",
    url: `${DlrLocation.DOWNTOWN_DISNEY}/tortilla-jos`,
  };

  static UVA_BAR: DlrRestaurant = {
    id: "354540",
    name: "Uva Bar & Cafe",
    url: `${DlrLocation.DOWNTOWN_DISNEY}/uva-bar-cafe`,
  };

  static CATAL_RESTAURANT: DlrRestaurant = {
    id: "354132",
    name: "Catal Restaurant",
    url: `${DlrLocation.DOWNTOWN_DISNEY}/catal-restaurant`,
  };

  static LAMPLIGHT_LOUNGE: DlrRestaurant = {
    id: "19013078",
    name: "Lamplight Lounge",
    url: `${DlrLocation.CALIFORNIA_ADVENTURE}/lamplight-lounge`,
  };

  static LAMPLIGHT_LOUNGE_BOARDWALK: DlrRestaurant = {
    id: "19629820",
    name: "Lamplight Lounge - Boardwalk Dining",
    url: `${DlrLocation.CALIFORNIA_ADVENTURE}/lamplight-lounge-boardwalk-dining`,
  };

  static BLUE_BAYOU: DlrRestaurant = {
    id: "354099",
    name: "Blue Bayou Restaurant",
    url: `${DlrLocation.DISNEYLAND}/blue-bayou-restaurant`,
  };

  static CAFE_ORLENAS: DlrRestaurant = {
    id: "354117",
    name: "Cafe Orleans",
    url: `${DlrLocation.DISNEYLAND}/cafe-orleans`,
  };

  static CARNATION_CAFE: DlrRestaurant = {
    id: "354129",
    name: "Carnation Cafe",
    url: `${DlrLocation.DISNEYLAND}/carnation-cafe`,
  };

  static GCH_CRAFTSMAN_BAR: DlrRestaurant = {
    id: "19343532",
    name: "GCH Craftsman Bar",
    url: `${DlrLocation.GRAND_CALIFORNIAN_HOTEL}/craftsman-bar`,
  };

  static GOOFYS_KITCHEN: DlrRestaurant = {
    id: "354261",
    name: "Goofy's Kitchen",
    url: `${DlrLocation.DISNEYLAND_HOTEL}/goofys-kitchen`,
  };

  static MAGIC_KEY_TERRACE: DlrRestaurant = {
    id: "15527906",
    name: "Magic Key Terrace - Magic Key Holder Dining",
    url: `${DlrLocation.CALIFORNIA_ADVENTURE}/magic-key-terrace`,
  };

  static NAPA_ROSE: DlrRestaurant = {
    id: "354372",
    name: "Napa Rose",
    url: `${DlrLocation.GRAND_CALIFORNIAN_HOTEL}/napa-rose`,
  };

  static OGAS_CANTINA: DlrRestaurant = {
    id: "19268344",
    name: "Oga's Cantina at the Disneyland Resort",
    url: `${DlrLocation.DISNEYLAND}/ogas-cantina`,
  };

  static PLAZA_INN: DlrRestaurant = {
    id: "354414",
    name: "Plaza Inn",
    url: `${DlrLocation.DISNEYLAND}/plaza-inn`,
  };

  static RIVER_BELLE_TERRACE: DlrRestaurant = {
    id: "354450",
    name: "River Belle Terrace",
    url: `${DlrLocation.DISNEYLAND}/river-belle-terrace`,
  };

  static STORYTELLERS_CAFE: DlrRestaurant = {
    id: "354474",
    name: "Storyteller's Cafe",
    url: `${DlrLocation.GRAND_CALIFORNIAN_HOTEL}/storytellers-cafe`,
  };

  static TRADER_SAM_TIKI_BAR: DlrRestaurant = {
    id: "16027513",
    name: "Trader Sam's Enchanted Tiki Bar",
    url: `${DlrLocation.DISNEYLAND_HOTEL}/trader-sams`,
  };

  static WINE_COUNTRY_TRATTORIA: DlrRestaurant = {
    id: "354555",
    name: "Wine Country Trattoria",
    url: `${DlrLocation.CALIFORNIA_ADVENTURE}/wine-country-trattoria`,
  };
}

const ALL_RESTAURANTS: DlrRestaurant[] = [
  DlrRestaurants.CARTHAY_ALFRESCO_LOUNGE,
  DlrRestaurants.LA_BREA_BAKERY_CAFE,
  DlrRestaurants.NAPLES_RISTORANTE_BAR,
  DlrRestaurants.CARTHAY_CIRCLE,
  DlrRestaurants.RALPH_BRENNANS_JAZZ_KITCHEN,
  DlrRestaurants.SPLITSVILLE_LUXURY_LANES,
  DlrRestaurants.TORTILLA_JOS,
  DlrRestaurants.UVA_BAR,
  DlrRestaurants.CATAL_RESTAURANT,
  DlrRestaurants.LAMPLIGHT_LOUNGE,
  DlrRestaurants.LAMPLIGHT_LOUNGE_BOARDWALK,
  DlrRestaurants.BLUE_BAYOU,
  DlrRestaurants.CAFE_ORLENAS,
  DlrRestaurants.CARNATION_CAFE,
  DlrRestaurants.GCH_CRAFTSMAN_BAR,
  DlrRestaurants.GOOFYS_KITCHEN,
  DlrRestaurants.MAGIC_KEY_TERRACE,
  DlrRestaurants.NAPA_ROSE,
  DlrRestaurants.OGAS_CANTINA,
  DlrRestaurants.PLAZA_INN,
  DlrRestaurants.RIVER_BELLE_TERRACE,
  DlrRestaurants.STORYTELLERS_CAFE,
  DlrRestaurants.TRADER_SAM_TIKI_BAR,
  DlrRestaurants.WINE_COUNTRY_TRATTORIA,
];

export const convertRestaurantRowToDlrRestaurant = function (
  restaurant: RestaurantData
): DlrRestaurant | undefined {
  for (const r of ALL_RESTAURANTS) {
    if (restaurant.restaurantId === r.id) {
      return r;
    }
  }

  return undefined;
};

export const getAllRestaurants = function (): DlrRestaurant[] {
  return [...ALL_RESTAURANTS];
};

export const getRestaurantsInLocation = function (
  location: DlrLocation
): DlrRestaurant[] {
  return ALL_RESTAURANTS.filter((r) => r.url.startsWith(location));
};
