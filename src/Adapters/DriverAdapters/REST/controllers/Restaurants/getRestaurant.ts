import { ControllerFunction, STATUS_CODES } from "../../@types/RequestResponse.interfaces";
import { restaurantsService } from "../../../../../Ports/DriverPorts/RestaurantsService";
import { makeRestController } from "../RestControllerFactory";

const getRestaurant: ControllerFunction = makeRestController(({ params }) => {
  const { restaurantId } = params;

  return restaurantsService.getRestaurantById(restaurantId);
});

export { getRestaurant };
