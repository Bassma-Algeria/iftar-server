import { Coords, Time } from "../../../@types/helperTypes";

export interface RegisterRestaurantArgs {
  authToken: string;
  restaurantInfo: {
    name: string;
    workingTime: { opening: Time; closing: Time };
    locationName: string;
    locationCoords: Coords;
    pictures: string[];
  };
}
