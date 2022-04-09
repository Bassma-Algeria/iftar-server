import { restaurantsService } from "../../../../../Ports/DriverPorts/RestaurantsService";
import { ControllerFunction } from "../../@types/RequestResponse.interfaces";
import { makeRestController } from "../RestControllerFactory";

const getAllRestaurants: ControllerFunction = makeRestController(async () => {
  const restaurants = await restaurantsService.getAllRestaurants();

  return restaurants.map(({ locationCoords, name, restaurantId }) => ({
    locationCoords,
    name,
    restaurantId,
  }));
});

export { getAllRestaurants };
